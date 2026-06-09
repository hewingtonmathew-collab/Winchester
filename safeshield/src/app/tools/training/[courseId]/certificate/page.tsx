"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "@/components/ui/AuthGuard";
import GlassCard from "@/components/ui/GlassCard";
import Certificate from "@/components/report/Certificate";
import { supabase, type TrainingCourse, type TrainingSection, type TrainingProgress } from "@/lib/supabase";
import { Award, ArrowLeft, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const ACCENT = "#8B5CF6";

export default function TrainingCertificatePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, profile } = useAuth();

  const [course, setCourse] = useState<TrainingCourse | null>(null);
  const [sections, setSections] = useState<TrainingSection[]>([]);
  const [progress, setProgress] = useState<TrainingProgress[]>([]);
  const [totalLessons, setTotalLessons] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [{ data: courseData }, { data: sectionsData }, { data: lessonsData }] = await Promise.all([
          supabase.from("training_courses").select("*").eq("id", courseId).single(),
          supabase.from("training_sections").select("*").eq("course_id", courseId).order("sort_order"),
          supabase.from("training_lessons").select("id").eq("course_id", courseId),
        ]);

        setCourse(courseData ?? null);
        setSections(sectionsData ?? []);
        setTotalLessons((lessonsData ?? []).length);

        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const { data: prog } = await supabase
            .from("training_progress")
            .select("*")
            .eq("user_id", authUser.id)
            .eq("course_id", courseId);
          setProgress(prog ?? []);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

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

  const completedLessons = progress.filter((p) => p.completed).length;
  const isCourseComplete = totalLessons > 0 && completedLessons >= totalLessons;

  const scores = progress.filter((p) => p.quiz_score !== null).map((p) => p.quiz_score as number);
  const overallScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 100;

  const completionDate =
    progress
      .filter((p) => p.completed_at)
      .map((p) => p.completed_at as string)
      .sort()
      .at(-1) ?? new Date().toISOString();

  const rating =
    overallScore >= 80 ? "Distinction" : overallScore >= 70 ? "Pass" : "Completed";
  const ratingColor =
    overallScore >= 80 ? "#22c55e" : overallScore >= 70 ? "#38BDF8" : ACCENT;

  return (
    <AuthGuard toolSlug="training">
      <div className="min-h-[100dvh] pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Back link */}
          <Link
            href={`/tools/training/${courseId}`}
            className="inline-flex items-center gap-1.5 text-xs mb-6 transition-opacity hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={13} />
            Back to Course
          </Link>

          {/* Header */}
          <div className="rise-in mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}
              >
                <Award size={20} style={{ color: "#F59E0B" }} />
              </div>
              <div>
                <h1 className="heading-luxury text-xl" style={{ color: "var(--text)" }}>
                  Course Certificate
                </h1>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{course.title}</p>
              </div>
            </div>
          </div>

          {/* Not complete state */}
          {!isCourseComplete ? (
            <GlassCard className="text-center py-16">
              <BookOpen size={48} className="mx-auto mb-4 opacity-30" style={{ color: ACCENT }} />
              <p className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
                Certificate Not Yet Unlocked
              </p>
              <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
                Complete all lessons to unlock your certificate.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                <span style={{ color: ACCENT }} className="font-bold">{completedLessons}</span>
                <span>of</span>
                <span style={{ color: ACCENT }} className="font-bold">{totalLessons}</span>
                <span>lessons complete</span>
              </div>
              <Link
                href={`/tools/training/${courseId}`}
                className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{
                  background: "rgba(139,92,246,0.12)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  color: ACCENT,
                }}
              >
                Continue Course
              </Link>
            </GlassCard>
          ) : (
            /* Certificate */
            <Certificate
              meta={{
                schoolName: (profile as { full_name?: string } | null)?.full_name ?? "Staff Member",
                schoolEmail: user?.email ?? "",
                consultantName: "SafeShield Training",
                consultantEmail: "training@safeshield.co.uk",
                staffMember: (profile as { full_name?: string } | null)?.full_name ?? "",
                logoDataUrl: null,
              }}
              toolName={course.title}
              score={overallScore}
              rating={rating}
              ratingColor={ratingColor}
              accentColor={ACCENT}
              areas={sections.map((s) => ({ name: s.title }))}
              date={completionDate}
            />
          )}

        </div>
      </div>
    </AuthGuard>
  );
}
