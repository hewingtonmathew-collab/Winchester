"use client";
import { FileSearch } from "lucide-react";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import SarTrackerChecker from "@/components/forms/SarTrackerChecker";

export default function SarTrackerPage() {
  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ToolPageHeader
          slug="sar-tracker"
          icon={FileSearch}
          badge="SAR"
          title="Subject Access Request Tracker"
          description="Assess your school's compliance with UK GDPR Subject Access Request obligations — response timelines, verification procedures, exemptions, and data governance processes."
          color="#38BDF8"
        />
        <SarTrackerChecker />
      </div>
    </div>
  );
}
