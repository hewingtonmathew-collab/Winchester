"use client";
import { useState, useEffect } from "react";
import {
  Plus, Trash2, Pencil, ToggleLeft, ToggleRight, X, Loader2,
  Star, Check, AlertCircle, FileText,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { supabase, type PolicyTemplate } from "@/lib/supabase";

const ACCENT = "#A78BFA";

const POLICY_TYPES = [
  { value: "data_protection",     label: "Data Protection" },
  { value: "online_safety",       label: "Online Safety" },
  { value: "ict_aup",             label: "ICT / AUP" },
  { value: "filtering_monitoring",label: "Filtering & Monitoring" },
  { value: "ai",                  label: "AI Policy" },
  { value: "cctv",                label: "CCTV" },
  { value: "photos",              label: "Photographs" },
  { value: "foi",                 label: "Freedom of Information" },
  { value: "privacy_notice",      label: "Privacy Notice" },
  { value: "other",               label: "Other" },
];

const BLANK: Omit<PolicyTemplate, "id" | "created_by" | "created_at" | "updated_at"> = {
  title: "", policy_type: "data_protection", description: "", content: "",
  is_active: true, is_featured: false, sort_order: 0,
};

// Detect {{PLACEHOLDER}} variables in content
function detectPlaceholders(content: string): string[] {
  const matches = content.match(/\{\{[A-Z_]+\}\}/g) ?? [];
  return [...new Set(matches)];
}

export default function TemplateAdmin() {
  const [templates, setTemplates] = useState<PolicyTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<PolicyTemplate> | null>(null);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("policy_templates")
      .select("*")
      .order("sort_order", { ascending: true });
    setTemplates(data ?? []);
    setLoading(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.title?.trim() || !editing.content?.trim()) {
      setError("Title and content are required."); return;
    }
    setSaving(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();

    if (editing.id) {
      const { error } = await supabase.from("policy_templates").update({
        title: editing.title, policy_type: editing.policy_type,
        description: editing.description || null, content: editing.content,
        is_active: editing.is_active, is_featured: editing.is_featured,
        sort_order: editing.sort_order ?? 0,
        updated_at: new Date().toISOString(),
      }).eq("id", editing.id);
      if (error) { setError(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from("policy_templates").insert({
        ...BLANK, ...editing, created_by: user?.id ?? null,
      });
      if (error) { setError(error.message); setSaving(false); return; }
    }
    setFlash(editing.id ? "Template updated." : "Template created.");
    setTimeout(() => setFlash(null), 3000);
    setSaving(false);
    setEditing(null);
    load();
  }

  async function toggleActive(t: PolicyTemplate) {
    await supabase.from("policy_templates").update({ is_active: !t.is_active }).eq("id", t.id);
    setTemplates(ts => ts.map(x => x.id === t.id ? { ...x, is_active: !x.is_active } : x));
  }

  async function toggleFeatured(t: PolicyTemplate) {
    await supabase.from("policy_templates").update({ is_featured: !t.is_featured }).eq("id", t.id);
    setTemplates(ts => ts.map(x => x.id === t.id ? { ...x, is_featured: !x.is_featured } : x));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this template? This cannot be undone.")) return;
    await supabase.from("policy_templates").delete().eq("id", id);
    setTemplates(ts => ts.filter(x => x.id !== id));
  }

  const placeholders = editing?.content ? detectPlaceholders(editing.content) : [];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold mb-1" style={{ color: "var(--text)" }}>Policy Templates</h2>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Manage the template library. Use <code className="px-1 rounded text-[0.65rem]" style={{ background: "rgba(255,255,255,0.06)" }}>{"{{PLACEHOLDER}}"}</code> syntax for merge fields.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setEditing({ ...BLANK }); setError(null); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shrink-0"
          style={{ background: ACCENT, color: "#000" }}
        >
          <Plus size={14} /> New Template
        </button>
      </div>

      {flash && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
          style={{ background: "rgba(52,211,153,0.1)", color: "#34D399", border: "1px solid rgba(52,211,153,0.2)" }}>
          <Check size={12} /> {flash}
        </div>
      )}

      {/* Edit form */}
      {editing && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              {editing.id ? "Edit Template" : "New Template"}
            </h3>
            <button type="button" onClick={() => setEditing(null)}>
              <X size={16} style={{ color: "var(--text-muted)" }} />
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded-xl text-xs"
              style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
              <AlertCircle size={12} /> {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Title *</label>
                <input
                  type="text"
                  value={editing.title ?? ""}
                  onChange={e => setEditing(d => ({ ...d, title: e.target.value }))}
                  placeholder="e.g. Data Protection Policy"
                  className="rounded-lg px-3 py-2 text-sm border outline-none"
                  style={{ background: "var(--glass-fill)", borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Policy type</label>
                <select
                  value={editing.policy_type ?? "other"}
                  onChange={e => setEditing(d => ({ ...d, policy_type: e.target.value }))}
                  className="rounded-lg px-3 py-2 text-sm border outline-none"
                  style={{ background: "var(--glass-fill)", borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
                >
                  {POLICY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Sort order</label>
                <input
                  type="number"
                  value={editing.sort_order ?? 0}
                  onChange={e => setEditing(d => ({ ...d, sort_order: parseInt(e.target.value) || 0 }))}
                  className="rounded-lg px-3 py-2 text-sm border outline-none"
                  style={{ background: "var(--glass-fill)", borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
                />
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Description (shown on template card)</label>
                <input
                  type="text"
                  value={editing.description ?? ""}
                  onChange={e => setEditing(d => ({ ...d, description: e.target.value }))}
                  placeholder="Brief description of what this template covers"
                  className="rounded-lg px-3 py-2 text-sm border outline-none"
                  style={{ background: "var(--glass-fill)", borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editing.is_active ?? true}
                  onChange={e => setEditing(d => ({ ...d, is_active: e.target.checked }))}
                  className="hidden" />
                {editing.is_active
                  ? <ToggleRight size={20} style={{ color: "#34D399" }} />
                  : <ToggleLeft size={20} style={{ color: "#475569" }} />}
                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editing.is_featured ?? false}
                  onChange={e => setEditing(d => ({ ...d, is_featured: e.target.checked }))}
                  className="hidden" />
                {editing.is_featured
                  ? <ToggleRight size={20} style={{ color: "#F59E0B" }} />
                  : <ToggleLeft size={20} style={{ color: "#475569" }} />}
                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Featured</span>
              </label>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  Content (markdown) *
                </label>
                {placeholders.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {placeholders.map(p => (
                      <span key={p} className="text-[0.6rem] px-1.5 py-0.5 rounded font-mono"
                        style={{ background: "rgba(167,139,250,0.1)", color: ACCENT }}>
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <textarea
                value={editing.content ?? ""}
                onChange={e => setEditing(d => ({ ...d, content: e.target.value }))}
                rows={18}
                placeholder="Write your policy in markdown. Use {{SCHOOL_NAME}}, {{HEADTEACHER_NAME}}, {{DPO_NAME}}, {{DSL_NAME}}, {{CHAIR_OF_GOVERNORS}}, {{APPROVAL_DATE}}, {{REVIEW_DATE}}, {{ACADEMIC_YEAR}}, {{SCHOOL_WEBSITE}}, {{SCHOOL_EMAIL}} as merge fields."
                className="rounded-xl px-4 py-3 text-xs border outline-none resize-y leading-relaxed font-mono"
                style={{ background: "var(--glass-fill)", borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
              />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setEditing(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>
                Cancel
              </button>
              <button type="button" onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold disabled:opacity-40"
                style={{ background: ACCENT, color: "#000" }}>
                {saving ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : "Save Template"}
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Template list */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 size={22} className="animate-spin" style={{ color: ACCENT }} />
        </div>
      ) : templates.length === 0 ? (
        <GlassCard>
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <FileText size={28} style={{ color: "var(--text-muted)" }} />
            <p className="text-sm" style={{ color: "var(--text)" }}>No templates yet</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Create one above or run <code className="px-1 rounded" style={{ background: "rgba(255,255,255,0.06)" }}>POLICY_TEMPLATES_SQL.sql</code> to seed the built-in templates.
            </p>
          </div>
        </GlassCard>
      ) : (
        <div className="flex flex-col gap-2">
          {templates.map(t => (
            <div key={t.id}
              className="rounded-xl border px-4 py-3 flex items-center gap-4 transition-all"
              style={{
                background: t.is_active ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.15)",
                borderColor: "rgba(255,255,255,0.07)",
                opacity: t.is_active ? 1 : 0.6,
              }}
            >
              <FileText size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{t.title}</span>
                  {t.is_featured && <Star size={12} style={{ color: "#F59E0B", flexShrink: 0 }} />}
                  {!t.is_active && (
                    <span className="text-[0.58rem] font-black uppercase tracking-widest px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(100,116,139,0.1)", color: "#64748B" }}>Inactive</span>
                  )}
                </div>
                {t.description && (
                  <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>{t.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={() => toggleFeatured(t)} title={t.is_featured ? "Unfeature" : "Feature"}>
                  <Star size={14} style={{ color: t.is_featured ? "#F59E0B" : "#334155" }} />
                </button>
                <button type="button" onClick={() => toggleActive(t)} title={t.is_active ? "Deactivate" : "Activate"}>
                  {t.is_active
                    ? <ToggleRight size={18} style={{ color: "#34D399" }} />
                    : <ToggleLeft size={18} style={{ color: "#475569" }} />}
                </button>
                <button type="button" onClick={() => { setEditing({ ...t }); setError(null); }}>
                  <Pencil size={14} style={{ color: ACCENT }} />
                </button>
                <button type="button" onClick={() => handleDelete(t.id)}>
                  <Trash2 size={14} style={{ color: "#EF4444" }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
