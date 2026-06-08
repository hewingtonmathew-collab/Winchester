"use client";
import { useRef, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import { useToolBanner } from "@/hooks/useToolBanner";
import { useAuth } from "@/context/AuthContext";
import { useEditableContent } from "@/hooks/useEditableContent";
import EditableText from "@/components/ui/EditableText";

interface SidebarVideoCardProps {
  toolSlug: string;
  color: string;
  defaultTitle: string;
  defaultDescription: string;
}

export default function SidebarVideoCard({
  toolSlug, color, defaultTitle, defaultDescription,
}: SidebarVideoCardProps) {
  // Video uses the same banner mechanism with a different slug key
  const { bannerUrl: videoUrl, uploadBanner, uploading } = useToolBanner(`${toolSlug}-video`);
  const { value: title, save: saveTitle } = useEditableContent(`${toolSlug}-video-title`, defaultTitle);
  const { value: desc, save: saveDesc } = useEditableContent(`${toolSlug}-video-desc`, defaultDescription);
  const { profile } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);
  const isAdmin = profile?.role === "admin";

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("video/")) return;
    const url = await uploadBanner(file);
    if (url) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div style={{ position: "relative" }}>
      <GlassCard className="p-0 overflow-hidden">
        <video
          src={videoUrl}
          controls
          playsInline
          preload="metadata"
          className="w-full"
          style={{ display: "block", maxHeight: 220, objectFit: "cover" }}
        />
        <div className="px-4 py-3">
          <EditableText
            as="p"
            value={title}
            onSave={saveTitle}
            className="text-xs font-bold mb-1"
            style={{ color, display: "block" }}
          />
          <EditableText
            as="p"
            value={desc}
            onSave={saveDesc}
            multiline
            className="text-xs leading-relaxed"
            style={{ color: "var(--text-muted)", display: "block" }}
          />
        </div>
      </GlassCard>

      {/* Admin-only video replace button */}
      {isAdmin && (
        <>
          <input ref={inputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={handleChange} />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            style={{
              position: "absolute", top: 8, right: 8, zIndex: 10,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: 999, color: "#fff",
              fontSize: 10, fontWeight: 700,
              padding: "4px 10px",
              cursor: uploading ? "wait" : "pointer",
              letterSpacing: "0.03em",
            }}
          >
            {uploading ? "Uploading…" : saved ? "✓ Saved" : "📹 Replace Video"}
          </button>
          {isAdmin && !uploading && !saved && (
            <p style={{
              textAlign: "right", fontSize: 9, marginTop: 4,
              color: "var(--text-dim)",
            }}>
              Video only · max 50 MB · stored locally
            </p>
          )}
        </>
      )}
    </div>
  );
}
