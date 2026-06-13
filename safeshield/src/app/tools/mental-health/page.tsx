"use client";
import { Heart } from "lucide-react";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import MentalHealthChecker from "@/components/forms/MentalHealthChecker";

export default function MentalHealthPage() {
  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ToolPageHeader
          slug="mental-health"
          icon={Heart}
          badge="Wellbeing"
          title="Mental Health & Wellbeing Audit"
          description="Evaluate your school's approach to mental health and wellbeing against DfE Senior Mental Health Lead guidance and the Whole School Approach framework."
          color="#F472B6"
        />
        <MentalHealthChecker />
      </div>
    </div>
  );
}
