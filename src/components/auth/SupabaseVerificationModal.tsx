import { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCw,
  Copy,
  Check,
  ExternalLink,
  X,
  Zap,
} from 'lucide-react';
import {
  getActiveSupabaseConfig,
  saveCustomSupabaseConfig,
  clearCustomSupabaseConfig,
  verifyDatabaseConnection,
  type DatabaseVerificationResult,
} from '../../lib/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SupabaseVerificationModal({ isOpen, onClose }: Props) {
  const [config, setConfig] = useState(getActiveSupabaseConfig());
  const [inputUrl, setInputUrl] = useState('');
  const [inputAnonKey, setInputAnonKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<DatabaseVerificationResult | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const active = getActiveSupabaseConfig();
      setConfig(active);
      setInputUrl(active.url.includes('placeholder') || active.url.includes('dummy') ? '' : active.url);
      setInputAnonKey(active.anonKey.includes('dummy') ? '' : active.anonKey);
      runVerification();
    }
  }, [isOpen]);

  async function runVerification() {
    setIsVerifying(true);
    try {
      const res = await verifyDatabaseConnection();
      setResult(res);
      setConfig(getActiveSupabaseConfig());
    } finally {
      setIsVerifying(false);
    }
  }

  function handleSaveAndTest() {
    if (!inputUrl.trim() || !inputAnonKey.trim()) {
      alert('Please provide both Supabase Project URL and Anon API Key.');
      return;
    }
    saveCustomSupabaseConfig(inputUrl.trim(), inputAnonKey.trim());
    runVerification();
  }

  function handleResetToEnv() {
    clearCustomSupabaseConfig();
    const active = getActiveSupabaseConfig();
    setInputUrl(active.url.includes('dummy') ? '' : active.url);
    setInputAnonKey(active.anonKey.includes('dummy') ? '' : active.anonKey);
    runVerification();
  }

  function copySqlSchema() {
    const sqlNotice = `-- Run this in Supabase Dashboard -> SQL Editor\n-- File located at: supabase/schema.sql\n\n-- Create Profiles table\nCREATE TABLE IF NOT EXISTS public.profiles (\n    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,\n    email TEXT NOT NULL UNIQUE,\n    full_name TEXT NOT NULL,\n    account_type TEXT DEFAULT 'Individual',\n    created_at TIMESTAMPTZ DEFAULT NOW()\n);\nALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;\nCREATE POLICY "Profiles viewable" ON public.profiles FOR SELECT TO authenticated USING (true);`;
    navigator.clipboard.writeText(sqlNotice);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white">
                  Supabase Database &amp; Auth Diagnostics
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                  PostgreSQL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Verify live database connection, authentication endpoints, and table readiness.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Status Card */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            result?.success
              ? 'bg-emerald-950/30 border-emerald-500/40'
              : config.isConfigured
              ? 'bg-amber-950/30 border-amber-500/40'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                {result?.success ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                )}
              </span>
              <span className="text-sm font-bold text-white">
                {result?.success
                  ? 'Database Connected & Verified'
                  : config.isConfigured
                  ? 'Connection Check Incomplete'
                  : 'Running in Local Standalone Mode'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {result && (
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-slate-300">
                  {result.latencyMs} ms
                </span>
              )}
              <button
                onClick={runVerification}
                disabled={isVerifying}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer disabled:opacity-50"
              >
                <RotateCw className={`h-3.5 w-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                <span>{isVerifying ? 'Pinging...' : 'Test Connection'}</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-medium mb-3">
            {result?.message || 'Click "Test Connection" to check database and auth endpoints.'}
          </p>

          {/* Diagnostics Checks Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 text-xs">
            <div className="flex items-center gap-1.5">
              {result?.checks.urlValid ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              )}
              <span className="text-slate-300">URL Format</span>
            </div>

            <div className="flex items-center gap-1.5">
              {result?.checks.authReachable ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              )}
              <span className="text-slate-300">Auth Health</span>
            </div>

            <div className="flex items-center gap-1.5">
              {result?.checks.restReachable ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              )}
              <span className="text-slate-300">REST API</span>
            </div>

            <div className="flex items-center gap-1.5">
              {result?.checks.schemaReady ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              )}
              <span className="text-slate-300">
                {result?.checks.schemaReady ? 'Tables Ready' : 'Tables Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Credentials Form */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Supabase Project Credentials
            </h4>
            <span className="text-[11px] font-mono text-emerald-400">
              Source: {config.source === 'env' ? '.env file' : config.source === 'custom' ? 'Browser storage' : 'Default/Fallback'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Project URL (<code className="text-emerald-400">VITE_SUPABASE_URL</code>)
            </label>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://your-project-ref.supabase.co"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Anon Public API Key (<code className="text-emerald-400">VITE_SUPABASE_ANON_KEY</code>)
            </label>
            <input
              type="password"
              value={inputAnonKey}
              onChange={(e) => setInputAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveAndTest}
                disabled={isVerifying}
                className="px-4 py-2 rounded-xl bg-[#00E599] hover:bg-[#00c984] text-slate-950 text-xs font-black transition-all cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(0,229,153,0.4)]"
              >
                Save &amp; Verify Credentials
              </button>
              {config.source === 'custom' && (
                <button
                  type="button"
                  onClick={handleResetToEnv}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  Reset to .env
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={copySqlSchema}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {copiedSchema ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedSchema ? 'SQL Copied!' : 'Copy Schema SQL'}</span>
            </button>
          </div>
        </div>

        {/* 3-Step Setup Quick Guide */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              Quick Setup Guide (Supabase.com)
            </span>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-semibold text-[11px]"
            >
              <span>Open Dashboard</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <ol className="space-y-1.5 text-slate-400 list-decimal list-inside leading-relaxed text-[11px]">
            <li>Create a new project on <strong className="text-slate-200">Supabase.com</strong> (Free tier).</li>
            <li>Go to <strong className="text-slate-200">SQL Editor</strong>, open <code className="text-emerald-400 font-mono">supabase/schema.sql</code>, and click <strong>Run</strong>.</li>
            <li>Copy your <strong className="text-slate-200">Project URL</strong> and <strong className="text-slate-200">anon key</strong> from <em>Project Settings → API</em> into the inputs above or your <code className="text-emerald-400 font-mono">.env</code> file.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
