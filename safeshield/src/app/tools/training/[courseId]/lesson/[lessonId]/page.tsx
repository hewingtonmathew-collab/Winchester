"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGuard from "@/components/ui/AuthGuard";
import GlassCard from "@/components/ui/GlassCard";
import {
  supabase,
  type TrainingLesson,
  type TrainingQuiz,
  type TrainingProgress,
} from "@/lib/supabase";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Award,
  BookOpen,
  ArrowLeft,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

const ACCENT = "#8B5CF6";
const PASS_MARK = 85;

function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    // YouTube watch URLs
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    // YouTube short URLs
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    // Vimeo
    if (u.hostname.includes("vimeo.com") && !u.pathname.startsWith("/video/")) {
      return `https://player.vimeo.com/video${u.pathname}`;
    }
  } catch {}
  return url;
}

export default function LessonPlayerPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const router = useRouter();

  const [lessons, setLessons] = useState<TrainingLesson[]>([]);
  const [lesson, setLesson] = useState<TrainingLesson | null>(null);
  const [quizzes, setQuizzes] = useState<TrainingQuiz[]>([]);
  const [progress, setProgress] = useState<TrainingProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [markingLesson, setMarkingLesson] = useState(false);
  const [courseComplete, setCourseComplete] = useState(false);
  const [retakeAllowed, setRetakeAllowed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setSubmitted(false);
    setSelectedAnswers({});
    setCourseComplete(false);
    setRetakeAllowed(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);

      const [{ data: lessonsData }, { data: lessonData }, { data: quizData }] = await Promise.all([
        supabase.from("training_lessons").select("*").eq("course_id", courseId).order("sort_order"),
        supabase.from("training_lessons").select("*").eq("id", lessonId).single(),
        supabase.from("training_quizzes").select("*").eq("lesson_id", lessonId).order("sort_order"),
      ]);

      setLessons(lessonsData ?? []);
      setLesson(lessonData ?? null);
      setQuizzes(quizData ?? []);

      if (user) {
        const { data: prog } = await supabase
          .from("training_progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("course_id", courseId);
        const freshProg = prog ?? [];
        setProgress(freshProg);

        const thisLessonProg = freshProg.find(
          (p: TrainingProgress) => p.lesson_id === lessonId
        );

        if (thisLessonProg?.retake_allowed) {
          setRetakeAllowed(true);
        } else if (thisLessonProg?.completed && (quizData ?? []).length > 0) {
          setSubmitted(true);
          setScore(thisLessonProg.quiz_score ?? 100);
          setPassed(thisLessonProg.quiz_passed ?? true);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [courseId, lessonId]);

  useEffect(() => { load(); }, [load]);

  function isLessonCompleted(lId: string) {
    return progress.some((p) => p.lesson_id === lId && p.completed);
  }

  const currentIndex = lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  async function saveProgress(quizScore: number, quizPassed: boolean) {
    if (!userId) return;
    await supabase.from("training_progress").upsert(
      {
        user_id: userId,
        course_id: courseId,
        lesson_id: lessonId,
        completed: true,
        quiz_score: quizScore,
        quiz_passed: quizPassed,
        completed_at: new Date().toISOString(),
        retake_allowed: false,
      },
      { onConflict: "user_id,lesson_id" }
    );
    const { data: prog } = await supabase
      .from("training_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("course_id", courseId);
    const freshProg = prog ?? [];
    setProgress(freshProg);
    setRetakeAllowed(false);
    if (lessons.length > 0 && freshProg.filter((p: TrainingProgress) => p.completed).length >= lessons.length) {
      setCourseComplete(true);
    }
  }

  async function handleMarkRead() {
    setMarkingLesson(true);
    await saveProgress(100, true);
    setMarkingLesson(false);
    if (nextLesson) {
      router.push(`/tools/training/${courseId}/lesson/${nextLesson.id}`);
    }
  }

  async function handleSubmitQuiz() {
    const total = quizzes.length;
    let correct = 0;
    quizzes.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct_answer) correct++;
    });
    const pct = total > 0 ? Math.round((correct / total) * 100) : 100;
    const pass = pct >= PASS_MARK;
    setScore(pct);
    setPassed(pass);
    setSubmitted(true);
    await saveProgress(pct, pass);
  }

  function handleRetake() {
    setSubmitted(false);
    setSelectedAnswers({});
    setRetakeAllowed(false);
  }

  if (loading) {
    return (
      <AuthGuard toolSlug="training">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={28} className="animate-spin" style={{ color: ACCENT }} />
        </div>
      </AuthGuard>
    );
  }

  if (!lesson) {
    return (
      <AuthGuard toolSlug="training">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
          <BookOpen size={48} className="mx-auto mb-4 opacity-30" style={{ color: ACCENT }} />
          <p style={{ color: "var(--text-muted)" }}>Lesson not found.</p>
        </div>
      </AuthGuard>
    );
  }

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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <GlassCard className="p-4">
                <h2 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: ACCENT }}>
                  Lessons
                </h2>
                <div className="flex flex-col gap-1">
                  {lessons.map((l, idx) => {
                    const done = isLessonCompleted(l.id);
                    const isCurrent = l.id === lessonId;
                    return (
                      <Link
                        key={l.id}
                        href={`/tools/training/${courseId}/lesson/${l.id}`}
                        className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs transition-colors hover:bg-white/5"
                        style={{
                          background: isCurrent ? `${ACCENT}12` : undefined,
                          color: isCurrent ? ACCENT : done ? "#22c55e" : "var(--text-muted)",
                        }}
                      >
                        {done ? (
                          <CheckCircle2 size={13} style={{ color: "#22c55e", flexShrink: 0 }} />
                        ) : (
                          <span
                            className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                            style={{
                              background: isCurrent ? ACCENT : "var(--glass-border)",
                              color: isCurrent ? "#fff" : "var(--text-muted)",
                            }}
                          >
                            {idx + 1}
                          </span>
                        )}
                        <span className="truncate font-medium">{l.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </GlassCard>
            </div>

            {/* Main */}
            <div className="lg:col-span-3 flex flex-col gap-5">

              <GlassCard>
                <h1 className="heading-luxury text-xl sm:text-2xl mb-4" style={{ color: "var(--text)" }}>
                  {lesson.title}
                </h1>

                {/* Pitch / intro */}
                {lesson.pitch && (
                  <div
                    className="mb-5 px-4 py-3 rounded-xl text-sm font-medium leading-relaxed italic"
                    style={{
                      background: `${ACCENT}0d`,
                      border: `1px solid ${ACCENT}30`,
                      color: "var(--text-muted)",
                      borderLeft: `3px solid ${ACCENT}`,
                    }}
                  >
                    {lesson.pitch}
                  </div>
                )}

                {/* Video */}
                {lesson.video_url && (
                  <div className="rounded-xl overflow-hidden mb-5" style={{ aspectRatio: "16/9" }}>
                    <iframe
                      src={toEmbedUrl(lesson.video_url)}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      title={lesson.title}
                    />
                  </div>
                )}

                {/* Content */}
                {lesson.content && (
                  <div className="text-sm leading-relaxed" style={{ color: "var(--text-muted)", whiteSpace: "pre-wrap" }}>
                    {lesson.content}
                  </div>
                )}

                {/* Mark as read (no quiz) */}
                {!lesson.has_quiz && !isLessonCompleted(lessonId) && (
                  <button
                    onClick={handleMarkRead}
                    disabled={markingLesson}
                    className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                    style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", color: ACCENT }}
                  >
                    {markingLesson ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                    Mark as Read
                  </button>
                )}

                {!lesson.has_quiz && isLessonCompleted(lessonId) && (
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "#22c55e" }}>
                    <CheckCircle2 size={16} /> Lesson Completed
                  </div>
                )}
              </GlassCard>

              {/* Course complete banner */}
              {courseComplete && (
                <GlassCard className="text-center py-10">
                  <Award size={48} className="mx-auto mb-4" style={{ color: "#F59E0B" }} />
                  <h2 className="heading-luxury text-2xl mb-2" style={{ color: "var(--text)" }}>
                    Course Complete!
                  </h2>
                  <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                    You have completed all lessons. Your certificate is ready if you achieved {PASS_MARK}% or above.
                  </p>
                  <Link
                    href={`/tools/training/${courseId}/certificate`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                    style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B" }}
                  >
                    <Award size={14} />
                    View Certificate
                  </Link>
                </GlassCard>
              )}

              {/* Retake banner */}
              {retakeAllowed && lesson.has_quiz && (
                <GlassCard className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#F59E0B" }}>Retake Available</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Your trainer has allowed you to retake this quiz.</p>
                  </div>
                  <button
                    onClick={handleRetake}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shrink-0"
                    style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B" }}
                  >
                    <RefreshCw size={13} /> Start Retake
                  </button>
                </GlassCard>
              )}

              {/* Quiz */}
              {lesson.has_quiz && quizzes.length > 0 && !retakeAllowed && (
                <GlassCard>
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} style={{ color: ACCENT }} />
                      <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
                        Knowledge Check
                      </h2>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(139,92,246,0.12)", color: ACCENT }}>
                      Pass mark: {PASS_MARK}%
                    </span>
                  </div>

                  <div className="flex flex-col gap-6">
                    {quizzes.map((q, qi) => {
                      const selected = selectedAnswers[q.id];
                      const isCorrect = submitted && selected === q.correct_answer;

                      return (
                        <div key={q.id}>
                          <p className="text-sm font-medium mb-3" style={{ color: "var(--text)" }}>
                            {qi + 1}. {q.question}
                          </p>
                          <div className="flex flex-col gap-2">
                            {(q.options as string[]).map((opt, oi) => {
                              const isSelected = selected === oi;
                              const isCorrectOption = submitted && oi === q.correct_answer;
                              const isWrongSelected = submitted && isSelected && !isCorrectOption;

                              return (
                                <button
                                  key={oi}
                                  disabled={submitted}
                                  onClick={() => !submitted && setSelectedAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                                  className="text-left px-4 py-2.5 rounded-xl text-xs font-medium transition-all"
                                  style={{
                                    border: `1px solid ${isCorrectOption ? "rgba(34,197,94,0.5)" : isWrongSelected ? "rgba(239,68,68,0.5)" : isSelected ? `${ACCENT}60` : "var(--glass-border)"}`,
                                    background: isCorrectOption ? "rgba(34,197,94,0.10)" : isWrongSelected ? "rgba(239,68,68,0.10)" : isSelected ? `${ACCENT}12` : "var(--glass-fill)",
                                    color: isCorrectOption ? "#22c55e" : isWrongSelected ? "#ef4444" : isSelected ? ACCENT : "var(--text)",
                                  }}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {submitted && q.explanation && (
                            <div
                              className="mt-3 flex items-start gap-2 p-3 rounded-lg text-xs"
                              style={{
                                background: isCorrect ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                                border: `1px solid ${isCorrect ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                                color: isCorrect ? "#22c55e" : "#ef4444",
                              }}
                            >
                              {isCorrect ? <CheckCircle2 size={13} className="shrink-0 mt-0.5" /> : <AlertCircle size={13} className="shrink-0 mt-0.5" />}
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!submitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(selectedAnswers).length < quizzes.length}
                      className="mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                      style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", color: ACCENT }}
                    >
                      Submit Answers
                    </button>
                  ) : (
                    <div className="mt-6 flex flex-col gap-3">
                      <div
                        className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold"
                        style={{
                          background: passed ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                          border: `1px solid ${passed ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                          color: passed ? "#22c55e" : "#ef4444",
                        }}
                      >
                        {passed ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                        {score}% — {passed ? `Passed (${PASS_MARK}% required)` : `Not Passed — ${PASS_MARK}% required`}
                      </div>
                      {!passed && (
                        <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                          Contact your trainer to request a retake.
                        </p>
                      )}
                      {passed && nextLesson && (
                        <Link
                          href={`/tools/training/${courseId}/lesson/${nextLesson.id}`}
                          className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                          style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", color: ACCENT }}
                        >
                          Next Lesson <ChevronRight size={14} />
                        </Link>
                      )}
                    </div>
                  )}
                </GlassCard>
              )}

              {/* Prev / Next navigation */}
              <div className="flex items-center justify-between">
                {prevLesson ? (
                  <Link
                    href={`/tools/training/${courseId}/lesson/${prevLesson.id}`}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all hover:opacity-80"
                    style={{ background: "var(--glass-fill)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }}
                  >
                    <ChevronLeft size={13} /> Previous
                  </Link>
                ) : <span />}

                {nextLesson && (isLessonCompleted(lessonId) || !lesson.has_quiz) && (
                  <Link
                    href={`/tools/training/${courseId}/lesson/${nextLesson.id}`}
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all hover:opacity-80"
                    style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", color: ACCENT }}
                  >
                    Next <ChevronRight size={13} />
                  </Link>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
