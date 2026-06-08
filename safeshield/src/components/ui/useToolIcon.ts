"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const LS_PREFIX = "safeshield_icon_";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useToolIcon(slug: string) {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  useEffect(() => {
    // Load from localStorage immediately
    try {
      const cached = localStorage.getItem(LS_PREFIX + slug);
      if (cached) setIconUrl(cached);
    } catch {}

    // Then sync from DB
    supabase
      .from("tool_settings")
      .select("icon_url")
      .eq("tool_slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.icon_url) {
          setIconUrl(data.icon_url);
          try { localStorage.setItem(LS_PREFIX + slug, data.icon_url); } catch {}
        }
      });
  }, [slug]);

  const saveIcon = useCallback(async (dataUrl: string) => {
    setSaveStatus("saving");
    setIconUrl(dataUrl);
    try { localStorage.setItem(LS_PREFIX + slug, dataUrl); } catch {}

    const { error } = await supabase
      .from("tool_settings")
      .upsert(
        { tool_slug: slug, icon_url: dataUrl, updated_at: new Date().toISOString() },
        { onConflict: "tool_slug" }
      );

    if (error) {
      console.error("Icon save failed:", error.message, error.details, error.hint);
      setSaveStatus("error");
      alert(`Icon save failed: ${error.message}`);
    } else {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  }, [slug]);

  const clearIcon = useCallback(async () => {
    setIconUrl(null);
    setSaveStatus("idle");
    try { localStorage.removeItem(LS_PREFIX + slug); } catch {}
    await supabase
      .from("tool_settings")
      .update({ icon_url: null, updated_at: new Date().toISOString() })
      .eq("tool_slug", slug);
  }, [slug]);

  return { iconUrl, saveIcon, clearIcon, saveStatus };
}
