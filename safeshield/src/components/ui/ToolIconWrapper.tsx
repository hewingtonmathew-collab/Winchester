"use client";
import { useRef } from "react";
import { Camera } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToolIcon } from "./useToolIcon";

interface Props {
  slug: string;
  Icon: React.ComponentType<{ size?: number }>;
  size?: number;
}

export default function ToolIconWrapper({ slug, Icon, size = 64 }: Props) {
  const { profile, enabledTools } = useAuth();
  const isAdmin = profile?.role === "admin" || enabledTools.includes("*");
  const { iconUrl, saveIcon, clearIcon, saveStatus } = useToolIcon(slug);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) { alert("Image must be under 2 MB"); return; }
    const reader = new FileReader();
    reader.onload = () => saveIcon(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="relative shrink-0 inline-flex" style={{ width: size, height: size }}>
      {iconUrl ? (
        <img
          src={iconUrl}
          alt=""
          style={{ width: size, height: size, objectFit: "contain" }}
        />
      ) : (
        <Icon size={size} />
      )}

      {isAdmin && (
        <>
          {/* Camera badge — always visible for admin, tap to upload */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); inputRef.current?.click(); }}
            title="Upload custom icon (super admin)"
            className="absolute bottom-0 right-0 flex items-center justify-center rounded-full"
            style={{
              width: size * 0.28,
              height: size * 0.28,
              background: "rgba(56,189,248,0.95)",
              border: "2px solid rgba(0,0,0,0.4)",
            }}>
            <Camera size={size * 0.14} color="#fff" />
          </button>

          {/* Remove button when custom icon is set */}
          {iconUrl && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); clearIcon(); }}
              title="Remove custom icon"
              className="absolute top-0 right-0 flex items-center justify-center rounded-full text-white font-bold"
              style={{
                width: size * 0.25,
                height: size * 0.25,
                fontSize: size * 0.12,
                background: "rgba(239,68,68,0.9)",
                border: "2px solid rgba(0,0,0,0.4)",
              }}>
              ✕
            </button>
          )}

          {/* Save status indicator */}
          {saveStatus !== "idle" && (
            <span
              className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold whitespace-nowrap px-1.5 py-0.5 rounded"
              style={{
                background: saveStatus === "saved" ? "rgba(34,197,94,0.9)" : saveStatus === "error" ? "rgba(239,68,68,0.9)" : "rgba(56,189,248,0.9)",
                color: "#fff",
              }}>
              {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved ✓" : "Failed ✗"}
            </span>
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
      )}
    </div>
  );
}
