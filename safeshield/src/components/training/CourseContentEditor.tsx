"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase, type TrainingSection, type TrainingLesson, type TrainingQuiz } from "@/lib/supabase";
import GlassCard from "@/components/ui/GlassCard";
import {
  Plus, Trash2, ChevronDown, ChevronUp, BookOpen, HelpCircle,
  Loader2, CheckCircle2, GripVertical, Edit2, X, Save,
} from "lucide-react";

type Props = { courseId: string };

type LessonWithQuiz = TrainingLesson & { quizzes: TrainingQuiz[] };
type SectionWithLessons = TrainingSection & { lessons: LessonWithQuiz[] };

const INPUT_CLS =
  "w-full px-3 py-2 rounded-xl text-sm bg-white/5 border outline-none focus:border-[rgba(139,92,246,0.5)] transition-colors";
const INPUT_STYLE = { borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" };
const BTN_PURPLE =
  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all";
const BTN_PURPLE_STYLE = {
  background: "rgba(139,92,246,0.12)",
  border: "1px solid rgba(139,92,246,0.25)",
  color: "#8B5CF6",
};

export default function CourseContentEditor({ courseId }: Props) {
  const [sections, setSections] = useState<SectionWithLessons[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Which sections are open
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  // Which lessons have quiz editor open
  const [openQuiz, setOpenQuiz] = useState<Set<string>>(new Set());

  // Inline-edit state
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState("");
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [editingLessonData, setEditingLessonData] = useState<Partial<TrainingLesson>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const { data: secs } = await supabase
      .from("training_sections").select("*").eq("course_id", courseId).order("sort_order");
    const { data: lessons } = await supabase
      .from("training_lessons").select("*").eq("course_id", courseId).order("sort_order");
    const { data: quizzes } = await supabase
      .from("training_quizzes").select("*").order("sort_order");

    const lessonMap: Record<string, LessonWithQuiz> = {};
    for (const l of lessons ?? []) {
      lessonMap[l.id] = { ...l, quizzes: [] };
    }
    for (const q of quizzes ?? []) {
      if (lessonMap[q.lesson_id]) lessonMap[q.lesson_id].quizzes.push(q);
    }

    const built: SectionWithLessons[] = (secs ?? []).map((s) => ({
      ...s,
      lessons: (lessons ?? []).filter((l) => l.section_id === s.id).map((l) => lessonMap[l.id]),
    }));
    setSections(built);
    if (built.length > 0) setOpenSections(new Set(built.map((s) => s.id)));
    setLoading(false);
  }, [courseId]);

  useEffect(() => { load(); }, [load]);

  function flash(type: "ok" | "err", text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  }

  // ── Sections ───────────────────────────────────────────────────────────────
  async function addSection() {
    setSaving(true);
    const { data, error } = await supabase
      .from("training_sections")
      .insert({ course_id: courseId, title: "New Section", sort_order: sections.length })
      .select("*").single();
    if (error) { flash("err", error.message); setSaving(false); return; }
    setSections((prev) => [...prev, { ...data, lessons: [] }]);
    setOpenSections((prev) => new Set([...prev, data.id]));
    setEditingSection(data.id);
    setEditingSectionTitle(data.title);
    setSaving(false);
  }

  async function saveSectionTitle(id: string) {
    if (!editingSectionTitle.trim()) return;
    await supabase.from("training_sections").update({ title: editingSectionTitle.trim() }).eq("id", id);
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, title: editingSectionTitle.trim() } : s));
    setEditingSection(null);
    flash("ok", "Section saved");
  }

  async function deleteSection(id: string) {
    if (!confirm("Delete this section and all its lessons?")) return;
    await supabase.from("training_sections").delete().eq("id", id);
    setSections((prev) => prev.filter((s) => s.id !== id));
    flash("ok", "Section deleted");
  }

  // ── Lessons ────────────────────────────────────────────────────────────────
  async function addLesson(sectionId: string) {
    const section = sections.find((s) => s.id === sectionId);
    const sortOrder = section ? section.lessons.length : 0;
    setSaving(true);
    const { data, error } = await supabase
      .from("training_lessons")
      .insert({
        course_id: courseId,
        section_id: sectionId,
        title: "New Lesson",
        content: "",
        duration_minutes: 5,
        has_quiz: false,
        sort_order: sortOrder,
      })
      .select("*").single();
    if (error) { flash("err", error.message); setSaving(false); return; }
    const newLesson: LessonWithQuiz = { ...data, quizzes: [] };
    setSections((prev) => prev.map((s) =>
      s.id === sectionId ? { ...s, lessons: [...s.lessons, newLesson] } : s
    ));
    setEditingLesson(data.id);
    setEditingLessonData({ title: data.title, content: data.content ?? "", duration_minutes: data.duration_minutes, has_quiz: data.has_quiz });
    setSaving(false);
  }

  async function saveLessonEdit(lessonId: string, sectionId: string) {
    if (!editingLessonData.title?.trim()) return;
    const { error } = await supabase.from("training_lessons").update({
      title: editingLessonData.title?.trim(),
      content: editingLessonData.content ?? "",
      duration_minutes: editingLessonData.duration_minutes ?? 5,
      has_quiz: editingLessonData.has_quiz ?? false,
    }).eq("id", lessonId);
    if (error) { flash("err", error.message); return; }
    setSections((prev) => prev.map((s) =>
      s.id === sectionId ? {
        ...s,
        lessons: s.lessons.map((l) =>
          l.id === lessonId ? { ...l, ...editingLessonData, title: editingLessonData.title!.trim() } : l
        ),
      } : s
    ));
    setEditingLesson(null);
    flash("ok", "Lesson saved");
  }

  async function deleteLesson(lessonId: string, sectionId: string) {
    if (!confirm("Delete this lesson?")) return;
    await supabase.from("training_lessons").delete().eq("id", lessonId);
    setSections((prev) => prev.map((s) =>
      s.id === sectionId ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) } : s
    ));
    flash("ok", "Lesson deleted");
  }

  // ── Quiz questions ─────────────────────────────────────────────────────────
  async function addQuizQuestion(lessonId: string, sectionId: string) {
    const lesson = sections.flatMap((s) => s.lessons).find((l) => l.id === lessonId);
    const sortOrder = lesson ? lesson.quizzes.length : 0;
    const { data, error } = await supabase
      .from("training_quizzes")
      .insert({
        lesson_id: lessonId,
        question: "New question?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct_answer: 0,
        explanation: "",
        sort_order: sortOrder,
      })
      .select("*").single();
    if (error) { flash("err", error.message); return; }
    setSections((prev) => prev.map((s) =>
      s.id === sectionId ? {
        ...s,
        lessons: s.lessons.map((l) =>
          l.id === lessonId ? { ...l, quizzes: [...l.quizzes, data] } : l
        ),
      } : s
    ));
  }

  async function updateQuiz(quizId: string, lessonId: string, sectionId: string, patch: Partial<TrainingQuiz>) {
    await supabase.from("training_quizzes").update(patch).eq("id", quizId);
    setSections((prev) => prev.map((s) =>
      s.id === sectionId ? {
        ...s,
        lessons: s.lessons.map((l) =>
          l.id === lessonId ? {
            ...l,
            quizzes: l.quizzes.map((q) => q.id === quizId ? { ...q, ...patch } : q),
          } : l
        ),
      } : s
    ));
  }

  async function deleteQuiz(quizId: string, lessonId: string, sectionId: string) {
    await supabase.from("training_quizzes").delete().eq("id", quizId);
    setSections((prev) => prev.map((s) =>
      s.id === sectionId ? {
        ...s,
        lessons: s.lessons.map((l) =>
          l.id === lessonId ? { ...l, quizzes: l.quizzes.filter((q) => q.id !== quizId) } : l
        ),
      } : s
    ));
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center gap-2 py-6 px-4">
      <Loader2 size={16} className="animate-spin text-[#8B5CF6]" />
      <span className="text-sm" style={{ color: "var(--text-muted)" }}>Loading content…</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Flash message */}
      {msg && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${msg.type === "ok" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
          {msg.type === "ok" ? <CheckCircle2 size={12} /> : <X size={12} />}{msg.text}
        </div>
      )}

      {/* Sections */}
      {sections.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <BookOpen size={28} className="text-[#8B5CF6] opacity-40" />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No sections yet. Add your first section below.</p>
        </div>
      ) : (
        sections.map((section, sIdx) => {
          const isOpen = openSections.has(section.id);
          return (
            <GlassCard key={section.id} className="p-0 overflow-hidden">
              {/* Section header */}
              <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: isOpen ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <GripVertical size={14} style={{ color: "var(--text-faint)" }} className="shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded" style={{ background: "rgba(139,92,246,0.15)", color: "#8B5CF6" }}>
                  Section {sIdx + 1}
                </span>

                {editingSection === section.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      autoFocus
                      value={editingSectionTitle}
                      onChange={(e) => setEditingSectionTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveSectionTitle(section.id)}
                      className={`flex-1 ${INPUT_CLS}`}
                      style={INPUT_STYLE}
                    />
                    <button onClick={() => saveSectionTitle(section.id)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-green-500/10 border border-green-500/20">
                      <Save size={12} className="text-green-400" />
                    </button>
                    <button onClick={() => setEditingSection(null)} className="w-7 h-7 rounded-lg flex items-center justify-center glass">
                      <X size={12} style={{ color: "var(--text-dim)" }} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-semibold cursor-pointer" style={{ color: "var(--text)" }}
                      onClick={() => setOpenSections((prev) => { const n = new Set(prev); isOpen ? n.delete(section.id) : n.add(section.id); return n; })}>
                      {section.title}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-faint)" }}>{section.lessons.length} lesson{section.lessons.length !== 1 ? "s" : ""}</span>
                    <button onClick={() => { setEditingSection(section.id); setEditingSectionTitle(section.title); }} className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 transition-all">
                      <Edit2 size={11} style={{ color: "var(--text-dim)" }} />
                    </button>
                    <button onClick={() => deleteSection(section.id)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-red-500/10 transition-all">
                      <Trash2 size={11} className="text-red-400" />
                    </button>
                    <button onClick={() => setOpenSections((prev) => { const n = new Set(prev); isOpen ? n.delete(section.id) : n.add(section.id); return n; })} className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 transition-all">
                      {isOpen ? <ChevronUp size={13} style={{ color: "var(--text-dim)" }} /> : <ChevronDown size={13} style={{ color: "var(--text-dim)" }} />}
                    </button>
                  </>
                )}
              </div>

              {/* Lessons */}
              {isOpen && (
                <div className="flex flex-col divide-y divide-white/5">
                  {section.lessons.map((lesson, lIdx) => {
                    const isEditingThis = editingLesson === lesson.id;
                    const quizOpen = openQuiz.has(lesson.id);
                    return (
                      <div key={lesson.id} className="px-4 py-3">
                        {isEditingThis ? (
                          /* ── Lesson edit form ── */
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8B5CF6" }}>Editing Lesson {lIdx + 1}</span>
                              <button onClick={() => setEditingLesson(null)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 transition-all">
                                <X size={12} style={{ color: "var(--text-dim)" }} />
                              </button>
                            </div>
                            <input
                              autoFocus
                              placeholder="Lesson title"
                              value={editingLessonData.title ?? ""}
                              onChange={(e) => setEditingLessonData((p) => ({ ...p, title: e.target.value }))}
                              className={INPUT_CLS}
                              style={INPUT_STYLE}
                            />
                            <textarea
                              rows={8}
                              placeholder="Lesson content (paste your text here — use blank lines to separate paragraphs)…"
                              value={editingLessonData.content ?? ""}
                              onChange={(e) => setEditingLessonData((p) => ({ ...p, content: e.target.value }))}
                              className={`${INPUT_CLS} resize-y min-h-[160px]`}
                              style={INPUT_STYLE}
                            />
                            <div className="flex items-center gap-4">
                              <div className="flex-1">
                                <label className="block text-xs mb-1" style={{ color: "var(--text-muted)" }}>Duration (minutes)</label>
                                <input
                                  type="number" min={1} max={120}
                                  value={editingLessonData.duration_minutes ?? 5}
                                  onChange={(e) => setEditingLessonData((p) => ({ ...p, duration_minutes: Number(e.target.value) }))}
                                  className={INPUT_CLS}
                                  style={INPUT_STYLE}
                                />
                              </div>
                              <div className="flex items-center gap-2 mt-4">
                                <button
                                  type="button"
                                  onClick={() => setEditingLessonData((p) => ({ ...p, has_quiz: !p.has_quiz }))}
                                  className={`relative w-9 h-5 rounded-full transition-all ${editingLessonData.has_quiz ? "bg-[#8B5CF6]" : "bg-white/10"}`}
                                >
                                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${editingLessonData.has_quiz ? "left-4" : "left-0.5"}`} />
                                </button>
                                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Has quiz</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => saveLessonEdit(lesson.id, section.id)} className={`${BTN_PURPLE} flex-1 justify-center`} style={BTN_PURPLE_STYLE}>
                                <Save size={12} /> Save Lesson
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* ── Lesson display row ── */
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center shrink-0" style={{ background: "rgba(139,92,246,0.15)", color: "#8B5CF6" }}>{lIdx + 1}</span>
                              <span className="flex-1 text-sm font-medium" style={{ color: "var(--text)" }}>{lesson.title}</span>
                              <span className="text-xs" style={{ color: "var(--text-faint)" }}>{lesson.duration_minutes}m</span>
                              {lesson.has_quiz && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>
                                  Quiz · {lesson.quizzes.length}Q
                                </span>
                              )}
                              <button onClick={() => { setEditingLesson(lesson.id); setEditingLessonData({ title: lesson.title, content: lesson.content ?? "", duration_minutes: lesson.duration_minutes, has_quiz: lesson.has_quiz }); }}
                                className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 transition-all">
                                <Edit2 size={11} style={{ color: "var(--text-dim)" }} />
                              </button>
                              <button onClick={() => deleteLesson(lesson.id, section.id)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-red-500/10 transition-all">
                                <Trash2 size={11} className="text-red-400" />
                              </button>
                            </div>

                            {/* Content preview */}
                            {lesson.content && (
                              <p className="text-xs leading-relaxed line-clamp-2 ml-7" style={{ color: "var(--text-faint)" }}>{lesson.content}</p>
                            )}

                            {/* Quiz editor toggle */}
                            {lesson.has_quiz && (
                              <div className="ml-7">
                                <button
                                  onClick={() => setOpenQuiz((prev) => { const n = new Set(prev); quizOpen ? n.delete(lesson.id) : n.add(lesson.id); return n; })}
                                  className="flex items-center gap-1.5 text-xs mb-2 hover:opacity-70 transition-all"
                                  style={{ color: "#F59E0B" }}
                                >
                                  <HelpCircle size={12} />
                                  {quizOpen ? "Hide" : "Edit"} quiz questions ({lesson.quizzes.length})
                                  {quizOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                </button>

                                {quizOpen && (
                                  <div className="flex flex-col gap-3 pl-2 border-l-2" style={{ borderColor: "rgba(245,158,11,0.3)" }}>
                                    {lesson.quizzes.map((q, qIdx) => (
                                      <div key={q.id} className="flex flex-col gap-2 p-3 rounded-xl" style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)" }}>
                                        <div className="flex items-center justify-between">
                                          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#F59E0B" }}>Q{qIdx + 1}</span>
                                          <button onClick={() => deleteQuiz(q.id, lesson.id, section.id)} className="w-5 h-5 rounded flex items-center justify-center hover:bg-red-500/10">
                                            <Trash2 size={10} className="text-red-400" />
                                          </button>
                                        </div>
                                        <input
                                          placeholder="Question text"
                                          value={q.question}
                                          onChange={(e) => updateQuiz(q.id, lesson.id, section.id, { question: e.target.value })}
                                          className={INPUT_CLS}
                                          style={INPUT_STYLE}
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                          {(q.options as string[]).map((opt, oIdx) => (
                                            <div key={oIdx} className="flex items-center gap-1.5">
                                              <button
                                                type="button"
                                                onClick={() => updateQuiz(q.id, lesson.id, section.id, { correct_answer: oIdx })}
                                                className={`w-4 h-4 rounded-full border-2 shrink-0 transition-all ${q.correct_answer === oIdx ? "border-green-400 bg-green-400" : "border-white/20"}`}
                                                title="Mark as correct answer"
                                              />
                                              <input
                                                placeholder={`Option ${oIdx + 1}`}
                                                value={opt}
                                                onChange={(e) => {
                                                  const newOpts = [...(q.options as string[])];
                                                  newOpts[oIdx] = e.target.value;
                                                  updateQuiz(q.id, lesson.id, section.id, { options: newOpts });
                                                }}
                                                className="flex-1 px-2 py-1.5 rounded-lg text-xs bg-white/5 border outline-none focus:border-[rgba(139,92,246,0.4)] transition-colors"
                                                style={{ borderColor: q.correct_answer === oIdx ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)", color: "var(--text)" }}
                                              />
                                            </div>
                                          ))}
                                        </div>
                                        <input
                                          placeholder="Explanation (shown after answer)"
                                          value={q.explanation ?? ""}
                                          onChange={(e) => updateQuiz(q.id, lesson.id, section.id, { explanation: e.target.value })}
                                          className={INPUT_CLS}
                                          style={INPUT_STYLE}
                                        />
                                      </div>
                                    ))}
                                    <button onClick={() => addQuizQuestion(lesson.id, section.id)} className={BTN_PURPLE} style={BTN_PURPLE_STYLE}>
                                      <Plus size={11} /> Add Question
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Add lesson button */}
                  <div className="px-4 py-2.5">
                    <button onClick={() => addLesson(section.id)} className={BTN_PURPLE} style={BTN_PURPLE_STYLE} disabled={saving}>
                      <Plus size={11} /> Add Lesson
                    </button>
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })
      )}

      {/* Add section button */}
      <button
        onClick={addSection}
        disabled={saving}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-all"
        style={{ background: "rgba(139,92,246,0.08)", border: "1px dashed rgba(139,92,246,0.3)", color: "#8B5CF6" }}
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
        Add Section
      </button>
    </div>
  );
}
