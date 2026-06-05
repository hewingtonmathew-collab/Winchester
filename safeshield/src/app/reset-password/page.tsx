"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/ui/GlassCard";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  // Supabase puts a recovery session in place when the user lands here from the email link.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setReady(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => router.replace("/"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not update password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.2)]">
            <Shield size={24} className="text-[#38BDF8]" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Reset Password</h1>
          <p className="text-sm text-[#64748B]">Choose a new password for your account</p>
        </div>

        <GlassCard>
          {done ? (
            <div className="flex flex-col items-center text-center py-4">
              <CheckCircle2 size={36} className="text-green-400 mb-3" />
              <p className="text-white font-semibold mb-1">Password updated</p>
              <p className="text-xs text-[#64748B]">Redirecting you to the dashboard…</p>
            </div>
          ) : !ready ? (
            <div className="flex flex-col items-center text-center py-4">
              <Loader2 size={24} className="animate-spin text-[#38BDF8] mb-3" />
              <p className="text-xs text-[#64748B]">Verifying your reset link… If this doesn&apos;t load, request a new reset link from the sign-in page.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-[#64748B] mb-1 block">New password</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" required minLength={8}
                    className="w-full px-4 py-3 pr-11 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-[#475569] outline-none focus:border-[rgba(56,189,248,0.4)] transition-all" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-white transition-colors">
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-[#64748B] mb-1 block">Confirm new password</label>
                <input type={showPw ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••" required minLength={8}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-[#475569] outline-none focus:border-[rgba(56,189,248,0.4)] transition-all" />
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button type="submit" disabled={busy}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", color: "#38BDF8" }}>
                {busy && <Loader2 size={14} className="animate-spin" />}
                Update Password
              </button>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
