"use client";
import { useEffect, useState } from "react";
import { supabase, type TrainingCourse } from "@/lib/supabase";
import GlassCard from "@/components/ui/GlassCard";
import { seedCoursesToSupabase } from "@/lib/training-courses";
import {
  BookOpen,
  Users,
  Award,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  ToggleLeft,
  ToggleRight,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  LayoutList,
} from "lucide-react";
import CourseContentEditor from "@/components/training/CourseContentEditor";
import { SEED_COURSES } from "@/lib/training-courses";

const ACCENT = "#8B5CF6";

const CATEGORY_COLORS: Record<string, string> = {
  Safeguarding: "#34D399",
  "Data Protection": "#3B82F6",
  "AI & Technology": "#F59E0B",
  "Health & Safety": "#F97316",
  Leadership: "#8B5CF6",
  General: "#94A3B8",
  Other: "#94A3B8",
};

const LEVEL_COLORS: Record<string, string> = {
  beginner: "#34D399",
  intermediate: "#F59E0B",
  advanced: "#EF4444",
};

const CATEGORIES = ["Safeguarding", "Data Protection", "AI & Technology", "Health & Safety", "Leadership", "Other"];
const LEVELS = ["beginner", "intermediate", "advanced"] as const;

type LevelType = (typeof LEVELS)[number];

type EnrolmentRow = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  lesson_count: number;
  completed_count: number;
  last_activity: string | null;
};

type CourseForm = {
  title: string;
  description: string;
  category: string;
  level: LevelType;
  duration_minutes: number;
  thumbnail_color: string;
  status: "draft" | "published";
};

const emptyForm = (): CourseForm => ({
  title: "",
  description: "",
  category: "Safeguarding",
  level: "beginner",
  duration_minutes: 30,
  thumbnail_color: ACCENT,
  status: "draft",
});

