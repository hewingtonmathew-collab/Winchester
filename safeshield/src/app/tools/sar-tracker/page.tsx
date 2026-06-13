"use client";
import { FileSearch } from "lucide-react";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import GlassCard from "@/components/ui/GlassCard";

export default function SarTrackerPage() {
  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ToolPageHeader
          title="Subject Access Request Tracker"
          description="Track and manage Subject Access Requests under UK GDPR. Automated deadline tracking, response templating, and compliance reporting."
          accentColor="#38BDF8"
          icon={<FileSearch size={28} style={{ color: "#38BDF8" }} />}
        />
        <GlassCard>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#38BDF818", border: "1px solid #38BDF835" }}>
              <FileSearch size={28} style={{ color: "#38BDF8" }} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
            <p className="text-[#64748B] text-sm max-w-md mx-auto leading-relaxed">
              Track and manage Subject Access Requests under UK GDPR. Automated deadline tracking, response templating, and compliance reporting.
            </p>
            <p className="text-xs text-[#334155] mt-4">This tool is currently in development and will be available soon.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
