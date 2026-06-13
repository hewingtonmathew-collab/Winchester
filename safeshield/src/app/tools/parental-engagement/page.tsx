"use client";
import { Users } from "lucide-react";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import ParentalEngagementChecker from "@/components/forms/ParentalEngagementChecker";

export default function ParentalEngagementPage() {
  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ToolPageHeader
          slug="parental-engagement"
          icon={Users}
          badge="Engagement"
          title="Parental Engagement Tracker"
          description="Assess how effectively your school communicates and engages with parents and carers to support pupil outcomes, safeguarding, and Ofsted readiness."
          color="#A78BFA"
        />
        <ParentalEngagementChecker />
      </div>
    </div>
  );
}
