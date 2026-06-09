"use client";
import { useEffect, useState } from "react";
import AuthGuard from "@/components/ui/AuthGuard";
import GlassCard from "@/components/ui/GlassCard";
import { supabase, type TrainingCourse, type TrainingProgress } from "@/lib/supabase";
import { BookOpen, Clock, Award, ChevronRight, Play, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const ACCENT = "#8B5CF6";

const LEVEL_COLORS: Record<string, string> = {
  beginner: "#22c55e",
  intermediate: "#f59e0b",
  advanced: "#ef4444",
};

const CATEGORIES = ["All", "Safeguarding", "Data Protection", "AI & Technology", "Health & Safety", "Leadership"];

type CourseWithProgress = TrainingCourse & {
  totalLessons: number;
  completedLessons: number;
  percent: number;
};

function CourseCard({ course }: { course: CourseWithProgress }) {
  const accentColor = course.thumbnail_color ?? ACCENT;
  const levelColor = LEVEL_COLORS[course.level] ?? ACCENT;
  const isCompleted = course.totalLessons > 0 && course.completedLessons >= course.totalLessons;
  const isStarted = course.completedLessons > 0 && !isCompleted;
  const noContent = course.totalLessons === 0;

  return (
    <Link href={`/tools/training/${course.id}`} className="block group">
      <GlassCard hover className="h-full flex flex-col overflow-hidden p-0">
        {/* Coloured top bar */}
        <div className="h-1.5 w-full rounded-t-2xl" style={{ background: accentColor }} />
        <div className="p-5 flex flex-col flex-1 gap-3">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
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

          {/* Title */}
          <h3 className="text-sm font-bold leading-snug" style={{ color: "var(--text)" }}>
            {course.title}
          </h3>

          {/* Description */}
          {course.description && (
            <p
              className="text-xs leading-relaxed line-clamp-2 flex-1"
              style={{ color: "var(--text-muted)" }}
            >
              {course.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {course.duration_minutes} min
            </span>
            {!noContent && (
              <span className="flex items-center gap-1">
                <BookOpen size={11} />
                {course.totalLessons} lessons
              </span>
            )}
          </div>

          {/* Progress bar */}
          {!noContent && isStarted && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]" style={{ color: "var(--text-muted)" }}>
                <span>{course.completedLessons} of {course.totalLessons} complete</span>
                <span>{Math.round(course.percent)}%</span>
              </div>
              <div className="h-1 rounded-full" style={{ background: "var(--glass-border)" }}>
                <div
                  className="h-1 rounded-full transition-all"
                  style={{ width: `${course.percent}%`, background: accentColor }}
                />
              </div>
            </div>
          )}

          {/* CTA */}
          {noContent ? (
            <div
              className="text-xs text-center py-2 px-4 rounded-xl font-medium"
              style={{ background: "rgba(139,92,246,0.08)", color: "var(--text-muted)" }}
            >
              Coming Soon
            </div>
          ) : isCompleted ? (
            <div
              className="text-xs text-center py-2 px-4 rounded-xl font-semibold flex items-center justify-center gap-1.5"
              style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}
            >
              <Award size={12} /> Completed
            </div>
          ) : (
            <div
              className="text-xs text-center py-2 px-4 rounded-xl font-semibold flex items-center justify-center gap-1.5"
              style={{
                background: "rgba(139,92,246,0.12)",
                color: ACCENT,
                border: "1px solid rgba(139,92,246,0.3)",
              }}
            >
              <Play size={11} />
              {isStarted ? "Continue" : "Start Course"}
            </div>
          )}
        </div>
      </GlassCard>
    </Link>
  );
}

export default function TrainingPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data: rawCourses } = await supabase
          .from("training_courses")
          .select("*")
          .eq("status", "published")
          .order("created_at", { ascending: true });

        if (!rawCourses) { setCourses([]); return; }

        const { data: { user: authUser } } = await supabase.auth.getUser();

        let progressRows: TrainingProgress[] = [];
        if (authUser) {
          const { data: prog } = await supabase
            .from("training_progress")
            .select("*")
            .eq("user_id", authUser.id);
          progressRows = prog ?? [];
        }

        // Get lesson counts per course
        const { data: allLessons } = await supabase
          .from("training_lessons")
          .select("id, course_id");

        const lessonsByCourse: Record<string, number> = {};
        (allLessons ?? []).forEach((l: { id: string; course_id: string }) => {
          lessonsByCourse[l.course_id] = (lessonsByCourse[l.course_id] ?? 0) + 1;
        });

        const enriched: CourseWithProgress[] = rawCourses.map((c: TrainingCourse) => {
          const totalLessons = lessonsByCourse[c.id] ?? 0;
          const completedLessons = progressRows.filter(
            (p) => p.course_id === c.id && p.completed
          ).length;
          const percent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
          return { ...c, totalLessons, completedLessons, percent };
        });

        setCourses(enriched);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const enrolled = courses.filter((c) => c.completedLessons > 0).length;
  const completed = courses.filter((c) => c.totalLessons > 0 && c.completedLessons >= c.totalLessons).length;

  const filtered =
    activeCategory === "All"
      ? courses
      : courses.filter((c) => c.category === activeCategory);

  return (
    <AuthGuard toolSlug="training">
      <div className="min-h-[100dvh] pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Hero Header */}
          <div className="rise-in mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}
              >
                <BookOpen size={24} style={{ color: ACCENT }} />
              </div>
              <span
                className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ background: "rgba(139,92,246,0.12)", color: ACCENT, border: "1px solid rgba(139,92,246,0.25)" }}
              >
                Training &amp; CPD
              </span>
            </div>
            <h1 className="heading-luxury text-3xl sm:text-4xl mb-3" style={{ color: "var(--text)" }}>
              Training &amp; Certification Centre
            </h1>
            <div className="w-12 h-0.5 mb-4 rounded-full" style={{ background: ACCENT }} />
            <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "var(--text-muted)" }}>
              Complete accredited training courses, track your CPD progress, and earn verified certificates recognised across the education sector.
            </p>
          </div>

          {/* Stats bar */}
          <div className="rise-in-1 flex flex-wrap gap-3 mb-8">
            {[
              { label: "Enrolled", value: enrolled, icon: BookOpen },
              { label: "Completed", value: completed, icon: Award },
              { label: "Certificates", value: completed, icon: Award },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: "rgba(139,92,246,0.08)",
                  border: "1px solid rgba(139,92,246,0.2)",
                  color: "var(--text)",
                }}
              >
                <Icon size={14} style={{ color: ACCENT }} />
                <span style={{ color: ACCENT }} className="font-bold">{value}</span>
                <span style={{ color: "var(--text-muted)" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="rise-in-2 flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                style={
                  activeCategory === cat
                    ? { background: ACCENT, color: "#fff" }
                    : {
                        background: "var(--glass-fill)",
                        border: "1px solid var(--glass-border)",
                        color: "var(--text-muted)",
                      }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Course grid */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 size={28} className="animate-spin" style={{ color: ACCENT }} />
            </div>
          ) : filtered.length === 0 ? (
            <GlassCard className="text-center py-16">
              <BookOpen size={48} className="mx-auto mb-4 opacity-30" style={{ color: ACCENT }} />
              <p className="text-sm font-medium mb-1" style={{ color: "var(--text)" }}>
                Course library coming soon.
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Your administrator is building content.
              </p>
            </GlassCard>
          ) : (
            <div className="rise-in-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
