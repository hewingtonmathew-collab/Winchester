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
    <div className="absolute -bottom-1 -right-1 flex gap-0.5 z-10">
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); inputRef.current?.click(); }}
        title="Upload custom icon"
        className="w-5 h-5 rounded-full flex items-center justify-center"
        style={{ background: "rgba(56,189,248,0.9)", border: "1px solid rgba(56,189,248,0.5)" }}>
        <Camera size={10} color="#fff" />
      </button>
      {hasCustom && onClear && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClear(); }}
          title="Remove custom icon"
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: "rgba(239,68,68,0.85)", border: "1px solid rgba(239,68,68,0.4)" }}>
          <X size={10} color="#fff" />
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} onClick={e => e.stopPropagation()} />
    </div>
  );
}
