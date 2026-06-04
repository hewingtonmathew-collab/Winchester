"use client";
import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Lock, Clock, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import GlassCard from "@/components/ui/GlassCard";

type Props = {
  toolSlug: string;
  children: ReactNode;
};

export default function AuthGuard({ toolSlug, children }: Props) {
  const { user, profile, loading, enabledTools } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={24} className="animate-spin text-[#38BDF8]" />
      </div>
    );
  }

  if (!user) return null;

  if (profile?.status === "pending") {
    return (
      <div className="flex items-center justify-center py-32 px-4">
        <GlassCard className="max-w-md text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <Clock size={22} className="text-amber-400" />
          </div>
          <h2 className="text-white font-bold text-lg mb-2">Access Pending</h2>
          <p className="text-[#94A3B8] text-sm leading-relaxed">
            Your account is awaiting admin approval. You will receive access once Mathew has reviewed your request.
          </p>
        </GlassCard>
      </div>
    );
  }

  if (profile?.status === "suspended") {
    return (
      <div className="flex items-center justify-center py-32 px-4">
        <GlassCard className="max-w-md text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Lock size={22} className="text-red-400" />
          </div>
          <h2 className="text-white font-bold text-lg mb-2">Account Suspended</h2>
          <p className="text-[#94A3B8] text-sm leading-relaxed">
            Your account has been suspended. Please contact your administrator.
          </p>
        </GlassCard>
      </div>
    );
  }

  const hasAccess = enabledTools.includes("*") || enabledTools.includes(toolSlug);

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center py-32 px-4">
        <GlassCard className="max-w-md text-center">
          <div className="w-12 h-12 rounded-2xl bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.2)] flex items-center justify-center mx-auto mb-4">
            <Lock size={22} className="text-[#38BDF8]" />
          </div>
          <h2 className="text-white font-bold text-lg mb-2">Tool Not Enabled</h2>
          <p className="text-[#94A3B8] text-sm leading-relaxed">
            You don&apos;t have access to this tool. Contact Mathew Hewington to request access.
          </p>
        </GlassCard>
      </div>
    );
  }

  return <>{children}</>;
}
