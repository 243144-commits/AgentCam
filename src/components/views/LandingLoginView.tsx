import React, { useState } from 'react';
import { 
  Shield, Play, Lock, UserCheck, ShieldAlert, Wifi, 
  Activity, Eye, Radio, KeyRound, CheckCircle2, ChevronRight,
  AlertTriangle, Cpu, Terminal
} from 'lucide-react';
import { useApp, UserRole } from '../../context/AppContext';

export const LandingLoginView: React.FC = () => {
  const { 
    login, loginAsDemo, currentRole, setCurrentRole, 
    cameras, edgeNodes 
  } = useApp();

  const [badgeId, setBadgeId] = useState('BSF-INSP-26187');
  const [passcode, setPasscode] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('OPERATOR');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);

    // Simulate authentic biometric/credential verification
    setTimeout(() => {
      if (!badgeId.trim()) {
        setLoginError('Officer Badge ID is required.');
        setIsSubmitting(false);
        return;
      }
      setCurrentRole(selectedRole);
      login();
      setIsSubmitting(false);
    }, 600);
  };

  const handleDemoClick = () => {
    loginAsDemo();
  };

  const onlineCameras = cameras.filter(c => c.status === 'ONLINE').length;

  return (
    <div className="relative min-h-screen w-full bg-[#050811] text-slate-100 flex flex-col justify-between overflow-hidden font-sans select-none">
      {/* Dynamic Animated Surveillance Network Background Canvas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Radar grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a15_1px,transparent_1px),linear-gradient(to_bottom,#0f172a15_1px,transparent_1px)] bg-[size:36px_36px]" />
        
        {/* Rotating radar sweep effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-cyan-500/10 opacity-70 pointer-events-none">
          <div className="absolute inset-0 rounded-full border border-blue-500/10 scale-75" />
          <div className="absolute inset-0 rounded-full border border-blue-500/10 scale-50" />
          <div className="absolute inset-0 rounded-full border border-blue-500/10 scale-25" />
          <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-gradient-to-t from-cyan-400/40 to-transparent origin-bottom animate-[spin_12s_linear_infinite]" />
        </div>

        {/* Ambient tactical lighting */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      {/* Top Bar: Prototype Header & Simulation Label */}
      <header className="relative z-10 w-full border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between backdrop-blur-md bg-[#050811]/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/40 text-cyan-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-tactical font-black text-white tracking-wider">
                AGENTC
              </span>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                SIH26187
              </span>
            </div>
            <span className="text-[11px] font-mono-code text-slate-400">
              AI-Powered Border Intelligence
            </span>
          </div>
        </div>

        {/* Mandatory Simulation Mode Badge (Req #54) */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono-code text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>SIMULATION MODE — All displayed surveillance data is simulated for demonstration</span>
          </div>
        </div>
      </header>

      {/* Main Center Body */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Left Side: Brand Identity, Vision, and 10 Capabilities */}
        <div className="flex-1 space-y-6 text-left max-w-xl">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-300 text-xs font-mono-code">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Smart India Hackathon 2026 • Problem Statement SIH26187</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-tactical font-extrabold text-white tracking-tight leading-tight">
              AgentC
            </h1>

            <p className="text-lg text-cyan-300 font-tactical font-medium">
              &ldquo;From Camera Feeds to Actionable Border Intelligence.&rdquo;
            </p>

            <p className="text-sm font-mono-code text-slate-400 tracking-wider">
              Detect. Understand. Correlate. Respond.
            </p>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            An intelligent decision-support platform engineered over existing CCTV infrastructure. 
            AgentC continuously correlates multi-camera events, generates explainable risk assessments, 
            preserves evidence integrity, and empowers quick border interception.
          </p>

          {/* Operational Pipeline graphic */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono-code space-y-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Autonomous Surveillance Intelligence Pipeline
            </span>
            <div className="flex items-center justify-between text-slate-300 text-[11px] overflow-x-auto py-1">
              <span className="text-cyan-400 font-semibold">CCTV Feed</span>
              <span className="text-slate-500">→</span>
              <span className="text-cyan-400 font-semibold">Detection</span>
              <span className="text-slate-500">→</span>
              <span className="text-cyan-400 font-semibold">Correlation</span>
              <span className="text-slate-500">→</span>
              <span className="text-amber-400 font-semibold">Risk Engine</span>
              <span className="text-slate-500">→</span>
              <span className="text-red-400 font-semibold">Alert</span>
              <span className="text-slate-500">→</span>
              <span className="text-emerald-400 font-semibold">Human QRT</span>
            </div>
          </div>

          {/* System Telemetry Chips */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-left">
              <span className="text-[10px] text-slate-400 block font-mono-code">CAMERAS ONLINE</span>
              <span className="text-sm font-bold font-mono-code text-emerald-400">{onlineCameras}/{cameras.length} Active</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-left">
              <span className="text-[10px] text-slate-400 block font-mono-code">AI INFERENCE</span>
              <span className="text-sm font-bold font-mono-code text-cyan-400">14 ms Latency</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-left">
              <span className="text-[10px] text-slate-400 block font-mono-code">EDGE MESH</span>
              <span className="text-sm font-bold font-mono-code text-blue-400">4/4 Synced</span>
            </div>
          </div>
        </div>

        {/* Right Side: High-Impact Login & Instant Demo Card */}
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative">
          {/* Prominent Demo Mode Action (Req #53) */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-cyan-950/60 via-blue-950/40 to-slate-900 border border-cyan-500/40 text-center space-y-2.5 shadow-lg">
            <div className="flex items-center justify-center gap-1.5 text-xs font-mono-code text-cyan-300 font-semibold">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>SIH26187 EVALUATION SHORTCUT</span>
            </div>
            <h2 className="text-sm font-tactical font-bold text-white">
              Instant Operational Experience
            </h2>
            <p className="text-xs text-slate-400 leading-normal">
              Bypass credential setup and test live intrusion simulation, AI correlation, and tactical response.
            </p>
            <button
              onClick={handleDemoClick}
              className="w-full py-3 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-tactical font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>ENTER DEMO MODE</span>
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800" />
            <span className="flex-shrink mx-4 text-[10px] font-mono-code text-slate-400 uppercase">
              Or Authenticate with Badge
            </span>
            <div className="flex-grow border-t border-slate-800" />
          </div>

          {/* Secure Login Form */}
          <form onSubmit={handleStandardLogin} className="space-y-4 mt-2">
            {loginError && (
              <div className="p-2.5 rounded bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-mono-code flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Role Selection Concept */}
            <div>
              <label className="text-[11px] font-mono-code text-slate-400 block mb-1.5 uppercase tracking-wider">
                Operational Role Assignment
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { role: 'OPERATOR' as UserRole, label: 'Operator', sub: 'Insp. Verma' },
                  { role: 'SUPERVISOR' as UserRole, label: 'Commander', sub: 'Col. Saxena' },
                  { role: 'ADMINISTRATOR' as UserRole, label: 'Admin', sub: 'Maj. Sandhu' },
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setSelectedRole(item.role)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      selectedRole === item.role
                        ? 'bg-blue-600/20 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] font-mono-code text-slate-400">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Badge ID input */}
            <div>
              <label className="text-[11px] font-mono-code text-slate-400 block mb-1 uppercase tracking-wider">
                Officer Badge / Credential ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={badgeId}
                  onChange={(e) => setBadgeId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="e.g. BSF-INSP-26187"
                />
              </div>
            </div>

            {/* Security PIN / Password */}
            <div>
              <label className="text-[11px] font-mono-code text-slate-400 block mb-1 uppercase tracking-wider">
                CAC / Cryptographic PIN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-code text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono-code text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isSubmitting ? 'VERIFYING CREDENTIALS...' : 'AUTHENTICATE CONSOLE ACCESS'}</span>
            </button>
          </form>

          {/* Security & SSL Footer Indicator */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono-code text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              <span>TLS 1.3 256-Bit Encrypted</span>
            </span>
            <span>SIH26187 v2.6.4</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/60 px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono-code text-slate-400 backdrop-blur-md bg-[#050811]/90">
        <div>
          <span>Smart India Hackathon 2026 • SIH26187 • Intelligent Border Video Analytics Platform</span>
        </div>
        <div className="text-slate-400">
          Simulation Data Only • No sensitive live border telemetry transmitted
        </div>
      </footer>
    </div>
  );
};
