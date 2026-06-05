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
  {
    value: "la_school",
    label: "Local Authority School",
    description: "Single school, managed by the LA",
    icon: <School size={20} className="text-[#38BDF8]" strokeWidth={1.5} />,
  },
  {
    value: "single_school",
    label: "Independent / Single School",
    description: "Standalone school",
    icon: <Building2 size={20} className="text-[#A78BFA]" strokeWidth={1.5} />,
  },
  {
    value: "mat",
    label: "Multi-Academy Trust (MAT)",
    description: "Multiple schools under one trust",
    icon: <Network size={20} className="text-[#34D399]" strokeWidth={1.5} />,
  },
];

const ORG_TYPE_COLORS: Record<OrgType, string> = {
  la_school: "#38BDF8",
  single_school: "#A78BFA",
  mat: "#34D399",
};

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>("credentials");

  // Step 1 fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [showPw, setShowPw] = useState(false);

  // Step 2 fields
  const [orgType, setOrgType] = useState<OrgType | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleForgotPassword() {
    if (!email.trim()) { setError("Enter your email address first, then click 'Forgot password'."); return; }
    setError(""); setSuccess(""); setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSuccess("Password reset link sent. Check your email inbox.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not send reset email.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [user, loading, router]);

  function resetForm() {
    setEmail("");
    setPassword("");
    setFullName("");
    setOrgName("");
    setOrgType(null);
    setStep("credentials");
    setError("");
    setSuccess("");
  }

  function switchMode(next: Mode) {
    resetForm();
    setMode(next);
  }

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      setBusy(true);
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace("/");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setBusy(false);
      }
    } else {
      // Advance to org type step
      if (!fullName.trim()) { setError("Please enter your full name."); return; }
      if (!orgName.trim()) { setError("Please enter your organisation name."); return; }
      setStep("org_type");
    }
  }

  async function handleOrgTypeSubmit() {
    if (!orgType) { setError("Please select an organisation type."); return; }
    setError("");
    setBusy(true);

    try {
      // 1. Sign up with Supabase auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (signUpError) throw signUpError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("No user ID returned from sign up.");

      // 2. Update profile with org_type
      await supabase
        .from("profiles")
        .update({ org_type: orgType })
        .eq("id", userId);

      // 3. Create org
      const { data: orgData, error: orgError } = await supabase
        .from("organisations")
        .insert({ name: orgName.trim(), type: orgType === "mat" ? "mat" : "school", created_by: userId })
        .select("id")
        .single();
      if (orgError) throw orgError;

      const orgId = orgData.id;

      // 4. Create school record within the org
      const { data: schoolData, error: schoolError } = await supabase
        .from("schools")
        .insert({ org_id: orgId, name: orgName.trim() })
        .select("id")
        .single();
      if (schoolError) throw schoolError;

      // 5. Add user as org admin
      await supabase
        .from("org_members")
        .insert({ user_id: userId, org_id: orgId, school_id: schoolData.id, role: "admin" });

      setSuccess("Account created! Your request is pending admin approval. You'll be notified when access is granted.");
      resetForm();
      setMode("login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.2)]">
            <Shield size={24} className="text-[#38BDF8]" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">SafeShield</h1>
          <p className="text-sm text-[#64748B]">
            {mode === "login"
              ? "Sign in to your account"
              : step === "credentials"
              ? "Request access"
              : "Tell us about your organisation"}
          </p>
        </div>

        {/* ── Step 1: credentials ── */}
        {(mode === "login" || step === "credentials") && (
          <GlassCard>
            <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-4">
              {mode === "register" && (
                <>
                  <div>
                    <label className="text-xs text-[#64748B] mb-1 block">Full name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Smith"
                      required
                      className="w-full px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-[#475569] outline-none focus:border-[rgba(56,189,248,0.4)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#64748B] mb-1 block">Organisation name</label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="Maple Primary School"
                      required
                      className="w-full px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-[#475569] outline-none focus:border-[rgba(56,189,248,0.4)] transition-all"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs text-[#64748B] mb-1 block">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.org"
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-[#475569] outline-none focus:border-[rgba(56,189,248,0.4)] transition-all"
                />
              </div>

              <div>
                <label className="text-xs text-[#64748B] mb-1 block">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="w-full px-4 py-3 pr-11 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-[#475569] outline-none focus:border-[rgba(56,189,248,0.4)] transition-all"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-white transition-colors">
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {mode === "login" && (
                <button type="button" onClick={handleForgotPassword}
                  className="text-xs text-[#38BDF8] hover:underline self-end -mt-1">
                  Forgot password?
                </button>
              )}

              {error && <p className="text-red-400 text-xs">{error}</p>}
              {success && <p className="text-green-400 text-xs">{success}</p>}

              <button type="submit" disabled={busy}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", color: "#38BDF8" }}>
                {busy && <Loader2 size={14} className="animate-spin" />}
                {mode === "login" ? "Sign In" : "Continue"}
              </button>
            </form>
          </GlassCard>
        )}

        {/* ── Step 2: org type picker ── */}
        {mode === "register" && step === "org_type" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {ORG_TYPE_OPTIONS.map((opt) => {
                const selected = orgType === opt.value;
                const color = ORG_TYPE_COLORS[opt.value];
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setOrgType(opt.value)}
                    className="w-full text-left px-4 py-4 rounded-2xl border transition-all flex items-center gap-4"
                    style={{
                      background: selected ? `${color}12` : "rgba(255,255,255,0.03)",
                      borderColor: selected ? `${color}60` : "rgba(255,255,255,0.08)",
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                      {opt.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{opt.label}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{opt.description}</p>
                    </div>
                    {selected && (
                      <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: color }}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              type="button"
              onClick={handleOrgTypeSubmit}
              disabled={busy || !orgType}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", color: "#38BDF8" }}>
              {busy && <Loader2 size={14} className="animate-spin" />}
              Complete Sign Up
            </button>

            <button
              type="button"
              onClick={() => { setStep("credentials"); setError(""); }}
              className="flex items-center justify-center gap-1.5 text-xs text-[#64748B] hover:text-white transition-colors mx-auto">
              <ArrowLeft size={12} /> Back
            </button>
          </div>
        )}

        <p className="text-center text-xs text-[#475569] mt-5">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => switchMode(mode === "login" ? "register" : "login")}
            className="text-[#38BDF8] hover:underline">
            {mode === "login" ? "Request access" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
