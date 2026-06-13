"use client";
import { AlertTriangle } from "lucide-react";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import PreventChecker from "@/components/forms/PreventChecker";

export default function PreventPage() {
  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ToolPageHeader
          slug="prevent"
          icon={AlertTriangle}
          badge="Prevent"
          title="Prevent & Radicalisation Self-Assessment"
          description="Evaluate your school's compliance with the Prevent duty and safeguarding against radicalisation under the Counter-Terrorism and Security Act 2015."
          color="#FBBF24"
        />
        <PreventChecker />
      </div>
    </div>
  );
}
