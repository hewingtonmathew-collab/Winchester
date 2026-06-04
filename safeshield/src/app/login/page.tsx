"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import GlassCard from "@/components/ui/GlassCard";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        setSuccess("Account created! Your request is pending admin approval. You'll be notified when access is granted.");
        setMode("login");
        setPassword("");
        setFullName("");
      }
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
            {mode === "login" ? "Sign in to your account" : "Request access"}
          </p>
        </div>

        <GlassCard>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "register" && (
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

            {error && <p className="text-red-400 text-xs">{error}</p>}
            {success && <p className="text-green-400 text-xs">{success}</p>}

            <button type="submit" disabled={busy}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", color: "#38BDF8" }}>
              {busy && <Loader2 size={14} className="animate-spin" />}
              {mode === "login" ? "Sign In" : "Request Access"}
            </button>
          </form>
        </GlassCard>

        <p className="text-center text-xs text-[#475569] mt-5">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setSuccess(""); }}
            className="text-[#38BDF8] hover:underline">
            {mode === "login" ? "Request access" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
