"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const LS_PREFIX = "safeshield_icon_";

export function useToolIcon(slug: string) {
  const [iconUrl, setIconUrl] = useState<string | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem(LS_PREFIX + slug);
    if (cached) setIconUrl(cached);

    supabase
      .from("tool_settings")
      .select("icon_url")
      .eq("tool_slug", slug)
      .single()
      .then(({ data }) => {
        if (data?.icon_url) {
          setIconUrl(data.icon_url);
          localStorage.setItem(LS_PREFIX + slug, data.icon_url);
        }
      });
  }, [slug]);

  const saveIcon = useCallback(async (dataUrl: string) => {
    setIconUrl(dataUrl);
    localStorage.setItem(LS_PREFIX + slug, dataUrl);
    await supabase
      .from("tool_settings")
      .upsert({ tool_slug: slug, icon_url: dataUrl, updated_at: new Date().toISOString() }, { onConflict: "tool_slug" });
  }, [slug]);

  const clearIcon = useCallback(async () => {
    setIconUrl(null);
    localStorage.removeItem(LS_PREFIX + slug);
    await supabase
      .from("tool_settings")
      .update({ icon_url: null, updated_at: new Date().toISOString() })
      .eq("tool_slug", slug);
  }, [slug]);

  return { iconUrl, saveIcon, clearIcon };
}
