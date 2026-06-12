"use client";
import { useState, useEffect, useRef } from "react";
import {
  Upload, FileText, Trash2, ToggleLeft, ToggleRight, Plus, X,
  ExternalLink, BookOpen, Loader2, AlertCircle, Check,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { supabase, type PolicyReferenceDoc } from "@/lib/supabase";

const ACCENT = "#A78BFA";
const CATEGORIES = [
  { value: "legislation", label: "Legislation", color: "#EF4444" },
  { value: "guidance",    label: "Guidance",    color: "#38BDF8" },
  { value: "framework",   label: "Framework",   color: "#34D399" },
  { value: "template",    label: "Template",    color: "#F59E0B" },
] as const;

async function extractText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

const BLANK_FORM = {
  title: "", category: "guidance" as PolicyReferenceDoc["category"],
  description: "", source_url: "", content: "",
};

export default function ReferenceDocManager() {
  const [docs, setDocs] = useState<PolicyReferenceDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ...BLANK_FORM });
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("policy_reference_docs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setDocs(data ?? []);
    setLoading(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setExtracting(true);
    try {
      const text = await extractText(file);
      setForm(f => ({ ...f, content: text, title: f.title || file.name.replace(/\.docx$/i, "") }));
    } catch {
      setError("Could not extract text from file.");
    }
    setExtracting(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("policy_reference_docs").insert({
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim() || null,
      source_url: form.source_url.trim() || null,
      content: form.content.trim(),
      is_active: true,
      uploaded_by: user?.id ?? null,
    });
    if (error) { setError(error.message); setSaving(false); return; }
    setFlash("Document added.");
    setTimeout(() => setFlash(null), 3000);
    setForm({ ...BLANK_FORM });
    setShowAdd(false);
    setSaving(false);
    load();
  }

  async function toggleActive(doc: PolicyReferenceDoc) {
    const { error } = await supabase
      .from("policy_reference_docs")
      .update({ is_active: !doc.is_active })
      .eq("id", doc.id);
    if (!error) setDocs(d => d.map(x => x.id === doc.id ? { ...x, is_active: !x.is_active } : x));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this reference document?")) return;
    await supabase.from("policy_reference_docs").delete().eq("id", id);
    setDocs(d => d.filter(x => x.id !== id));
  }

  const catConfig = (cat: string) => CATEGORIES.find(c => c.value === cat) ?? CATEGORIES[1];

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold mb-1" style={{ color: "var(--text)" }}>
            Policy Reference Documents
          </h2>
          <p className="text-xs leading-relaxed max-w-xl" style={{ color: "var(--text-muted)" }}>
            These documents ground the AI — it can only cite legislation, guidance, and provisions that appear here or in the built-in canonical URL map. Upload the full text of KCSIE, ICO guidance, DfE standards, etc. to eliminate hallucinations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setShowAdd(true); setError(null); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shrink-0"
          style={{ background: ACCENT, color: "#000" }}
        >
          <Plus size={14} /> Add Document
        </button>
      </div>

      {flash && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          style={{ background: "rgba(52,211,153,0.1)", color: "#34D399", border: "1px solid rgba(52,211,153,0.2)" }}>
          <Check size={14} /> {flash}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
          <AlertCircle size={14} /> {error}
          <button type="button" onClick={() => setError(null)} className="ml-auto"><X size={12} /></button>
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>New Reference Document</h3>
            <button type="button" onClick={() => setShowAdd(false)}>
              <X size={16} style={{ color: "var(--text-muted)" }} />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. KCSIE 2024"
                  className="rounded-lg px-3 py-2 text-sm border outline-none"
                  style={{ background: "var(--glass-fill)", borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value as PolicyReferenceDoc["category"] }))}
                  className="rounded-lg px-3 py-2 text-sm border outline-none"
                  style={{ background: "var(--glass-fill)", borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
                >
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Source URL (optional)</label>
                <input
                  type="url"
                  value={form.source_url}
                  onChange={e => setForm(f => ({ ...f, source_url: e.target.value }))}
                  placeholder="https://www.gov.uk/…"
                  className="rounded-lg px-3 py-2 text-sm border outline-none"
                  style={{ background: "var(--glass-fill)", borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Short description (optional)</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="e.g. Safeguarding in education, Sept 2024"
                  className="rounded-lg px-3 py-2 text-sm border outline-none"
                  style={{ background: "var(--glass-fill)", borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
                />
              </div>
            </div>

            {/* Upload or paste */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Document content *</label>
                <div className="flex items-center gap-2">
                  <input ref={fileRef} type="file" accept=".docx" className="hidden" onChange={handleFileUpload} />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={extracting}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium"
                    style={{ background: "rgba(167,139,250,0.1)", color: ACCENT }}
                  >
                    {extracting ? <><Loader2 size={11} className="animate-spin" /> Extracting…</> : <><Upload size={11} /> Upload .docx</>}
                  </button>
                </div>
              </div>
              <textarea
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                rows={8}
                placeholder="Paste the full document text here, or upload a .docx above…"
                className="rounded-xl px-4 py-3 text-xs border outline-none resize-y leading-relaxed"
                style={{ background: "var(--glass-fill)", borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
              />
              {form.content && (
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {form.content.split(/\s+/).length.toLocaleString()} words
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setShowAdd(false); setForm({ ...BLANK_FORM }); }}
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !form.title || !form.content}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold disabled:opacity-40"
                style={{ background: ACCENT, color: "#000" }}
              >
                {saving ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : "Save Document"}
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Documents list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin" style={{ color: ACCENT }} />
        </div>
      ) : docs.length === 0 ? (
        <GlassCard>
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <BookOpen size={28} style={{ color: "var(--text-muted)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--text)" }}>No reference documents yet</p>
            <p className="text-xs max-w-sm" style={{ color: "var(--text-muted)" }}>
              Add the full text of KCSIE, ICO guidance, DfE standards, and other authoritative sources. The AI will be grounded exclusively to these documents during policy analysis.
            </p>
          </div>
        </GlassCard>
      ) : (
        <div className="flex flex-col gap-3">
          {docs.map(doc => {
            const cat = catConfig(doc.category);
            const wordCount = doc.content.split(/\s+/).length;
            return (
              <div
                key={doc.id}
                className="rounded-xl border px-4 py-4 flex items-start gap-4 transition-all"
                style={{
                  background: doc.is_active ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.15)",
                  borderColor: doc.is_active ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                  opacity: doc.is_active ? 1 : 0.6,
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}30` }}
                >
                  <FileText size={14} style={{ color: cat.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{doc.title}</span>
                    <span
                      className="text-[0.58rem] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border"
                      style={{ color: cat.color, background: `${cat.color}12`, borderColor: `${cat.color}30` }}
                    >
                      {cat.label}
                    </span>
                    {!doc.is_active && (
                      <span className="text-[0.58rem] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border"
                        style={{ color: "#64748B", background: "rgba(100,116,139,0.1)", borderColor: "rgba(100,116,139,0.2)" }}>
                        Inactive
                      </span>
                    )}
                  </div>
                  {doc.description && (
                    <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{doc.description}</p>
                  )}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {wordCount.toLocaleString()} words
                    </span>
                    {doc.source_url && (
                      <a
                        href={doc.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs"
                        style={{ color: ACCENT }}
                      >
                        <ExternalLink size={10} /> Source
                      </a>
                    )}
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Added {new Date(doc.created_at).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button type="button" onClick={() => toggleActive(doc)} title={doc.is_active ? "Deactivate" : "Activate"}>
                    {doc.is_active
                      ? <ToggleRight size={20} style={{ color: "#34D399" }} />
                      : <ToggleLeft size={20} style={{ color: "#475569" }} />}
                  </button>
                  <button type="button" onClick={() => handleDelete(doc.id)}>
                    <Trash2 size={14} style={{ color: "#EF4444" }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {docs.length > 0 && (
        <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
          {docs.filter(d => d.is_active).length} active document{docs.filter(d => d.is_active).length !== 1 ? "s" : ""} will be included in every policy analysis.
        </p>
      )}
    </div>
  );
}
