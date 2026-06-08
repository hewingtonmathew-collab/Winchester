"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, Loader2, Building2, School, Network, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import GlassCard from "@/components/ui/GlassCard";

type Mode = "login" | "register";
type OrgType = "la_school" | "single_school" | "mat";
type Step = "credentials" | "org_type";

const ORG_TYPE_OPTIONS: { value: OrgType; label: string; description: string; icon: React.ReactNode }[] = [
  { value: "la_school",     label: "Local Authority School",      description: "Single school, managed by the LA",      icon: <School size={20} className="text-[#38BDF8]" strokeWidth={1.5} /> },
  { value: "single_school", label: "Independent / Single School", description: "Standalone school",                    icon: <Building2 size={20} className="text-[#A78BFA]" strokeWidth={1.5} /> },
  { value: "mat",           label: "Multi-Academy Trust (MAT)",   description: "Multiple schools under one trust",      icon: <Network size={20} className="text-[#34D399]" strokeWidth={1.5} /> },
];

const ORG_TYPE_COLORS: Record<OrgType, string> = { la_school: "#38BDF8", single_school: "#A78BFA", mat: "#34D399" };

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("register");
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
      setSuccess("Account created! Pending admin approval — you'll be notified when access is granted.");
      resetForm(); setMode("login");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Something went wrong"); }
    finally { setBusy(false); }
  }

  if (loading) return null;

  const inputCls = "input-glass pr-4";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8 rise-in">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-[rgba(56,189,248,0.12)] border border-[rgba(56,189,248,0.28)]">
            <Shield size={30} className="text-[#38BDF8]" strokeWidth={1.6} />
          </div>
          <h1 className="heading-luxury text-2xl mb-1" style={{ color: "var(--text)" }}>SafeShield</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {mode === "login" ? "Sign in to your account" : step === "credentials" ? "Request access" : "Tell us about your organisation"}
          </p>
        </div>

        {/* Credentials form */}
        {(mode === "login" || step === "credentials") && (
          <GlassCard className="rise-in-1">
            <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-4">
              {mode === "register" && (
                <>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-muted)" }}>Full name</label>
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Jane Smith" required className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-muted)" }}>Organisation name</label>
                    <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Maple Primary School" required className={inputCls} />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-muted)" }}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@school.org" required className={inputCls} />
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-muted)" }}>Password</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={8} className="input-glass pr-10" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "var(--text-dim)" }}>
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {mode === "login" && (
                <button type="button" onClick={handleForgotPassword} className="text-xs self-end -mt-1" style={{ color: "var(--accent)" }}>
                  Forgot password?
                </button>
              )}

              {error   && <p className="text-red-400 text-xs">{error}</p>}
              {success && <p className="text-green-400 text-xs">{success}</p>}

              <button type="submit" disabled={busy}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: "rgba(56,189,248,0.14)", border: "1px solid rgba(56,189,248,0.3)", color: "var(--accent)" }}>
                {busy && <Loader2 size={14} className="animate-spin" />}
                {mode === "login" ? "Sign In" : "Continue"}
              </button>
            </form>
          </GlassCard>
        )}

        {/* Org type picker */}
        {mode === "register" && step === "org_type" && (
          <div className="flex flex-col gap-4 rise-in">
            {ORG_TYPE_OPTIONS.map(opt => {
              const selected = orgType === opt.value;
              const color = ORG_TYPE_COLORS[opt.value];
              return (
                <button key={opt.value} type="button" onClick={() => setOrgType(opt.value)}
                  className="w-full text-left px-4 py-4 rounded-2xl border transition-all flex items-center gap-4 glass"
                  style={{ background: selected ? `${color}12` : undefined, borderColor: selected ? `${color}55` : undefined }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                    {opt.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{opt.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{opt.description}</p>
                  </div>
                  {selected && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: color }}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  )}
                </button>
              );
            })}

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button type="button" onClick={handleOrgTypeSubmit} disabled={busy || !orgType}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: "rgba(56,189,248,0.14)", border: "1px solid rgba(56,189,248,0.3)", color: "var(--accent)" }}>
              {busy && <Loader2 size={14} className="animate-spin" />}
              Complete Sign Up
            </button>

            <button type="button" onClick={() => { setStep("credentials"); setError(""); }}
              className="flex items-center justify-center gap-1.5 text-xs mx-auto transition-colors" style={{ color: "var(--text-dim)" }}>
              <ArrowLeft size={12} /> Back
            </button>
          </div>
        )}

        <p className="text-center text-xs mt-5" style={{ color: "var(--text-dim)" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { resetForm(); setMode(mode === "login" ? "register" : "login"); }}
            className="font-medium" style={{ color: "var(--accent)" }}>
            {mode === "login" ? "Request access" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
