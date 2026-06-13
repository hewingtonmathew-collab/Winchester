"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGuard from "@/components/ui/AuthGuard";
import GlassCard from "@/components/ui/GlassCard";
import {
  supabase,
  type TrainingCourse,
  type TrainingSection,
  type TrainingLesson,
  type TrainingProgress,
} from "@/lib/supabase";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Play,
  Award,
  ArrowLeft,
  Loader2,
  Lock,
} from "lucide-react";
import Link from "next/link";

const ACCENT = "#8B5CF6";

const LEVEL_COLORS: Record<string, string> = {
  beginner: "#22c55e",
  intermediate: "#f59e0b",
  advanced: "#ef4444",
};

function CircularProgress({ percent, accent }: { percent: number; accent: string }) {
  const r = 45;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width={110} height={110} viewBox="0 0 110 110" className="block mx-auto">
      <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
      <circle
        cx="55"
        cy="55"
        r={r}
        fill="none"
        stroke={accent}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        transform="rotate(-90 55 55)"
        style={{ transition: "stroke-dasharray 0.8s cubic-bezier(.4,0,.2,1)" }}
      />
      <text x="55" y="55" textAnchor="middle" dominantBaseline="middle" fill={accent} fontSize="18" fontWeight="bold">
        {Math.round(percent)}%
      </text>
    </svg>
  );
}

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<TrainingCourse | null>(null);
  const [sections, setSections] = useState<TrainingSection[]>([]);
  const [lessons, setLessons] = useState<TrainingLesson[]>([]);
  const [progress, setProgress] = useState<TrainingProgress[]>([]);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [{ data: courseData }, { data: sectionsData }, { data: lessonsData }] =
          await Promise.all([
            supabase.from("training_courses").select("*").eq("id", courseId).single(),
            supabase.from("training_sections").select("*").eq("course_id", courseId).order("sort_order"),
            supabase.from("training_lessons").select("*").eq("course_id", courseId).order("sort_order"),
          ]);

        setCourse(courseData ?? null);
        const sects = sectionsData ?? [];
        setSections(sects);
        setLessons(lessonsData ?? []);
        setOpenSections(new Set(sects.map((s: TrainingSection) => s.id)));

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: prog } = await supabase
            .from("training_progress")
            .select("*")
            .eq("user_id", user.id)
            .eq("course_id", courseId);
          setProgress(prog ?? []);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  const totalLessons = lessons.length;
  const completedLessons = progress.filter((p) => p.completed).length;
  const percent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const isCourseComplete = totalLessons > 0 && completedLessons >= totalLessons;

  function isLessonCompleted(lessonId: string) {
    return progress.some((p) => p.lesson_id === lessonId && p.completed);
  }

  function getFirstIncompleteLesson(): TrainingLesson | undefined {
    return lessons.find((l) => !isLessonCompleted(l.id));
  }

  function handleStartContinue() {
    const target = isCourseComplete ? lessons[0] : getFirstIncompleteLesson() ?? lessons[0];
    if (target) {
      router.push(`/tools/training/${courseId}/lesson/${target.id}`);
    }
  }

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  if (loading) {
    return (
      <AuthGuard toolSlug="training">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={28} className="animate-spin" style={{ color: ACCENT }} />
        </div>
      </AuthGuard>
    );
  }

  if (!course) {
    return (
      <AuthGuard toolSlug="training">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
          <BookOpen size={48} className="mx-auto mb-4 opacity-30" style={{ color: ACCENT }} />
          <p style={{ color: "var(--text-muted)" }}>Course not found.</p>
        </div>
      </AuthGuard>
    );
  }

  const accentColor = course.thumbnail_color ?? ACCENT;
  const levelColor = LEVEL_COLORS[course.level] ?? ACCENT;

  return (
    <AuthGuard toolSlug="training">
      <div className="min-h-[100dvh] pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Back link */}
          <Link
            href="/tools/training"
            className="inline-flex items-center gap-1.5 text-xs mb-6 transition-opacity hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={13} />
            Back to Training
          </Link>

          {/* Course hero */}
          <GlassCard className="mb-6 overflow-hidden p-0">
            <div className="h-1.5 w-full" style={{ background: accentColor }} />
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: `${accentColor}18`, color: accentColor }}
                >
                  {course.category}
                </span>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: `${levelColor}18`, color: levelColor }}
                >
                  {course.level}
                </span>
              </div>
              <h1 className="heading-luxury text-2xl sm:text-3xl mb-3" style={{ color: "var(--text)" }}>
                {course.title}
              </h1>
              {course.description && (
                <p className="text-sm leading-relaxed mb-4 max-w-2xl" style={{ color: "var(--text-muted)" }}>
                  {course.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} /> {course.duration_minutes} min
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen size={12} /> {totalLessons} lessons
                </span>
                <span className="flex items-center gap-1.5" style={{ color: levelColor }}>
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* 2-col layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left: Sections */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              {sections.length === 0 ? (
                <GlassCard className="text-center py-12">
                  <BookOpen size={36} className="mx-auto mb-3 opacity-30" style={{ color: ACCENT }} />
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    No sections available yet.
                  </p>
                </GlassCard>
              ) : (
                sections.map((section) => {
                  const sectionLessons = lessons.filter((l) => l.section_id === section.id);
                  const isOpen = openSections.has(section.id);
                  return (
                    <GlassCard key={section.id} className="p-0 overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-4 text-left transition-colors"
                        style={{ color: "var(--text)" }}
                      >
                        <div>
                          <span className="text-sm font-semibold">{section.title}</span>
                          <span className="ml-2 text-xs" style={{ color: "var(--text-muted)" }}>
                            {sectionLessons.length} lessons
                          </span>
                        </div>
                        <span
                          className="text-xs transition-transform"
                          style={{
                            color: "var(--text-muted)",
                            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                          }}
                        >
                          ▶
                        </span>
                      </button>
                      {isOpen && sectionLessons.length > 0 && (
                        <div className="border-t" style={{ borderColor: "var(--glass-border)" }}>
                          {sectionLessons.map((lesson, idx) => {
                            const done = isLessonCompleted(lesson.id);
                            const firstIncomplete = getFirstIncompleteLesson();
                            const isCurrent = firstIncomplete?.id === lesson.id;
                            return (
                              <Link
                                key={lesson.id}
                                href={`/tools/training/${courseId}/lesson/${lesson.id}`}
                                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/5"
                                style={{
                                  borderTop: idx > 0 ? "1px solid var(--glass-border)" : undefined,
                                  background: isCurrent ? `${accentColor}08` : undefined,
                                }}
                              >
                                {done ? (
                                  <CheckCircle2 size={16} style={{ color: "#22c55e", flexShrink: 0 }} />
                                ) : (
                                  <Play size={16} style={{ color: isCurrent ? accentColor : "var(--text-muted)", flexShrink: 0 }} />
                                )}
                                <div className="flex-1 min-w-0">
                                  <span
                                    className="text-xs font-medium block truncate"
                                    style={{ color: done ? "#22c55e" : isCurrent ? accentColor : "var(--text)" }}
                                  >
                                    {lesson.title}
                                  </span>
                                </div>
                                <span className="text-[10px] shrink-0" style={{ color: "var(--text-muted)" }}>
                                  {lesson.duration_minutes}m
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </GlassCard>
                  );
                })
              )}
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-4">
              {/* Progress card */}
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: ACCENT }}>
                  Your Progress
                </h2>
                <CircularProgress percent={percent} accent={accentColor} />
                <p className="text-xs text-center mt-3 mb-5" style={{ color: "var(--text-muted)" }}>
                  {completedLessons} of {totalLessons} lessons complete
                </p>
                {totalLessons > 0 && (
                  <button
                    onClick={handleStartContinue}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{
                      background: "rgba(139,92,246,0.12)",
                      border: "1px solid rgba(139,92,246,0.3)",
                      color: ACCENT,
                    }}
                  >
                    <Play size={14} />
                    {isCourseComplete ? "Review Course" : completedLessons > 0 ? "Continue" : "Start Course"}
                  </button>
                )}
              </GlassCard>

              {/* Certificate card */}
              {isCourseComplete && (
                <GlassCard>
                  <div className="flex items-center gap-2 mb-3">
                    <Award size={18} style={{ color: "#F59E0B" }} />
                    <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: "#F59E0B" }}>
                      Certificate Earned
                    </h2>
                  </div>
                  <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                    You have completed this course. Download your verified certificate.
                  </p>
                  <Link
                    href={`/tools/training/${courseId}/certificate`}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{
                      background: "rgba(245,158,11,0.12)",
                      border: "1px solid rgba(245,158,11,0.3)",
                      color: "#F59E0B",
                    }}
                  >
                    <Award size={14} />
                    View &amp; Download Certificate
                  </Link>
                </GlassCard>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
