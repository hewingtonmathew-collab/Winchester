"use client";
import { useRef } from "react";
import { Camera, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  onUpload: (dataUrl: string) => void;
  onClear?: () => void;
  hasCustom?: boolean;
}

export default function ToolIconUpload({ onUpload, onClear, hasCustom }: Props) {
  const { profile } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  if (profile?.role !== "admin") return null;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <>
      {/* Persistent camera badge — tap/click to upload (works on mobile) */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); inputRef.current?.click(); }}
        title="Upload icon (super admin)"
        className="absolute bottom-0 right-0 w-4 h-4 rounded-full flex items-center justify-center z-10"
        style={{ background: "rgba(56,189,248,0.95)", border: "1.5px solid rgba(0,0,0,0.3)" }}>
        <Camera size={8} color="#fff" />
      </button>

      {/* Remove button — only when custom icon is set */}
      {hasCustom && onClear && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClear(); }}
          title="Remove custom icon"
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center z-20 text-white"
          style={{ background: "rgba(239,68,68,0.9)", border: "1.5px solid rgba(0,0,0,0.3)", fontSize: 8 }}>
          ✕
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
        onClick={e => e.stopPropagation()}
      />
    </>
  );
}
