"use client";
import { useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface BannerUploadButtonProps {
  toolSlug: string;
  onUploaded: (url: string) => void;
  uploadBanner: (file: File) => Promise<string | undefined>;
  clearBanner?: () => Promise<void>;
  uploading: boolean;
  hasCustomBanner?: boolean;
}

export default function BannerUploadButton({
  onUploaded,
  uploadBanner,
  clearBanner,
  uploading,
  hasCustomBanner,
}: BannerUploadButtonProps) {
  const { profile } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);

  if (profile?.role !== "admin") return null;

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadBanner(file);
      if (url) {
        onUploaded(url);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error("Banner upload failed:", err);
    } finally {
      // reset so same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div style={{ position: "absolute", top: 12, right: 12, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
      <input
        ref={inputRef}
        type="file"
        accept="video/*,image/*,.gif"
        style={{ display: "none" }}
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 14px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.3)",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
          color: "#fff",
          fontSize: 12,
          fontWeight: 600,
          cursor: uploading ? "not-allowed" : "pointer",
          opacity: uploading ? 0.7 : 1,
          transition: "opacity 0.2s",
        }}
      >
        {uploading ? (
          <>
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                border: "2px solid rgba(255,255,255,0.4)",
                borderTop: "2px solid #fff",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
              }}
            />
            Uploading…
          </>
        ) : saved ? (
          "✓ Saved"
        ) : (
          <>
            <span>&#128249;</span> Update Banner
          </>
        )}
      </button>

      {/* Remove banner button — only when a custom banner is set */}
      {hasCustomBanner && clearBanner && !uploading && !saved && (
        <button
          type="button"
          onClick={clearBanner}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: 999,
            border: "1px solid rgba(239,68,68,0.5)",
            background: "rgba(239,68,68,0.15)",
            backdropFilter: "blur(8px)",
            color: "#FCA5A5",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ✕ Remove Banner
        </button>
      )}

      {/* Spec hint — only shown when not uploading/saved */}
      {!uploading && !saved && (
        <div
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8,
            padding: "6px 10px",
            fontSize: 10,
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.7)",
            textAlign: "right",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: "#38BDF8", fontWeight: 700 }}>Video</span> MP4/WebM · 1920×400px · max 15 MB (stored locally)
          <br />
          <span style={{ color: "#A78BFA", fontWeight: 700 }}>Image/GIF</span> JPG/PNG/GIF · 1920×400px · max 2 MB
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
