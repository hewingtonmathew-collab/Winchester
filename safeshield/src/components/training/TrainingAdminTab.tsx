"use client";
import GlassCard from "@/components/ui/GlassCard";
import { BookOpen, Loader2 } from "lucide-react";

export default function TrainingAdminTab() {
  return (
    <GlassCard className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.2)]">
        <BookOpen size={24} className="text-[#8B5CF6]" />
      </div>
      <div className="text-center">
        <h2 className="font-semibold text-lg mb-1" style={{ color: "var(--text)" }}>Training & Certification</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading training management module…</p>
      </div>
      <Loader2 size={18} className="animate-spin text-[#8B5CF6]" />
    </GlassCard>
  );
}