export default function TrainingAdminTab() {
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [lessonCountMap, setLessonCountMap] = useState<Record<string, number>>({});
  const [enrolmentCountMap, setEnrolmentCountMap] = useState<Record<string, number>>({});
  const [totalEnrolments, setTotalEnrolments] = useState(0);
  const [totalCompletions, setTotalCompletions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Create/Edit modal
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CourseForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  // Delete confirm
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Enrolment panel
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  // Content editor panel
  const [contentEditorCourseId, setContentEditorCourseId] = useState<string | null>(null);
  const [enrolmentRows, setEnrolmentRows] = useState<EnrolmentRow[]>([]);
  const [enrolmentLoading, setEnrolmentLoading] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const { data: courseData } = await supabase
        .from("training_courses")
        .select("*")
        .order("created_at");

      const { data: lessonData } = await supabase
        .from("training_lessons")
        .select("course_id");

      const { data: progressData } = await supabase
        .from("training_progress")
        .select("user_id, course_id, completed");

      const courseList: TrainingCourse[] = courseData ?? [];
      setCourses(courseList);

      // Lesson count per course
      const lMap: Record<string, number> = {};
      for (const row of lessonData ?? []) {
        lMap[row.course_id] = (lMap[row.course_id] ?? 0) + 1;
      }
      setLessonCountMap(lMap);

      // Enrolment count per course (unique users)
      const eMap: Record<string, Set<string>> = {};
      for (const row of progressData ?? []) {
        if (!eMap[row.course_id]) eMap[row.course_id] = new Set();
        eMap[row.course_id].add(row.user_id);
      }
      const eCountMap: Record<string, number> = {};
      for (const [cid, set] of Object.entries(eMap)) {
        eCountMap[cid] = set.size;
      }
      setEnrolmentCountMap(eCountMap);

      // Global stats
      const allUserIds = new Set((progressData ?? []).map((r) => r.user_id));
      setTotalEnrolments(allUserIds.size);

      // Completions: users who have completed at least one lesson in any course
      const completedUserIds = new Set(
        (progressData ?? []).filter((r) => r.completed).map((r) => r.user_id)
      );
      setTotalCompletions(completedUserIds.size);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSeed() {
    setSeeding(true);
    setSeedMsg(null);
    try {
      await seedCoursesToSupabase(supabase);
      setSeedMsg({ type: "success", text: "5 courses loaded successfully" });
      await loadData();
    } catch (e) {
      setSeedMsg({ type: "error", text: e instanceof Error ? e.message : "Seed failed" });
    } finally {
      setSeeding(false);
    }
  }

  async function handleToggleStatus(course: TrainingCourse) {
    const newStatus = course.status === "published" ? "draft" : "published";
    await supabase.from("training_courses").update({ status: newStatus }).eq("id", course.id);
    setCourses((prev) => prev.map((c) => (c.id === course.id ? { ...c, status: newStatus } : c)));
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm());
    setFormError(null);
    setShowTemplates(false);
    setShowForm(true);
  }

  function openEdit(course: TrainingCourse) {
    setEditingId(course.id);
    setForm({
      title: course.title,
      description: course.description ?? "",
      category: course.category,
      level: course.level,
      duration_minutes: course.duration_minutes,
      thumbnail_color: course.thumbnail_color ?? ACCENT,
      status: course.status,
    });
    setFormError(null);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.title.trim()) { setFormError("Title is required."); return; }
    setSaving(true);
    setFormError(null);
    try {
      if (editingId) {
        const { error } = await supabase
          .from("training_courses")
          .update({
            title: form.title.trim(),
            description: form.description.trim() || null,
            category: form.category,
            level: form.level,
            duration_minutes: form.duration_minutes,
            thumbnail_color: form.thumbnail_color,
            status: form.status,
          })
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("training_courses").insert({
          title: form.title.trim(),
          description: form.description.trim() || null,
          category: form.category,
          level: form.level,
          duration_minutes: form.duration_minutes,
          thumbnail_color: form.thumbnail_color,
          status: form.status,
        });
        if (error) throw error;
      }
      setShowForm(false);
      await loadData();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      await supabase.from("training_courses").delete().eq("id", id);
      setDeletingId(null);
      await loadData();
    } finally {
      setDeleting(false);
    }
  }

  async function loadEnrolments(courseId: string) {
    setEnrolmentLoading(true);
    try {
      const { data: progressRows } = await supabase
        .from("training_progress")
        .select("user_id, lesson_id, completed, completed_at")
        .eq("course_id", courseId);

      if (!progressRows || progressRows.length === 0) {
        setEnrolmentRows([]);
        return;
      }

      // Group by user
      const userMap: Record<string, { lesson_count: number; completed_count: number; last_activity: string | null }> = {};
      for (const row of progressRows) {
        if (!userMap[row.user_id]) {
          userMap[row.user_id] = { lesson_count: 0, completed_count: 0, last_activity: null };
        }
        userMap[row.user_id].lesson_count++;
        if (row.completed) userMap[row.user_id].completed_count++;
        if (row.completed_at) {
          const prev = userMap[row.user_id].last_activity;
          if (!prev || row.completed_at > prev) {
            userMap[row.user_id].last_activity = row.completed_at;
          }
        }
      }

      const userIds = Object.keys(userMap);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", userIds);

      const profileMap: Record<string, { email: string | null; full_name: string | null }> = {};
      for (const p of profiles ?? []) {
        profileMap[p.id] = { email: p.email, full_name: p.full_name };
      }

      setEnrolmentRows(
        userIds.map((uid) => ({
          user_id: uid,
          email: profileMap[uid]?.email ?? null,
          full_name: profileMap[uid]?.full_name ?? null,
          ...userMap[uid],
        }))
      );
    } finally {
      setEnrolmentLoading(false);
    }
  }

  function toggleEnrolments(courseId: string) {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
    } else {
      setExpandedCourseId(courseId);
      loadEnrolments(courseId);
    }
  }

  const publishedCount = courses.filter((c) => c.status === "published").length;

  if (loading) {
    return (
      <GlassCard className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 size={28} className="animate-spin" style={{ color: ACCENT }} />
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading training module…</p>
      </GlassCard>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(139,92,246,0.12)" }}>
              <BookOpen size={16} style={{ color: ACCENT }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>{courses.length}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Total Courses</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(52,211,153,0.12)" }}>
              <Eye size={16} className="text-[#34D399]" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>{publishedCount}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Published</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(59,130,246,0.12)" }}>
              <Users size={16} className="text-[#3B82F6]" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>{totalEnrolments}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Enrolments</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.12)" }}>
              <Award size={16} className="text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>{totalCompletions}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Completions</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Header row: title + actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-base font-semibold" style={{ color: "var(--text)" }}>Course Management</h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Manage training courses, control visibility, and track learner progress.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {courses.length === 0 && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border"
              style={{
                background: "rgba(139,92,246,0.12)",
                borderColor: "rgba(139,92,246,0.3)",
                color: ACCENT,
                opacity: seeding ? 0.7 : 1,
              }}
            >
              {seeding ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              Load Pre-Built Courses
            </button>
          )}
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border glass hover:bg-white/5"
            style={{ borderColor: "rgba(255,255,255,0.08)", color: "var(--text-muted)" }}
          >
            <Plus size={14} />
            New Course
          </button>
        </div>
      </div>

      {/* Seed status message */}
      {seedMsg && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm border"
          style={{
            background: seedMsg.type === "success" ? "rgba(52,211,153,0.08)" : "rgba(239,68,68,0.08)",
            borderColor: seedMsg.type === "success" ? "rgba(52,211,153,0.2)" : "rgba(239,68,68,0.2)",
            color: seedMsg.type === "success" ? "#34D399" : "#EF4444",
          }}
        >
          {seedMsg.type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
          {seedMsg.text}
          <button onClick={() => setSeedMsg(null)} className="ml-auto opacity-60 hover:opacity-100">
            <X size={13} />
          </button>
        </div>
      )}

      {/* Course Table */}
      <GlassCard className="p-0 overflow-hidden">
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(139,92,246,0.1)" }}
            >
              <BookOpen size={20} style={{ color: ACCENT }} />
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>No courses yet</p>
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>
              Load the pre-built courses or create a new one to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                    Course
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                    Category
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                    Level
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                    Lessons
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                    Status
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                    Enrolments
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                    Content
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => {
                  const catColor = CATEGORY_COLORS[course.category] ?? "#94A3B8";
                  const lvlColor = LEVEL_COLORS[course.level] ?? "#94A3B8";
                  const lessonCount = lessonCountMap[course.id] ?? 0;
                  const enrolCount = enrolmentCountMap[course.id] ?? 0;
                  const isExpanded = expandedCourseId === course.id;

                  return (
                    <>
                      <tr
                        key={course.id}
                        className="border-b transition-colors hover:bg-white/[0.015]"
                        style={{ borderColor: "rgba(255,255,255,0.04)" }}
                      >
                        {/* Title */}
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg shrink-0"
                              style={{ background: course.thumbnail_color ?? ACCENT, opacity: 0.85 }}
                            />
                            <div>
                              <p className="font-medium text-xs" style={{ color: "var(--text)" }}>
                                {course.title}
                              </p>
                              {course.description && (
                                <p
                                  className="text-[0.65rem] mt-0.5 max-w-xs truncate"
                                  style={{ color: "var(--text-faint)" }}
                                >
                                  {course.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[0.65rem] font-semibold"
                            style={{ background: `${catColor}18`, color: catColor }}
                          >
                            {course.category}
                          </span>
                        </td>

                        {/* Level */}
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[0.65rem] font-semibold capitalize"
                            style={{ background: `${lvlColor}18`, color: lvlColor }}
                          >
                            {course.level}
                          </span>
                        </td>

                        {/* Lessons */}
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                            {lessonCount}
                          </span>
                        </td>

                        {/* Status toggle */}
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleToggleStatus(course)}
                            className="flex items-center gap-1.5 mx-auto transition-all"
                            title={course.status === "published" ? "Click to unpublish" : "Click to publish"}
                          >
                            {course.status === "published" ? (
                              <>
                                <ToggleRight size={18} className="text-[#34D399]" />
                                <span className="text-[0.65rem] text-[#34D399] font-medium">Published</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft size={18} className="text-[#475569]" />
                                <span className="text-[0.65rem] text-[#475569] font-medium">Draft</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Enrolments */}
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggleEnrolments(course.id)}
                            className="flex items-center gap-1 mx-auto transition-all hover:opacity-70"
                            title="View enrolments"
                          >
                            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                              {enrolCount}
                            </span>
                            <BarChart3 size={12} style={{ color: "var(--text-dim)" }} />
                            {isExpanded ? (
                              <ChevronUp size={11} style={{ color: "var(--text-dim)" }} />
                            ) : (
                              <ChevronDown size={11} style={{ color: "var(--text-dim)" }} />
                            )}
                          </button>
                        </td>

                        {/* Content editor toggle */}
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setContentEditorCourseId(contentEditorCourseId === course.id ? null : course.id)}
                            className="flex items-center gap-1 mx-auto transition-all hover:opacity-70"
                            title="Manage course content"
                          >
                            <LayoutList size={13} style={{ color: contentEditorCourseId === course.id ? "#8B5CF6" : "var(--text-dim)" }} />
                            <span className="text-[0.65rem] font-medium" style={{ color: contentEditorCourseId === course.id ? "#8B5CF6" : "var(--text-dim)" }}>
                              Edit
                            </span>
                            {contentEditorCourseId === course.id
                              ? <ChevronUp size={11} style={{ color: "#8B5CF6" }} />
                              : <ChevronDown size={11} style={{ color: "var(--text-dim)" }} />}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEdit(course)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center glass hover:bg-white/10 transition-all"
                              title="Edit course"
                            >
                              <Edit2 size={12} style={{ color: "var(--text-muted)" }} />
                            </button>
                            <button
                              onClick={() => setDeletingId(course.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center glass hover:bg-red-500/10 transition-all"
                              title="Delete course"
                            >
                              <Trash2 size={12} className="text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Content editor expansion panel */}
                      {contentEditorCourseId === course.id && (
                        <tr key={`${course.id}-content`} style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                          <td colSpan={8} className="bg-white/[0.01]" style={{ borderBottom: "1px solid rgba(139,92,246,0.15)" }}>
                            <div className="px-2 py-1">
                              <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                                <LayoutList size={13} style={{ color: "#8B5CF6" }} />
                                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8B5CF6" }}>
                                  Course Content — {course.title}
                                </span>
                              </div>
                              <CourseContentEditor courseId={course.id} />
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* Enrolment expansion panel */}
                      {isExpanded && (
                        <tr key={`${course.id}-enrol`} style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                          <td colSpan={8} className="px-5 py-4 bg-white/[0.015]">
                            {enrolmentLoading ? (
                              <div className="flex items-center gap-2 py-2">
                                <Loader2 size={14} className="animate-spin" style={{ color: ACCENT }} />
                                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Loading enrolments…</span>
                              </div>
                            ) : enrolmentRows.length === 0 ? (
                              <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                                No learners have started this course yet.
                              </p>
                            ) : (
                              <div className="flex flex-col gap-1.5">
                                <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
                                  Learner Progress · {enrolmentRows.length} enrolled
                                </p>
                                {enrolmentRows.map((row) => {
                                  const pct = row.lesson_count > 0 ? Math.round((row.completed_count / row.lesson_count) * 100) : 0;
                                  return (
                                    <div
                                      key={row.user_id}
                                      className="flex items-center justify-between gap-4 px-3 py-2 rounded-xl bg-white/[0.02] border"
                                      style={{ borderColor: "rgba(255,255,255,0.05)" }}
                                    >
                                      <div>
                                        <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                                          {row.full_name ?? row.email ?? row.user_id.slice(0, 8)}
                                        </p>
                                        {row.last_activity && (
                                          <p className="text-[0.65rem]" style={{ color: "var(--text-faint)" }}>
                                            Last activity: {new Date(row.last_activity).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                          </p>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-3 shrink-0">
                                        <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                          <div
                                            className="h-full rounded-full transition-all"
                                            style={{ width: `${pct}%`, background: ACCENT }}
                                          />
                                        </div>
                                        <span className="text-xs font-semibold w-8 text-right" style={{ color: ACCENT }}>
                                          {pct}%
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-2xl p-6 w-full max-w-lg border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-base" style={{ color: "var(--text)" }}>
                {editingId ? "Edit Course" : "New Course"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <X size={14} style={{ color: "var(--text-muted)" }} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Template selector — only on new course */}
              {!editingId && (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowTemplates((v) => !v)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", color: "#8B5CF6" }}
                  >
                    <span className="flex items-center gap-2"><Sparkles size={14} /> Start from a pre-built template</span>
                    {showTemplates ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {showTemplates && (
                    <div className="mt-2 flex flex-col gap-1.5">
                      {SEED_COURSES.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setForm({
                              title: t.title,
                              description: t.description,
                              category: t.category,
                              level: t.level,
                              duration_minutes: t.duration_minutes,
                              thumbnail_color: t.thumbnail_color,
                              status: "draft",
                            });
                            setShowTemplates(false);
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all hover:bg-white/5"
                          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ background: t.thumbnail_color }} />
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate" style={{ color: "var(--text)" }}>{t.title}</p>
                            <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>{t.category} · {t.level}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Safeguarding Essentials"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 border outline-none focus:border-[rgba(139,92,246,0.5)] transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  placeholder="Brief description of the course…"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 border outline-none focus:border-[rgba(139,92,246,0.5)] transition-colors resize-none"
                  style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
                />
              </div>

              {/* Category + Level */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 border outline-none focus:border-[rgba(139,92,246,0.5)] transition-colors"
                    style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                    Level
                  </label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm((f) => ({ ...f, level: e.target.value as LevelType }))}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 border outline-none focus:border-[rgba(139,92,246,0.5)] transition-colors"
                    style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
                  >
                    {LEVELS.map((l) => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              {/* Duration + Colour */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={480}
                    value={form.duration_minutes}
                    onChange={(e) => setForm((f) => ({ ...f, duration_minutes: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-white/5 border outline-none focus:border-[rgba(139,92,246,0.5)] transition-colors"
                    style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                    Thumbnail Colour
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.thumbnail_color}
                      onChange={(e) => setForm((f) => ({ ...f, thumbnail_color: e.target.value }))}
                      className="w-9 h-9 rounded-lg border cursor-pointer"
                      style={{ borderColor: "rgba(255,255,255,0.1)", background: "transparent" }}
                    />
                    <input
                      type="text"
                      value={form.thumbnail_color}
                      onChange={(e) => setForm((f) => ({ ...f, thumbnail_color: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-xl text-sm bg-white/5 border outline-none focus:border-[rgba(139,92,246,0.5)] transition-colors"
                      style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
                  Status
                </label>
                <div className="flex gap-3">
                  {(["draft", "published"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, status: s }))}
                      className="flex-1 py-2 rounded-xl text-sm font-medium border transition-all capitalize"
                      style={
                        form.status === s
                          ? { background: "rgba(139,92,246,0.15)", borderColor: "rgba(139,92,246,0.4)", color: ACCENT }
                          : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", color: "var(--text-dim)" }
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {formError && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs bg-red-500/10 border border-red-500/20 text-red-400">
                  <AlertCircle size={13} />
                  {formError}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 rounded-xl text-sm font-medium border glass hover:bg-white/5 transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.08)", color: "var(--text-muted)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-2"
                  style={{
                    background: "rgba(139,92,246,0.15)",
                    borderColor: "rgba(139,92,246,0.35)",
                    color: ACCENT,
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving && <Loader2 size={13} className="animate-spin" />}
                  {editingId ? "Save Changes" : "Create Course"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-2xl p-6 w-full max-w-sm border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-500/10">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1" style={{ color: "var(--text)" }}>Delete Course?</h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  This will permanently delete the course and all its sections, lessons, and quiz data. Learner progress for this course will also be removed.
                </p>
              </div>
              <div className="flex gap-3 w-full pt-1">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 py-2 rounded-xl text-sm font-medium border glass hover:bg-white/5 transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.08)", color: "var(--text-muted)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deletingId)}
                  disabled={deleting}
                  className="flex-1 py-2 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-2 bg-red-500/10 border-red-500/30 text-red-400"
                  style={{ opacity: deleting ? 0.7 : 1 }}
                >
                  {deleting && <Loader2 size={13} className="animate-spin" />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
