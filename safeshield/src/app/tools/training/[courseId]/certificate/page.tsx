"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "@/components/ui/AuthGuard";
import GlassCard from "@/components/ui/GlassCard";
import Certificate from "@/components/report/Certificate";
import { supabase, type TrainingCourse, type TrainingLesson, type TrainingProgress, type TrainingCompletionReport, type SchoolTrainingProfile } from "@/lib/supabase";
import { Award, ArrowLeft, Loader2, BookOpen, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const ACCENT = "#8B5CF6";
const PASS_MARK = 85;

export default function TrainingCertificatePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, profile } = useAuth();

  const [course, setCourse] = useState<TrainingCourse | null>(null);
  const [lessons, setLessons] = useState<TrainingLesson[]>([]);
  const [progress, setProgress] = useState<TrainingProgress[]>([]);
  const [reports, setReports] = useState<TrainingCompletionReport[]>([]);
  const [schoolProfile, setSchoolProfile] = useState<SchoolTrainingProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [{ data: courseData }, { data: lessonsData }] = await Promise.all([
          supabase.from("training_courses").select("*").eq("id", courseId).single(),
          supabase.from("training_lessons").select("*").eq("course_id", courseId).order("sort_order"),
        ]);

        setCourse(courseData ?? null);
        setLessons(lessonsData ?? []);

        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const [{ data: prog }, { data: rpts }, { data: membership }] = await Promise.all([
            supabase.from("training_progress").select("*").eq("user_id", authUser.id).eq("course_id", courseId),
            supabase.from("training_completion_reports").select("*").eq("user_id", authUser.id).eq("course_id", courseId).order("created_at"),
            supabase.from("org_members").select("school_id").eq("user_id", authUser.id).maybeSingle(),
          ]);
          setProgress(prog ?? []);
          setReports(rpts ?? []);
          if (membership?.school_id) {
            const { data: sp } = await supabase
              .from("school_training_profiles")
              .select("*")
              .eq("school_id", membership.school_id)
              .maybeSingle();
            setSchoolProfile(sp ?? null);
          }
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
  const totalLessons = lessons.length;
  const allComplete = totalLessons > 0 && completedLessons >= totalLessons;

  // Calculate per-lesson scores for display
  const lessonScores = lessons.map((l) => {
    const p = progress.find((pr) => pr.lesson_id === l.id);
    return {
      id: l.id,
      title: l.title,
      has_quiz: l.has_quiz,
      score: p?.quiz_score ?? null,
      passed: p?.quiz_passed ?? false,
      completed: p?.completed ?? false,
    };
  });

  // Average only quiz lessons that have been scored
  const quizScores = lessonScores.filter((l) => l.has_quiz && l.score !== null).map((l) => l.score as number);
  const avgScore = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 100;
  const meetsPassMark = avgScore >= PASS_MARK;
  const isCertUnlocked = allComplete && meetsPassMark;

  const completionDate =
    progress.filter((p) => p.completed_at).map((p) => p.completed_at as string).sort().at(-1) ?? new Date().toISOString();

  const rating = avgScore >= 95 ? "Distinction" : avgScore >= PASS_MARK ? "Pass" : "Not Yet Passed";
  const ratingColor = avgScore >= 95 ? "#22c55e" : avgScore >= PASS_MARK ? "#38BDF8" : "#ef4444";

  return (
    <AuthGuard toolSlug="training">
      <div className="min-h-[100dvh] pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <Link
            href={`/tools/training/${courseId}`}
            className="inline-flex items-center gap-1.5 text-xs mb-6 transition-opacity hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={13} />
            Back to Course
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
              <Award size={20} style={{ color: "#F59E0B" }} />
            </div>
            <div>
              <h1 className="heading-luxury text-xl" style={{ color: "var(--text)" }}>Course Certificate</h1>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{course.title}</p>
            </div>
          </div>

          {/* Per-lesson score breakdown */}
          <GlassCard className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-dim)" }}>Lesson Results</h2>
            <div className="flex flex-col divide-y divide-white/5">
              {lessonScores.map((l) => (
                <div key={l.id} className="flex items-center justify-between py-2.5 gap-4">
                  <div className="flex items-center gap-2 min-w-0">
                    {l.completed
                      ? <CheckCircle2 size={13} style={{ color: l.passed || !l.has_quiz ? "#22c55e" : "#ef4444", flexShrink: 0 }} />
                      : <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ border: "2px solid rgba(255,255,255,0.15)" }} />
                    }
                    <span className="text-sm truncate" style={{ color: "var(--text-muted)" }}>{l.title}</span>
                  </div>
                  <div className="shrink-0">
                    {l.has_quiz && l.score !== null ? (
                      <span className="text-sm font-bold" style={{ color: l.passed ? "#22c55e" : "#ef4444" }}>
                        {l.score}%
                      </span>
                    ) : l.completed ? (
                      <span className="text-xs" style={{ color: "var(--text-faint)" }}>Read</span>
                    ) : (
                      <span className="text-xs" style={{ color: "var(--text-faint)" }}>Not started</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {quizScores.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>Overall Quiz Average</span>
                <span className="text-lg font-bold" style={{ color: meetsPassMark ? "#22c55e" : "#ef4444" }}>{avgScore}%</span>
              </div>
            )}
          </GlassCard>

          {/* Learning reports from admin */}
          {reports.length > 0 && (
            <GlassCard className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={15} style={{ color: ACCENT }} />
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>Trainer Learning Reports</h2>
              </div>
              <div className="flex flex-col gap-3">
                {reports.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl" style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}20` }}>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)", whiteSpace: "pre-wrap" }}>{r.report_text}</p>
                    <p className="text-[10px] mt-2" style={{ color: "var(--text-faint)" }}>
                      {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* School personnel panel */}
          {schoolProfile && (schoolProfile.dsl_name || schoolProfile.dpo_name || schoolProfile.head_teacher || schoolProfile.chair_of_governors) && (
            <GlassCard className="mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-dim)" }}>School Safeguarding &amp; Data Protection</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Head Teacher",   value: schoolProfile.head_teacher },
                  { label: "DSL",            value: schoolProfile.dsl_name },
                  { label: "DPO",            value: schoolProfile.dpo_name },
                  { label: "Chair of Governors", value: schoolProfile.chair_of_governors },
                ].filter((f) => f.value).map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-faint)" }}>{label}</p>
                    <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{value}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Not eligible gate */}
          {!isCertUnlocked ? (
            <GlassCard className="text-center py-16">
              <AlertCircle size={48} className="mx-auto mb-4 opacity-40 text-[#ef4444]" />
              <p className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
                {!allComplete ? "Certificate Not Yet Unlocked" : "Quiz Score Too Low"}
              </p>
              <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
                {!allComplete
                  ? `Complete all ${totalLessons} lessons first (${completedLessons} done so far).`
                  : `You need an average quiz score of ${PASS_MARK}% or above to earn your certificate. Your current average is ${avgScore}%. Contact your trainer to request a retake.`}
              </p>
              <Link
                href={`/tools/training/${courseId}`}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", color: ACCENT }}
              >
                Continue Course
              </Link>
            </GlassCard>
          ) : (
            <Certificate
              meta={{
                schoolName: (profile as { full_name?: string } | null)?.full_name ?? "Staff Member",
                schoolEmail: user?.email ?? "",
                consultantName: "SafeShield Training",
                consultantEmail: "training@safeshield.co.uk",
                staffMember: (() => {
                  const p = profile as { full_name?: string; role?: string } | null;
                  const name = p?.full_name ?? "Staff Member";
                  const role = p?.role ? `· ${p.role.charAt(0).toUpperCase()}${p.role.slice(1)}` : "";
                  return [name, role].filter(Boolean).join(" ");
                })(),
                logoDataUrl: null,
              }}
              toolName={course.title}
              score={avgScore}
              rating={rating}
              ratingColor={ratingColor}
              accentColor={ACCENT}
              areas={lessonScores.map((l) => ({
                name: l.title,
                score: l.has_quiz && l.score !== null ? l.score : undefined,
              }))}
              date={completionDate}
            />
          )}

        </div>
      </div>
    </AuthGuard>
  );
}
