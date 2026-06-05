"use client";
import { useRef } from "react";
import { Upload, X } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export type ReportMetaData = {
  schoolName: string;
  schoolEmail: string;
  consultantName: string;
  consultantEmail: string;
  staffMember: string;
  logoDataUrl: string | null;
};

type Props = {
  value: ReportMetaData;
  onChange: (v: ReportMetaData) => void;
  accentColor?: string;
  accentDim?: string;
  accentBorder?: string;
};

export default function ReportMeta({
  value,
  onChange,
  accentColor = "#38BDF8",
  accentDim = "rgba(56,189,248,0.12)",
  accentBorder = "rgba(56,189,248,0.25)",
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  function set(field: keyof ReportMetaData, val: string) {
    onChange({ ...value, [field]: val });
  }

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ ...value, logoDataUrl: reader.result as string });
    reader.readAsDataURL(file);
  }

  const inputClass =
    "w-full px-3 py-2 rounded-xl text-sm text-white bg-white/[0.04] border border-white/10 focus:outline-none transition-colors placeholder:text-[#475569]";

  return (
    <GlassCard>
      <h2 className="text-white font-semibold text-lg mb-1">Report Details</h2>
      <p className="text-[#64748B] text-xs mb-6 leading-relaxed">
        These details will appear on the generated certificate and improvement report.
      </p>

      <div className="flex flex-col gap-5">
        {/* Logo upload */}
        <div>
          <label className="block text-[#CBD5E1] text-sm mb-1">School Logo</label>
          <p className="text-[#475569] text-xs mb-2">Optional — appears on the certificate and report.</p>
          {value.logoDataUrl ? (
            <div className="flex items-center gap-3">
              <img src={value.logoDataUrl} alt="School logo" className="h-14 w-auto object-contain rounded-lg bg-white/5 p-1" />
              <button
                type="button"
                onClick={() => onChange({ ...value, logoDataUrl: null })}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                <X size={12} /> Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-[#64748B] text-sm hover:text-white hover:border-white/20 transition-all"
            >
              <Upload size={14} /> Upload Logo
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
        </div>

        {/* School */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#CBD5E1] text-sm mb-1">
              School / Trust Name <span style={{ color: accentColor }}>*</span>
            </label>
            <input
              type="text"
              value={value.schoolName}
              onChange={(e) => set("schoolName", e.target.value)}
              className={inputClass}
              style={{ borderColor: value.schoolName ? accentBorder : undefined }}
              placeholder="e.g. Oakfield Academy"
            />
          </div>
          <div>
            <label className="block text-[#CBD5E1] text-sm mb-1">School Email</label>
            <input
              type="email"
              value={value.schoolEmail}
              onChange={(e) => set("schoolEmail", e.target.value)}
              className={inputClass}
              placeholder="admin@school.org.uk"
            />
          </div>
        </div>

        {/* Staff member */}
        <div>
          <label className="block text-[#CBD5E1] text-sm mb-1">
            Staff Member Completing Assessment <span style={{ color: accentColor }}>*</span>
          </label>
          <input
            type="text"
            value={value.staffMember}
            onChange={(e) => set("staffMember", e.target.value)}
            className={inputClass}
            placeholder="e.g. Jane Smith, Deputy Headteacher"
          />
        </div>

        {/* Consultant */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#CBD5E1] text-sm mb-1">
              Consultant Name <span style={{ color: accentColor }}>*</span>
            </label>
            <input
              type="text"
              value={value.consultantName}
              onChange={(e) => set("consultantName", e.target.value)}
              className={inputClass}
              placeholder="e.g. Matthew Hewington"
            />
          </div>
          <div>
            <label className="block text-[#CBD5E1] text-sm mb-1">Consultant Email</label>
            <input
              type="email"
              value={value.consultantEmail}
              onChange={(e) => set("consultantEmail", e.target.value)}
              className={inputClass}
              placeholder="consultant@winchester.co.uk"
            />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
