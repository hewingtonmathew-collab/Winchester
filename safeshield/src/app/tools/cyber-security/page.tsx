"use client";
import { Shield } from "lucide-react";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import CyberSecurityChecker from "@/components/forms/CyberSecurityChecker";

export default function CyberSecurityPage() {
  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ToolPageHeader
          slug="cyber-security"
          icon={Shield}
          badge="Cyber Security"
          title="Cyber Security Checker"
          description="Assess your school's cyber security posture against NCSC, DfE and Cyber Essentials guidance. Identify gaps in network controls, access management, device security and incident response."
          color="#F87171"
        />
        <CyberSecurityChecker />
      </div>
    </div>
  );
}
