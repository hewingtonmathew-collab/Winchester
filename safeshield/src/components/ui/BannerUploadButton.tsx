"use client";
import { useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface BannerUploadButtonProps {
  toolSlug: string;
  onUploaded: (url: string) => void;
  uploadBanner: (file: File) => Promise<string | undefined>;
  uploading: boolean;
}

export default function BannerUploadButton({
  onUploaded,
  uploadBanner,
  uploading,
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
    <div style={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}>
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
          "Saved"
        ) : (
          <>
            <span>&#128249;</span> Update Banner
          </>
        )}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
