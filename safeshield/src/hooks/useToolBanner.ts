"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const DEFAULT_BANNER = "/banner-bg.mp4";
const LS_KEY = (slug: string) => `safeshield_banner_${slug}`;

function isVideo(url: string) {
  return /\.(mp4|webm|mov|ogv)$/i.test(url) || url === DEFAULT_BANNER || url.startsWith("data:video/");
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

export function useToolBanner(toolSlug: string) {
  const [bannerUrl, setBannerUrl] = useState<string>(DEFAULT_BANNER);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function load() {
      // 1. Try tool_settings table
      try {
        const { data } = await supabase
          .from("tool_settings")
          .select("banner_url")
          .eq("tool_slug", toolSlug)
          .maybeSingle();
        if (data?.banner_url) {
          setBannerUrl(data.banner_url);
          return;
        }
      } catch { /* ignore */ }

      // 2. Fall back to localStorage (large data URLs stored here)
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(LS_KEY(toolSlug));
        if (stored) { setBannerUrl(stored); return; }
      }

      setBannerUrl(DEFAULT_BANNER);
    }
    load();
  }, [toolSlug]);

  const uploadBanner = useCallback(async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const isVid = file.type.startsWith("video/");

      if (isVid) {
        // Videos are too large for DB — store in localStorage only
        if (typeof window !== "undefined") {
          localStorage.setItem(LS_KEY(toolSlug), dataUrl);
        }
        setBannerUrl(dataUrl);
        return dataUrl;
      }

      // Images / GIFs — try to save to tool_settings, also localStorage
      try {
        await supabase.from("tool_settings").upsert(
          { tool_slug: toolSlug, banner_url: dataUrl, updated_at: new Date().toISOString() },
          { onConflict: "tool_slug" }
        );
      } catch { /* table may not exist yet — falls back to localStorage */ }

      if (typeof window !== "undefined") {
        localStorage.setItem(LS_KEY(toolSlug), dataUrl);
      }
      setBannerUrl(dataUrl);
      return dataUrl;
    } finally {
      setUploading(false);
    }
  }, [toolSlug]);

  return { bannerUrl, setBannerUrl, isVideo, uploadBanner, uploading };
}
