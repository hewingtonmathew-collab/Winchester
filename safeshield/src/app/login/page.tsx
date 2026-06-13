"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, Loader2, Building2, School, Network, ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

type Mode = "login" | "register";
type OrgType = "la_school" | "single_school" | "mat";
type Step = "credentials" | "org_type";

const ORG_TYPE_OPTIONS: { value: OrgType; label: string; description: string; icon: React.ReactNode }[] = [
  { value: "la_school",     label: "Local Authority School",      description: "Single school, managed by the LA",     icon: <School size={18} className="text-[#38BDF8]" strokeWidth={1.5} /> },
  { value: "single_school", label: "Independent / Single School", description: "Standalone school or academy",          icon: <Building2 size={18} className="text-[#A78BFA]" strokeWidth={1.5} /> },
  { value: "mat",           label: "Multi-Academy Trust (MAT)",   description: "Multiple schools under one trust",     icon: <Network size={18} className="text-[#34D399]" strokeWidth={1.5} /> },
];

const ORG_TYPE_COLORS: Record<OrgType, string> = { la_school: "#38BDF8", single_school: "#A78BFA", mat: "#34D399" };

const TRUST_POINTS = [
  "KCSIE 2024 aligned assessments",
  "UK GDPR & DPA 2018 compliant",
  "DfE Digital Standards ready",
  "Ofsted inspection evidence",
  "Trusted by UK schools & MATs",
];

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [orgType, setOrgType] = useState<OrgType | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { if (!loading && user) router.replace("/"); }, [user, loading, router]);

  function resetForm() {
    setEmail(""); setPassword(""); setFullName(""); setOrgName("");
    setOrgType(null); setStep("credentials"); setError(""); setSuccess("");
  }

  async function handleForgotPassword() {
    if (!email.trim()) { setError("Enter your email address first."); return; }
    setError(""); setSuccess(""); setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
      if (error) throw error;
      setSuccess("Password reset link sent. Check your email.");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Could not send reset email."); }
    finally { setBusy(false); }
  }

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (mode === "login") {
      setBusy(true);
      try { const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; router.replace("/"); }
      catch (err: unknown) { setError(err instanceof Error ? err.message : "Something went wrong"); }
      finally { setBusy(false); }
    } else {
      if (!fullName.trim()) { setError("Please enter your full name."); return; }
      if (!orgName.trim()) { setError("Please enter your organisation name."); return; }
      setStep("org_type");
    }
  }

  async function handleOrgTypeSubmit() {
    if (!orgType) { setError("Please select an organisation type."); return; }
    setError(""); setBusy(true);
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
      if (signUpError) throw signUpError;
      const userId = authData.user?.id;
      if (!userId) throw new Error("No user ID returned.");
      await supabase.from("profiles").update({ org_type: orgType }).eq("id", userId);
      const { data: orgData, error: orgError } = await supabase.from("organisations").insert({ name: orgName.trim(), type: orgType === "mat" ? "mat" : "school", created_by: userId }).select("id").single();
      if (orgError) throw orgError;
      const { data: schoolData, error: schoolError } = await supabase.from("schools").insert({ org_id: orgData.id, name: orgName.trim() }).select("id").single();
      if (schoolError) throw schoolError;
      await supabase.from("org_members").insert({ user_id: userId, org_id: orgData.id, school_id: schoolData.id, role: "admin" });
      setSuccess("Account created! Pending admin approval — you'll receive an email when access is granted.");
      resetForm(); setMode("login");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Something went wrong"); }
    finally { setBusy(false); }
  }

  if (loading) return null;

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>

      {/* ── Left brand panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between px-12 py-12 relative overflow-hidden"
        style={{
          width: "42%",
          background: "linear-gradient(160deg, #060d1e 0%, #07090F 55%, #060d1e 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Orb glows */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 65%)", transform: "translate(-30%, -30%)" }} />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 65%)", transform: "translate(30%, 30%)" }} />
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 65%)", transform: "translate(-50%, -50%)" }} />
        </div>

        {/* Top: Logo + wordmark */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)" }}>
              <Shield size={20} className="text-[#38BDF8]" strokeWidth={1.8} />
            </div>
            <span className="heading-luxury text-lg tracking-tight" style={{ color: "var(--text)" }}>SafeShield</span>
          </div>

          {/* Hero text */}
          <h2 className="heading-luxury text-4xl xl:text-5xl mb-5 leading-[1.1]">
            <span style={{ color: "var(--text)" }}>School compliance</span>
            <br />
            <span className="gradient-text">made simple.</span>
          </h2>
          <p className="text-sm leading-relaxed mb-10 max-w-xs" style={{ color: "var(--text-muted)" }}>
            Professional compliance tools for safeguarding, governance, data protection, and digital standards — built for UK schools and MATs.
          </p>

          {/* Trust points */}
          <div className="flex flex-col gap-3">
            {TRUST_POINTS.map(point => (
              <div key={point} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)" }}>
                  <CheckCircle2 size={10} className="text-[#34D399]" />
                </div>
                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: tagline */}
        <div className="relative z-10">
          <div className="h-px mb-6" style={{ background: "rgba(255,255,255,0.06)" }} />
          <p className="text-[0.7rem] uppercase tracking-[0.2em] font-semibold" style={{ color: "var(--text-dim)" }}>
            Safeguarding · Governance · Digital Standards
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0">
        <div className="w-full max-w-sm">

          {/* Mobile-only branding */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8 rise-in">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)" }}>
              <Shield size={16} className="text-[#38BDF8]" strokeWidth={1.8} />
            </div>
            <span className="heading-luxury text-base tracking-tight" style={{ color: "var(--text)" }}>SafeShield</span>
          </div>

          {/* Form header */}
          <div className="mb-7 rise-in">
            <h1 className="heading-luxury text-2xl mb-1.5" style={{ color: "var(--text)" }}>
              {mode === "login" ? "Welcome back" : step === "credentials" ? "Request access" : "Your organisation"}
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {mode === "login"
                ? "Sign in to your SafeShield account"
                : step === "credentials"
                ? "Create your account — subject to admin approval"
                : "Tell us about your school or MAT"}
            </p>
          </div>

          {/* Credentials form */}
          {(mode === "login" || step === "credentials") && (
            <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-4 rise-in-1">
              {mode === "register" && (
                <>
                  <FormField label="Full name">
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Jane Smith" required className="input-glass" />
                  </FormField>
                  <FormField label="Organisation name">
                    <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Maple Primary School" required className="input-glass" />
                  </FormField>
                </>
              )}

              <FormField label="Email address">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@school.org" required className="input-glass" />
              </FormField>

              <FormField label="Password">
                <div className="relative">
                  <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={8} className="input-glass pr-10" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-80"
                    style={{ color: "var(--text-dim)" }}>
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </FormField>

              {mode === "login" && (
                <button type="button" onClick={handleForgotPassword}
                  className="text-xs self-end -mt-1 hover:opacity-80 transition-opacity"
                  style={{ color: "var(--accent)" }}>
                  Forgot password?
                </button>
              )}

              {error   && <ErrorMsg>{error}</ErrorMsg>}
              {success && <SuccessMsg>{success}</SuccessMsg>}

              <PrimaryButton busy={busy}>
                {mode === "login" ? "Sign in" : "Continue →"}
              </PrimaryButton>
            </form>
          )}

          {/* Org type picker */}
          {mode === "register" && step === "org_type" && (
            <div className="flex flex-col gap-3 rise-in">
              {ORG_TYPE_OPTIONS.map(opt => {
                const selected = orgType === opt.value;
                const color = ORG_TYPE_COLORS[opt.value];
                return (
                  <button key={opt.value} type="button" onClick={() => setOrgType(opt.value)}
                    className="w-full text-left px-4 py-3.5 rounded-2xl border transition-all flex items-center gap-3.5"
                    style={{
                      background: selected ? `${color}10` : "rgba(255,255,255,0.03)",
                      borderColor: selected ? `${color}50` : "rgba(255,255,255,0.1)",
                      boxShadow: selected ? `0 0 0 1px ${color}30` : "none",
                    }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                      {opt.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{opt.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{opt.description}</p>
                    </div>
                    {selected && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: color }}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}

              {error && <ErrorMsg>{error}</ErrorMsg>}

              <PrimaryButton busy={busy || !orgType} onClick={handleOrgTypeSubmit}>
                Complete registration
              </PrimaryButton>

              <button type="button" onClick={() => { setStep("credentials"); setError(""); }}
                className="flex items-center justify-center gap-1.5 text-xs mx-auto hover:opacity-80 transition-opacity"
                style={{ color: "var(--text-dim)" }}>
                <ArrowLeft size={12} /> Back
              </button>
            </div>
          )}

          {/* Mode toggle */}
          <p className="text-center text-xs mt-6" style={{ color: "var(--text-dim)" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { resetForm(); setMode(mode === "login" ? "register" : "login"); }}
              className="font-semibold hover:opacity-80 transition-opacity"
              style={{ color: "var(--accent)" }}>
              {mode === "login" ? "Request access" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold mb-1.5 block uppercase tracking-wide" style={{ color: "var(--text-dim)", letterSpacing: "0.06em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function PrimaryButton({ children, busy, onClick }: { children: React.ReactNode; busy?: boolean; onClick?: () => void }) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={busy}
      className="w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
      style={{
        background: "linear-gradient(135deg, rgba(56,189,248,0.2) 0%, rgba(129,140,248,0.15) 100%)",
        border: "1px solid rgba(56,189,248,0.35)",
        color: "var(--accent)",
        boxShadow: "0 0 24px rgba(56,189,248,0.08), inset 0 1px 0 rgba(255,255,255,0.1)",
      }}>
      {busy && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs px-3 py-2.5 rounded-xl" style={{ color: "#F87171", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
      {children}
    </p>
  );
}

function SuccessMsg({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs px-3 py-2.5 rounded-xl" style={{ color: "#34D399", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
      {children}
    </p>
  );
}
