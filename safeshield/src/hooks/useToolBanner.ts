"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const DEFAULT_BANNER = "/banner-bg.mp4";

export function useToolBanner(toolSlug: string) {
  const [bannerUrl, setBannerUrl] = useState<string>(DEFAULT_BANNER);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function load() {
      // Try Supabase tool_settings first
      try {
        const { data, error } = await supabase
          .from("tool_settings")
          .select("banner_url")
          .eq("tool_slug", toolSlug)
          .single();
        if (!error && data?.banner_url) {
          setBannerUrl(data.banner_url);
          return;
        }
      } catch {
        // ignore
      }
      // Fall back to localStorage
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(`safeshield_banner_${toolSlug}`);
        if (stored) {
          setBannerUrl(stored);
          return;
        }
      }
      // Fall back to default
      setBannerUrl(DEFAULT_BANNER);
    }
    load();
  }, [toolSlug]);

  const uploadBanner = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const ext = file.name.split(".").pop() ?? "mp4";
        const path = `${toolSlug}/banner.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("banners")
          .upload(path, file, { upsert: true, contentType: file.type });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("banners").getPublicUrl(path);
        const publicUrl = urlData.publicUrl;

        // Upsert to tool_settings
        await supabase.from("tool_settings").upsert(
          { tool_slug: toolSlug, banner_url: publicUrl, updated_at: new Date().toISOString() },
          { onConflict: "tool_slug" }
        );

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(`safeshield_banner_${toolSlug}`, publicUrl);
        }

        setBannerUrl(publicUrl);
        return publicUrl;
      } finally {
        setUploading(false);
      }
    },
    [toolSlug]
  );

  return { bannerUrl, setBannerUrl, uploadBanner, uploading };
}
