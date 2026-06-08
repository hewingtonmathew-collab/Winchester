"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const LS_KEY = (key: string) => `safeshield_content_${key}`;

export function useEditableContent(key: string, defaultValue: string) {
  const [value, setValue] = useState(defaultValue);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from("site_content")
          .select("value")
          .eq("key", key)
          .maybeSingle();
        if (data?.value) { setValue(data.value); return; }
      } catch { /* table may not exist yet */ }
      const stored = typeof window !== "undefined" ? localStorage.getItem(LS_KEY(key)) : null;
      if (stored) setValue(stored);
    }
    load();
  }, [key]);

  const save = useCallback(async (newValue: string) => {
    setSaving(true);
    setValue(newValue);
    if (typeof window !== "undefined") localStorage.setItem(LS_KEY(key), newValue);
    try {
      await supabase.from("site_content").upsert(
        { key, value: newValue, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    } catch { /* graceful fallback */ }
    setSaving(false);
  }, [key]);

  return { value, save, saving };
}
