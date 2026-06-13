"use client";
import { useState, useEffect } from "react";
import { Palette, Plus, Trash2, Loader2, Upload, Building2, User, School } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useSeasonalTheme } from "@/context/SeasonalThemeContext";
import { SEASONAL_THEMES, type SeasonalThemeSlug } from "@/lib/seasonalThemes";
import { supabase } from "@/lib/supabase";
import type { Organisation, School as SchoolType } from "@/lib/supabase";

type UserRow = { id: string; email: string; full_name: string | null };

const TARGET_TYPES = [
  { value: "org",    label: "MAT / Organisation", Icon: Building2 },
  { value: "school", label: "School",             Icon: School },
  { value: "user",   label: "Individual User",    Icon: User },
] as const;

export default function ThemeManager() {
  const { allAssignments, saveAssignment, removeAssignment, refresh } = useSeasonalTheme();
  const [orgs, setOrgs] = useState<Organisation[]>([]);
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  // New assignment form
  const [themeSlug, setThemeSlug] = useState<SeasonalThemeSlug>("christmas");
  const [targetType, setTargetType] = useState<"org" | "school" | "user">("school");
  const [targetId, setTargetId] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: o }, { data: s }, { data: u }] = await Promise.all([
        supabase.from("organisations").select("*").order("name"),
        supabase.from("schools").select("*").order("name"),
        supabase.from("profiles").select("id,email:id,full_name").order("full_name"),
      ]);
      // profiles doesn't have email — fetch via auth.users view if available, else use id
      setOrgs((o as Organisation[]) ?? []);
      setSchools((s as SchoolType[]) ?? []);
      // Load users from profiles
      const { data: profiles } = await supabase.from("profiles").select("id, full_name").order("full_name");
      setUsers((profiles ?? []).map((p: { id: string; full_name: string | null }) => ({ id: p.id, email: p.id, full_name: p.full_name })));
      setLoading(false);
    })();
  }, []);

  function handleBannerFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBannerFile(f);
    const reader = new FileReader();
    reader.onload = () => setBannerPreview(reader.result as string);
    reader.readAsDataURL(f);
    e.target.value = "";
  }

  function showToast(type: "ok" | "err", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleSave() {
    if (!targetId) return;
    setSaving(true);
    try {
      let bannerUrl: string | null = null;
      if (bannerFile) {
        const ext = bannerFile.name.split(".").pop();
        const path = `theme-banners/${targetType}-${targetId}.${ext}`;
        const { error: upErr } = await supabase.storage.from("theme-assets").upload(path, bannerFile, { upsert: true });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("theme-assets").getPublicUrl(path);
        bannerUrl = data.publicUrl;
      }
      await saveAssignment({ themeSlug, targetType, targetId, bannerUrl });
      setTargetId(""); setBannerFile(null); setBannerPreview(null);
      showToast("ok", "Theme assigned successfully.");
    } catch (e: unknown) {
      showToast("err", (e as Error)?.message ?? "Failed to save theme. Check the theme_assignments table exists.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id: string) {
    setDeleting(id);
    try {
      await removeAssignment(id);
      refresh();
    } catch (e: unknown) {
      showToast("err", (e as Error)?.message ?? "Failed to remove theme.");
    } finally {
      setDeleting(null);
    }
  }

  function targetLabel(a: typeof allAssignments[0]) {
    if (a.target_type === "org") return orgs.find(o => o.id === a.target_id)?.name ?? a.target_id;
    if (a.target_type === "school") return schools.find(s => s.id === a.target_id)?.name ?? a.target_id;
    return users.find(u => u.id === a.target_id)?.full_name ?? a.target_id;
  }

  const selectOptions = targetType === "org" ? orgs.map(o => ({ id: o.id, label: o.name }))
    : targetType === "school" ? schools.map(s => ({ id: s.id, label: s.name }))
    : users.map(u => ({ id: u.id, label: u.full_name ?? u.id }));

  const inputClass = "px-3 py-2 rounded-xl text-sm glass border border-white/10 bg-white/5 outline-none focus:border-[rgba(56,189,248,0.4)] w-full";

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#38BDF8]" size={24} /></div>;

  return (
    <div className="flex flex-col gap-6">
      {toast && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium border ${toast.type === "ok" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
          {toast.type === "ok" ? "✓ " : "✗ "}{toast.msg}
        </div>
      )}
      <div className="flex items-center gap-2">
        <Palette size={18} className="text-[#A78BFA]" />
        <h2 className="text-white font-semibold text-lg">Seasonal Theme Manager</h2>
      </div>
      <p className="text-[#64748B] text-sm -mt-4">
        Apply a seasonal theme to a MAT, school, or individual user. The most specific assignment wins (user &gt; school &gt; org).
        You can optionally upload a custom festive banner image that will display at the top of their dashboard.
      </p>

      {/* New assignment */}
      <GlassCard>
        <p className="text-sm font-semibold text-white mb-4">Assign a Theme</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {/* Theme picker */}
          <div>
            <label className="text-xs text-[#64748B] mb-1 block">Theme</label>
            <select value={themeSlug} onChange={e => setThemeSlug(e.target.value as SeasonalThemeSlug)}
              className={inputClass} style={{ color: "var(--text)" }}>
              {Object.values(SEASONAL_THEMES).filter(t => t.slug !== "default").map(t => (
                <option key={t.slug} value={t.slug} style={{ background: "#0f172a" }}>
                  {t.emoji} {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Target type */}
          <div>
            <label className="text-xs text-[#64748B] mb-1 block">Apply to</label>
            <div className="flex gap-2">
              {TARGET_TYPES.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  onClick={() => { setTargetType(value); setTargetId(""); }}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-xs font-medium border transition-all"
                  style={{
                    background: targetType === value ? "rgba(56,189,248,0.1)" : "rgba(255,255,255,0.03)",
                    borderColor: targetType === value ? "rgba(56,189,248,0.4)" : "rgba(255,255,255,0.08)",
                    color: targetType === value ? "#38BDF8" : "var(--text-dim)",
                  }}
                >
                  <Icon size={11} /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {/* Target selector */}
          <div>
            <label className="text-xs text-[#64748B] mb-1 block">
              {targetType === "org" ? "Organisation" : targetType === "school" ? "School" : "User"}
            </label>
            <select value={targetId} onChange={e => setTargetId(e.target.value)}
              className={inputClass} style={{ color: "var(--text)" }}>
              <option value="" disabled style={{ background: "#0f172a" }}>Select…</option>
              {selectOptions.map(o => (
                <option key={o.id} value={o.id} style={{ background: "#0f172a" }}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Banner upload */}
          <div>
            <label className="text-xs text-[#64748B] mb-1 block">Custom Banner Image (optional)</label>
            {bannerPreview ? (
              <div className="flex items-center gap-2">
                <div className="rounded-xl overflow-hidden border border-white/10" style={{ maxWidth: 120, maxHeight: 48 }}>
                  <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
                </div>
                <label className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl glass border border-white/10 text-xs cursor-pointer hover:border-white/20" style={{ color: "var(--text-dim)" }}>
                  <Upload size={10} /> Replace
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={handleBannerFile} />
                </label>
                <button onClick={() => { setBannerFile(null); setBannerPreview(null); }} className="text-red-400 text-xs">Remove</button>
              </div>
            ) : (
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/10 text-sm cursor-pointer hover:border-white/20 transition-all" style={{ color: "var(--text-dim)" }}>
                <Upload size={13} /> Upload festive banner
                <input type="file" accept="image/*,video/*" className="hidden" onChange={handleBannerFile} />
              </label>
            )}
          </div>
        </div>

        {/* Theme preview */}
        {themeSlug !== "default" && (
          <div
            className="rounded-xl p-3 mb-3 flex items-center gap-3"
            style={{ background: SEASONAL_THEMES[themeSlug].banner.gradient, border: `1px solid ${SEASONAL_THEMES[themeSlug].banner.accentColor}30` }}
          >
            <span className="text-2xl">{SEASONAL_THEMES[themeSlug].emoji}</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: SEASONAL_THEMES[themeSlug].banner.textColor }}>{SEASONAL_THEMES[themeSlug].label} Theme</p>
              <p className="text-xs" style={{ color: SEASONAL_THEMES[themeSlug].banner.accentAlt }}>{SEASONAL_THEMES[themeSlug].description}</p>
            </div>
            <div className="ml-auto flex gap-1.5">
              {[SEASONAL_THEMES[themeSlug].banner.accentColor, SEASONAL_THEMES[themeSlug].banner.accentAlt].map(c => (
                <div key={c} className="w-4 h-4 rounded-full border border-white/20" style={{ background: c }} />
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving || !targetId}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
          style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.35)", color: "#A78BFA" }}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Assign Theme
        </button>
      </GlassCard>

      {/* Existing assignments */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-dim)" }}>
          Active Theme Assignments ({allAssignments.length})
        </p>
        {allAssignments.length === 0 && (
          <p className="text-sm text-[#475569]">No themes assigned yet.</p>
        )}
        <div className="flex flex-col gap-2">
          {allAssignments.map(a => {
            const theme = SEASONAL_THEMES[a.theme_slug as SeasonalThemeSlug] ?? SEASONAL_THEMES.default;
            const Icon = TARGET_TYPES.find(t => t.value === a.target_type)?.Icon ?? User;
            return (
              <div key={a.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-xl shrink-0">{theme.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-white">{targetLabel(a)}</span>
                    <span className="text-[0.6rem] px-1.5 py-0.5 rounded-full border font-semibold uppercase"
                      style={{ color: theme.banner.accentColor, background: `${theme.banner.accentColor}15`, borderColor: `${theme.banner.accentColor}35` }}>
                      {theme.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[0.65rem]" style={{ color: "var(--text-faint)" }}>
                    <Icon size={10} />
                    <span className="capitalize">{a.target_type}</span>
                    {a.banner_url && <span>· Custom banner</span>}
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(a.id)}
                  disabled={deleting === a.id}
                  className="w-7 h-7 rounded-lg flex items-center justify-center glass hover:bg-red-500/10 transition-all disabled:opacity-50 shrink-0"
                >
                  {deleting === a.id ? <Loader2 size={12} className="animate-spin text-red-400" /> : <Trash2 size={12} className="text-red-400" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
