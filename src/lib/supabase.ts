import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'evkal_supabase_url';
const STORAGE_KEY_ANON = 'evkal_supabase_anon_key';

// Default / fallback placeholder values
const FALLBACK_URL = 'https://demo-evkal.supabase.co';
const FALLBACK_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_for_evkal_fallback';

export function getActiveSupabaseConfig(): {
  url: string;
  anonKey: string;
  source: 'env' | 'custom' | 'none';
  isConfigured: boolean;
} {
  const customUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) : null;
  const customAnon = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_ANON) : null;

  if (customUrl && customAnon) {
    return {
      url: customUrl.trim(),
      anonKey: customAnon.trim(),
      source: 'custom',
      isConfigured: true,
    };
  }

  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envAnon && !envUrl.includes('placeholder') && !envUrl.includes('your-project')) {
    return {
      url: envUrl.trim(),
      anonKey: envAnon.trim(),
      source: 'env',
      isConfigured: true,
    };
  }

  return {
    url: envUrl?.trim() || FALLBACK_URL,
    anonKey: envAnon?.trim() || FALLBACK_ANON_KEY,
    source: 'none',
    isConfigured: false,
  };
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  const config = getActiveSupabaseConfig();
  if (!supabaseInstance) {
    supabaseInstance = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseInstance;
}

export const supabase = getSupabase();

export function saveCustomSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
    // Re-initialize singleton instance
    supabaseInstance = createClient(url.trim(), anonKey.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
}

export function clearCustomSupabaseConfig(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_ANON);
    const config = getActiveSupabaseConfig();
    supabaseInstance = createClient(config.url, config.anonKey);
  }
}

export interface DatabaseVerificationResult {
  isConfigured: boolean;
  success: boolean;
  source: 'env' | 'custom' | 'none';
  latencyMs: number;
  message: string;
  checks: {
    urlValid: boolean;
    authReachable: boolean;
    restReachable: boolean;
    schemaReady: boolean;
  };
  details?: Record<string, unknown>;
}

/**
 * Live verification probe for Supabase database & authentication
 */
export async function verifyDatabaseConnection(): Promise<DatabaseVerificationResult> {
  const config = getActiveSupabaseConfig();
  const startTime = performance.now();

  const checks = {
    urlValid: false,
    authReachable: false,
    restReachable: false,
    schemaReady: false,
  };

  if (!config.isConfigured) {
    return {
      isConfigured: false,
      success: false,
      source: config.source,
      latencyMs: 0,
      message: 'Supabase credentials not set. Running in local simulation mode.',
      checks,
    };
  }

  // 1. Verify URL syntax
  try {
    const parsed = new URL(config.url);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      checks.urlValid = true;
    }
  } catch {
    return {
      isConfigured: true,
      success: false,
      source: config.source,
      latencyMs: Math.round(performance.now() - startTime),
      message: 'Invalid Supabase Project URL format. Must start with https://',
      checks,
    };
  }

  // 2. Probe Auth Health
  try {
    const authHealthRes = await fetch(`${config.url}/auth/v1/health`, {
      method: 'GET',
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
      },
    });

    if (authHealthRes.ok || authHealthRes.status === 200 || authHealthRes.status === 404) {
      checks.authReachable = true;
    }
  } catch (err) {
    console.warn('[Supabase probe] Auth ping error:', err);
  }

  // 3. Probe REST Endpoint
  try {
    const restRes = await fetch(`${config.url}/rest/v1/`, {
      method: 'GET',
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
      },
    });

    if (restRes.ok || restRes.status === 200 || restRes.status === 401) {
      checks.restReachable = true;
    }
  } catch (err) {
    console.warn('[Supabase probe] REST ping error:', err);
  }

  // 4. Probe Database Profiles Table
  try {
    const client = getSupabase();
    const { error } = await client
      .from('profiles')
      .select('count', { count: 'exact', head: true });

    if (!error) {
      checks.schemaReady = true;
    } else if (error.code === 'PGRST116' || error.message.includes('permission denied')) {
      // Table exists but RLS is active
      checks.schemaReady = true;
    } else {
      console.info('[Supabase probe] Table check info:', error.message);
    }
  } catch (err) {
    console.warn('[Supabase probe] Schema probe error:', err);
  }

  const latencyMs = Math.round(performance.now() - startTime);
  const overallSuccess = checks.urlValid && (checks.authReachable || checks.restReachable);

  return {
    isConfigured: true,
    success: overallSuccess,
    source: config.source,
    latencyMs,
    message: overallSuccess
      ? `Supabase connected successfully in ${latencyMs}ms (${checks.schemaReady ? 'Tables Ready' : 'Tables Pending Schema Migration'})`
      : 'Could not establish connection to Supabase. Check Project URL and Anon Key.',
    checks,
  };
}
