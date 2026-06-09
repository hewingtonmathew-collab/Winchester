"use client";
import { type ReactNode } from "react";
import { Lock, Clock, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import GlassCard from "@/components/ui/GlassCard";
import ToolPreviewPanel from "@/components/ui/ToolPreviewPanel";

const TOOL_COLORS: Record<string, string> = {
  safeguarding: "#34D399",
  governance: "#A78BFA",
  ofsted: "#4ADE80",
  "health-safety": "#F97316",
  "digital-standards": "#818CF8",
  dpia: "#FCD34D",
  accessibility: "#F472B6",
  "ai-readiness": "#FB923C",
  "ai-detector": "#38BDF8",
  "screen-use": "#06B6D4",
  "ai-risk": "#F59E0B",
  "send-digital": "#8B5CF6",
  "filtering-monitoring": "#EF4444",
  "data-privacy": "#3B82F6",
  "governor-dashboard": "#10B981",
};

const TOOL_NAMES: Record<string, string> = {
  safeguarding: "Safeguarding Risk Checker",
  governance: "Governance Compliance Checker",
  ofsted: "Ofsted Ready Checker",
  "health-safety": "Health & Safety Checker",
  "digital-standards": "Digital & Technology Standards",
  dpia: "DPIA Wizard",
  accessibility: "Web Accessibility Checker",
  "ai-readiness": "AI Readiness Assessment",
  "ai-detector": "AI Content Detector",
  "screen-use": "Screen Use & Wellbeing Review",
  "ai-risk": "AI Use Risk Assessment",
  "send-digital": "SEND Digital Impact Review",
  "filtering-monitoring": "Filtering & Monitoring Assurance",
  "data-privacy": "Data Protection & AI Privacy",
  "governor-dashboard": "Governor Digital Dashboard",
};

type Props = {
  toolSlug: string;
  children: ReactNode;
};

export default function AuthGuard({ toolSlug, children }: Props) {
  const { user, profile, loading, enabledTools } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={24} className="animate-spin text-[#38BDF8]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-20">
        <ToolPreviewPanel
          toolSlug={toolSlug}
          color={TOOL_COLORS[toolSlug] ?? "#38BDF8"}
          toolName={TOOL_NAMES[toolSlug] ?? toolSlug}
        />
      </div>
    );
  }

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
