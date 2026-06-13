"use client";
import { UserCheck } from "lucide-react";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import SaferRecruitmentChecker from "@/components/forms/SaferRecruitmentChecker";

export default function SaferRecruitmentPage() {
  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ToolPageHeader
          slug="safer-recruitment"
          icon={UserCheck}
          badge="Recruitment"
          title="Safer Recruitment Audit"
          description="Audit your school's safer recruitment procedures against KCSIE 2024 and DfE guidance to ensure all safeguarding checks are completed and the Single Central Record is inspection-ready."
          color="#34D399"
        />
        <SaferRecruitmentChecker />
      </div>
    </div>
  );
}
