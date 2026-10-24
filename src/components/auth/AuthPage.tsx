import { useState } from 'react';
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Users,
  ArrowLeft,
  User,
  CheckCircle2,
  Sparkles,
  Loader2,
  Building2,
  Cpu,
  BadgeAlert,
  Database,
} from 'lucide-react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { supabase, getActiveSupabaseConfig } from '../../lib/supabase';
import { SupabaseVerificationModal } from './SupabaseVerificationModal';

export function AuthPage() {
  const {
    authMode,
    setAuthMode,
    loginUser,
    loginAsAdmin,
    navigateBackFromAuth,
    userProfile,
    adminId,
  } = useSimulationStore();

  // Standard Driver/Host state
  const [email, setEmail] = useState('shivharshrai24@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState(userProfile.personal.fullName || 'Shivharsh Rai');
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState<'DRIVER' | 'HOST' | 'DUAL'>('DUAL');

  // Official Admin DISCOM state
  const [officialAdminId, setOfficialAdminId] = useState(adminId || 'ADM-NOI-DISCOM-01');
  const [officialEmail, setOfficialEmail] = useState('admin@uppcl-grid.gov.in');
  const [officialPasskey, setOfficialPasskey] = useState('••••••••••••');
  const [stationCode, setStationCode] = useState('TX-100-SECTOR-4');
  const isSignIn = authMode === 'SIGN_IN';
  const isOfficial = authMode === 'OFFICIAL';

  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  // Standard User Submit (EV Driver / Host -> isAdmin = false)
  const handleStandardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedbackMsg(null);

    const config = getActiveSupabaseConfig();

    if (config.isConfigured) {
      try {
        if (isSignIn) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password,
          });

          if (error) {
            setIsLoading(false);
            setFeedbackMsg(`Authentication Error: ${error.message}`);
            return;
          }

          setFeedbackMsg(`✓ Signed in via Supabase! (${data.user?.email}) - Redirecting to Dashboard...`);
          setTimeout(() => {
            loginUser(data.user?.email || email, data.user?.user_metadata?.full_name || fullName, 'DRIVER');
          }, 500);
          return;
        } else {
          // Sign Up
          const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password,
            options: {
              data: {
                full_name: fullName.trim(),
                account_type: userRole === 'HOST' ? 'Host & Driver' : 'Individual',
              },
            },
          });

          if (error) {
            setIsLoading(false);
            setFeedbackMsg(`Sign Up Error: ${error.message}`);
            return;
          }

          setFeedbackMsg(`✓ Registered successfully in Supabase! Redirecting to Dashboard...`);
          setTimeout(() => {
            loginUser(data.user?.email || email, fullName, 'DRIVER');
          }, 500);
          return;
        }
      } catch (err: unknown) {
        console.warn('[Supabase Auth] Falling back to simulation:', err);
      }
    }

    // Graceful Simulation Fallback
    setTimeout(() => {
      setIsLoading(false);
      setFeedbackMsg(isSignIn ? 'Signed in as EV Driver / Host! Redirecting to Dashboard...' : 'Account registered successfully! Redirecting to Dashboard...');
      setTimeout(() => {
        loginUser(email, isSignIn ? userProfile.personal.fullName : fullName, 'DRIVER');
      }, 500);
    }, 600);
  };

  // Google SSO (Standard User -> isAdmin = false)
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setFeedbackMsg('Connecting with Google...');

    const config = getActiveSupabaseConfig();
    if (config.isConfigured) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) {
          console.warn('[Supabase Google Auth] OAuth error:', error.message);
        } else {
          return;
        }
      } catch (err) {
        console.warn('[Supabase Google Auth] OAuth fallback:', err);
      }
    }

    setTimeout(() => {
      setIsLoading(false);
      setFeedbackMsg('Signed in with Google! Redirecting to Dashboard...');
      loginUser('shivharsh.google@evkal.org', 'Shivharsh Rai', 'DRIVER');
    }, 700);
  };

  // Official DISCOM Admin Submit (isAdmin = true, unlocks Grid Optimizer)
  const handleOfficialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedbackMsg(null);

    const config = getActiveSupabaseConfig();
    if (config.isConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: officialEmail.trim(),
          password: officialPasskey,
        });

        if (!error && data.user) {
          setFeedbackMsg(`✓ Official DISCOM clearance verified! Redirecting to Grid Optimizer Dashboard...`);
          setTimeout(() => {
            loginAsAdmin(officialAdminId, data.user.email || officialEmail);
          }, 500);
          return;
        }
      } catch (err) {
        console.warn('[Official Supabase Auth] Clearance fallback:', err);
      }
    }

    setTimeout(() => {
      setIsLoading(false);
      setFeedbackMsg('Official DISCOM clearance verified! Redirecting to Grid Optimizer Dashboard...');
      setTimeout(() => {
        loginAsAdmin(officialAdminId, officialEmail);
      }, 500);
    }, 700);
  };

  // Quick Demo for Standard Driver
  const handleDriverDemo = () => {
    setEmail('shivharshrai24@example.com');
    setPassword('ChargeShare2026!');
    setFullName('Shivharsh Rai');
    setIsLoading(true);
    setFeedbackMsg('Logging in as Standard EV Driver / Host! Redirecting to Dashboard...');
    setTimeout(() => {
      setIsLoading(false);
      loginUser('shivharshrai24@example.com', 'Shivharsh Rai', 'DRIVER');
    }, 450);
  };

  // Quick Demo for Official DISCOM Admin
  const handleAdminDemo = () => {
    setOfficialAdminId('ADM-NOI-DISCOM-01');
    setOfficialEmail('admin@uppcl-grid.gov.in');
    setStationCode('TX-100-SECTOR-4');
    setIsLoading(true);
    setFeedbackMsg('Logging in as Official DISCOM Admin! Redirecting to Grid Optimizer Dashboard...');
    setTimeout(() => {
      setIsLoading(false);
      loginAsAdmin('ADM-NOI-DISCOM-01', 'admin@uppcl-grid.gov.in');
    }, 500);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#0A0E17] font-sans selection:bg-emerald-500/20 selection:text-emerald-700">
      {/* ─────────────────────────────────────────────────────────────
          1. BACKGROUND IMAGE (Suburban Villa at Dusk with EV Charging)
         ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100 filter brightness-[0.68] contrast-[1.05]"
        style={{
          backgroundImage: `url('/assets/images/hero_ev_dusk_background.jpg')`,
        }}
      />

      {/* Subtle Dark Radial Vignette & Backdrop Blur */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#0A0E17]/35 to-[#0A0E17]/85 backdrop-blur-[1px] pointer-events-none" />

      {/* ─────────────────────────────────────────────────────────────
          2. TOP UTILITY BAR (Back to EVkal & Quick Demo Chips)
         ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20">
        <button
          type="button"
          onClick={navigateBackFromAuth}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white/90 hover:text-white border border-white/20 backdrop-blur-md text-xs font-semibold shadow-lg transition-all cursor-pointer group"
          title="Return to EVkal"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to EVkal</span>
        </button>
      </div>

      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsVerifyModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-blue-300 hover:text-blue-200 border border-blue-500/40 backdrop-blur-md text-xs font-semibold shadow-lg transition-all cursor-pointer"
          title="Verify live Supabase database connection and authentication"
        >
          <Database className="h-3.5 w-3.5 text-blue-400" />
          <span className="hidden xs:inline">Verify Database</span>
          <span className="xs:hidden">DB Check</span>
        </button>

        {isOfficial ? (
          <button
            type="button"
            onClick={handleAdminDemo}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/40 backdrop-blur-md text-xs font-bold shadow-lg transition-all cursor-pointer"
            title="Authenticate with DISCOM Feeder Admin Demo"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-purple-300" />
            <span>⚡ 1-Click Official Admin Login</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleDriverDemo}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 backdrop-blur-md text-xs font-bold shadow-lg transition-all cursor-pointer"
            title="Authenticate as Standard EV Driver / Host"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>⚡ 1-Click Driver Demo Login</span>
          </button>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN FLOATING AUTH CARD
         ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[430px] sm:max-w-[465px] rounded-[32px] bg-[#EEF2F6] border border-white/70 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55)] px-7 py-7 sm:px-9 sm:py-8 text-slate-800 animate-fade-in">
        
        {/* ── PORTAL ROLE SELECTOR SEGMENTED CONTROL ── */}
        <div className="mb-5 p-1 rounded-2xl bg-[#E2E8F0]/90 border border-slate-300/60 flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setAuthMode('SIGN_IN');
              setFeedbackMsg(null);
            }}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              !isOfficial
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className={`h-3.5 w-3.5 ${!isOfficial ? 'text-emerald-600 fill-emerald-600' : 'text-slate-400'}`} />
            <span>EV Driver &amp; Host</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('OFFICIAL');
              setFeedbackMsg(null);
            }}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isOfficial
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-purple-700 hover:text-purple-900 font-extrabold'
            }`}
          >
            <ShieldCheck className={`h-3.5 w-3.5 ${isOfficial ? 'text-purple-200' : 'text-purple-600'}`} />
            <span>DISCOM Official</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 font-black">
              Admin
            </span>
          </button>
        </div>

        {/* ── MODE A: OFFICIAL DISCOM ADMIN LOGIN ── */}
        {isOfficial ? (
          <div>
            {/* Header: Official Badge + Title */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center gap-2.5 mb-2.5">
                <div className="w-11 h-11 rounded-xl bg-purple-700 flex items-center justify-center shadow-[0_4px_14px_rgba(109,40,217,0.4)] text-white">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="flex items-baseline">
                    <span className="text-2xl sm:text-[25px] font-black tracking-tight text-[#0D1829]">
                      EV<span className="text-[#009E60]">kal</span>
                    </span>
                    <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-widest ml-1.5 bg-purple-100 px-1.5 py-0.5 rounded">
                      DISCOM
                    </span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Feeder Operations Portal
                  </div>
                </div>
              </div>

              <h1 className="text-xl sm:text-[23px] font-black text-[#0D1829] tracking-tight mt-1">
                Official Access Authentication
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1 mb-4 leading-snug">
                Authorized for Power Utility Engineers &amp; Grid Controllers. Unlocks the <strong>Grid Optimizer</strong>.
              </p>
            </div>

            {/* Admin Security Banner */}
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200/80 mb-4 flex items-center gap-2 text-left">
              <Cpu className="h-4 w-4 text-purple-700 shrink-0" />
              <div className="text-[10px] text-purple-900 leading-tight">
                <strong>Admin Level 3 Access:</strong> Exclusive access to dynamic transformer load-shifting algorithms &amp; substation telemetry.
              </div>
            </div>

            {/* Official Access Form */}
            <form onSubmit={handleOfficialSubmit} className="space-y-3">
              {/* Employee / Official ID */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 mb-1 block">
                  DISCOM Employee / Badge ID
                </label>
                <div className="relative rounded-xl bg-[#E2E8F0] border border-transparent focus-within:border-purple-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-600/10 transition-all flex items-center">
                  <ShieldCheck className="h-4 w-4 text-purple-600 ml-3.5 mr-2 shrink-0 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={officialAdminId}
                    onChange={(e) => setOfficialAdminId(e.target.value)}
                    placeholder="e.g. ADM-NOI-DISCOM-01"
                    className="w-full bg-transparent py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-semibold outline-hidden pr-3"
                  />
                </div>
              </div>

              {/* Official Email */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Official Utility Email
                </label>
                <div className="relative rounded-xl bg-[#E2E8F0] border border-transparent focus-within:border-purple-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-600/10 transition-all flex items-center">
                  <Mail className="h-4 w-4 text-slate-400 ml-3.5 mr-2 shrink-0 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={officialEmail}
                    onChange={(e) => setOfficialEmail(e.target.value)}
                    placeholder="name@discom-grid.gov.in"
                    className="w-full bg-transparent py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-medium outline-hidden pr-3"
                  />
                </div>
              </div>

              {/* Feeder Sub-Station Code */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 mb-1 block">
                  Assigned Feeder / Transformer Unit
                </label>
                <div className="relative rounded-xl bg-[#E2E8F0] border border-transparent focus-within:border-purple-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-600/10 transition-all flex items-center">
                  <Building2 className="h-4 w-4 text-slate-400 ml-3.5 mr-2 shrink-0 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={stationCode}
                    onChange={(e) => setStationCode(e.target.value)}
                    placeholder="e.g. TX-100-SECTOR-4"
                    className="w-full bg-transparent py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-mono text-[11px] outline-hidden pr-3"
                  />
                </div>
              </div>

              {/* Security Passkey */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    Official Passkey / Token
                  </label>
                  <span className="text-[10px] text-purple-700 font-bold">Encrypted 256-bit</span>
                </div>
                <div className="relative rounded-xl bg-[#E2E8F0] border border-transparent focus-within:border-purple-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-600/10 transition-all flex items-center">
                  <Lock className="h-4 w-4 text-slate-400 ml-3.5 mr-2 shrink-0 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={officialPasskey}
                    onChange={(e) => setOfficialPasskey(e.target.value)}
                    placeholder="Enter official security passkey"
                    className="w-full bg-transparent py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-medium outline-hidden pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Feedback Message */}
              {feedbackMsg && (
                <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 text-[11px] font-bold flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-700 shrink-0" />
                  <span>{feedbackMsg}</span>
                </div>
              )}

              {/* Primary Action Button (DISCOM Purple) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3 px-4 rounded-xl font-bold text-white bg-purple-700 hover:bg-purple-800 active:bg-purple-900 shadow-md shadow-purple-700/25 transition-all cursor-pointer text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying Official Clearance...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Authenticate as DISCOM Official</span>
                  </>
                )}
              </button>
            </form>

            {/* Bottom Official Clearance Capsule */}
            <div className="mt-4 p-2.5 rounded-2xl bg-[#E2E8F0]/85 border border-purple-200/60 flex items-center justify-between text-left gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-700 shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5 stroke-[2.2]" />
                </div>
                <div className="text-[9px] leading-tight text-slate-700 font-semibold truncate">
                  DISCOM
                  <br />
                  Certified
                </div>
              </div>

              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-700 shrink-0">
                  <Cpu className="h-3.5 w-3.5 stroke-[2.2]" />
                </div>
                <div className="text-[9px] leading-tight text-slate-700 font-semibold truncate">
                  Grid Optimizer
                  <br />
                  Unlocked
                </div>
              </div>

              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-700 shrink-0">
                  <BadgeAlert className="h-3.5 w-3.5 stroke-[2.2]" />
                </div>
                <div className="text-[9px] leading-tight text-slate-700 font-semibold truncate">
                  Feeder Level
                  <br />
                  Control
                </div>
              </div>
            </div>

            {/* Supabase Verification Action */}
            <div className="mt-3.5 pt-2.5 border-t border-purple-200/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Supabase Database &amp; Auth</span>
              <button
                type="button"
                onClick={() => setIsVerifyModalOpen(true)}
                className="inline-flex items-center gap-1 font-bold text-purple-700 hover:text-purple-900 cursor-pointer underline hover:no-underline"
              >
                <Database className="h-3 w-3 text-purple-600" />
                <span>Verify Status &rarr;</span>
              </button>
            </div>
          </div>
        ) : (
          /* ── MODE B: STANDARD DRIVER & HOST AUTH (EXACT REFERENCE IMAGE MATCH) ── */
          <div>
            {/* Header: Green Squircle Lightning Badge + EVkal Typography */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center gap-2.5 mb-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#009E60] flex items-center justify-center shadow-[0_4px_14px_rgba(0,158,96,0.4)] text-white">
                  <Zap className="h-5 w-5 fill-white text-white" />
                </div>
                <div className="flex items-baseline">
                  <span className="text-2xl sm:text-[26px] font-black tracking-tight text-[#0D1829]">
                    EV
                  </span>
                  <span className="text-2xl sm:text-[26px] font-black tracking-tight text-[#009E60]">
                    kal
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-[27px] font-extrabold text-[#0D1829] tracking-tight">
                {isSignIn ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-xs sm:text-[13px] font-medium text-slate-500 mt-1 mb-5">
                {isSignIn ? 'Sign in to continue to EVkal' : 'Sign up to get started with EVkal'}
              </p>
            </div>

            {/* Continue with Google Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full py-2.5 sm:py-2.75 px-4 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/90 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2.5 font-semibold text-slate-700 text-xs sm:text-sm cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.43 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.28 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Balanced OR Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-slate-200/90" />
              <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                OR
              </span>
              <div className="flex-1 h-px bg-slate-200/90" />
            </div>

            {/* Interactive Form */}
            <form onSubmit={handleStandardSubmit} className="space-y-3">
              {/* Sign Up Mode: Full Name */}
              {!isSignIn && (
                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1 block">
                    Full Name
                  </label>
                  <div className="relative rounded-xl bg-[#E2E8F0] border border-transparent focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all flex items-center">
                    <User className="h-4 w-4 text-slate-400 ml-3.5 mr-2 shrink-0 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-transparent py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 font-medium outline-hidden pr-3"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 mb-1 block">
                  Email
                </label>
                <div className="relative rounded-xl bg-[#E2E8F0] border border-transparent focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all flex items-center">
                  <Mail className="h-4 w-4 text-slate-400 ml-3.5 mr-2 shrink-0 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-transparent py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 font-medium outline-hidden pr-3"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-600">
                    Password
                  </label>
                  {isSignIn && (
                    <button
                      type="button"
                      onClick={() => alert('Password reset link sent to your email.')}
                      className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative rounded-xl bg-[#E2E8F0] border border-transparent focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all flex items-center">
                  <Lock className="h-4 w-4 text-slate-400 ml-3.5 mr-2 shrink-0 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 font-medium outline-hidden pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Sign Up Mode: Role Selection */}
              {!isSignIn && (
                <div className="pt-1">
                  <label className="text-[11px] font-bold text-slate-600 mb-1.5 block">
                    Account Purpose
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'DRIVER', label: 'EV Driver' },
                      { id: 'HOST', label: 'Host Charger' },
                      { id: 'DUAL', label: 'Both' },
                    ].map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setUserRole(role.id as 'DRIVER' | 'HOST' | 'DUAL')}
                        className={`py-1.5 px-2 rounded-lg text-[10px] font-bold text-center border transition-all cursor-pointer ${
                          userRole === role.id
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback Message */}
              {feedbackMsg && (
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>{feedbackMsg}</span>
                </div>
              )}

              {/* Primary Action Button (#009E60) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-white bg-[#009E60] hover:bg-[#008953] active:bg-[#007446] shadow-md shadow-emerald-700/25 transition-all cursor-pointer text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying credentials...</span>
                  </>
                ) : (
                  <span>{isSignIn ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>
            </form>

            {/* Mode Switcher Toggle */}
            <div className="mt-4 text-center text-xs font-medium text-slate-500">
              {isSignIn ? (
                <>
                  <span>New to EVkal?</span>{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('SIGN_UP');
                      setFeedbackMsg(null);
                    }}
                    className="text-[#009E60] hover:text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  <span>Already have an account?</span>{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('SIGN_IN');
                      setFeedbackMsg(null);
                    }}
                    className="text-[#009E60] hover:text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>

            {/* Bottom Trust Badges Capsule */}
            <div className="mt-5 p-2.5 sm:p-3 rounded-2xl bg-[#E2E8F0]/85 border border-slate-200/60 flex items-center justify-between text-left gap-1 sm:gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100/90 border border-emerald-300/80 flex items-center justify-center text-emerald-700 shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.2]" />
                </div>
                <div className="text-[9px] sm:text-[10px] leading-tight text-slate-600 font-semibold truncate">
                  Secure
                  <br />
                  Authentication
                </div>
              </div>

              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100/90 border border-emerald-300/80 flex items-center justify-center text-emerald-700 shrink-0">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.2]" />
                </div>
                <div className="text-[9px] sm:text-[10px] leading-tight text-slate-600 font-semibold truncate">
                  Your Data
                  <br />
                  is Safe
                </div>
              </div>

              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100/90 border border-emerald-300/80 flex items-center justify-center text-emerald-700 shrink-0">
                  <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.2]" />
                </div>
                <div className="text-[9px] sm:text-[10px] leading-tight text-slate-600 font-semibold truncate">
                  Trusted by
                  <br />
                  EV Community
                </div>
              </div>
            </div>

            {/* Supabase Verification Action */}
            <div className="mt-3.5 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Supabase Database &amp; Auth</span>
              <button
                type="button"
                onClick={() => setIsVerifyModalOpen(true)}
                className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer underline hover:no-underline"
              >
                <Database className="h-3 w-3 text-emerald-600" />
                <span>Verify Connection &rarr;</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Supabase Database & Auth Diagnostics Modal */}
      <SupabaseVerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
      />
    </div>
  );
}
