"use client";
import { useRef, useState } from "react";
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
  const [hovered, setHovered] = useState(false);

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
      {/* Full overlay on hover */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); inputRef.current?.click(); }}
        title="Upload custom icon (admin)"
        className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-150 z-10"
        style={{
          background: hovered ? "rgba(0,0,0,0.55)" : "transparent",
        }}>
        {hovered && (
          <>
            <Camera size={14} color="#fff" />
            <span className="text-[9px] text-white mt-0.5 font-medium">Upload</span>
          </>
        )}
      </div>

      {/* Remove button — only when custom icon set */}
      {hasCustom && onClear && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClear(); }}
          title="Remove custom icon"
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center z-20"
          style={{ background: "rgba(239,68,68,0.9)", border: "1px solid rgba(239,68,68,0.5)" }}>
          <X size={8} color="#fff" />
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
