export type DetectionResult = {
  score: number;
  label: "Likely AI" | "Possibly AI" | "Likely Human";
  confidence: "High" | "Medium" | "Low";
  breakdown: Array<{ signal: string; weight: number; explanation: string }>;
  flaggedPhrases: string[];
  stats: {
    wordCount: number;
    sentenceCount: number;
    avgSentenceLength: number;
    lexicalDiversity: number;
    passiveVoiceRatio: number;
    burstiness: number;
  };
};

const AI_PHRASES = [
  "Furthermore,", "Moreover,", "In conclusion,", "It is important to note",
  "It is worth noting", "This ensures that", "This allows", "In order to",
  "As a result,", "Additionally,", "Consequently,", "In summary,",
  "Certainly!", "Of course!", "Absolutely!", "Great question",
  "It is generally accepted", "widely regarded as", "it is commonly understood",
];

function tokeniseWords(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9'\s]/g, " ").split(/\s+/).filter((w) => w.length > 0);
}

function tokeniseSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 0);
}

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function scoreAiPhrases(text: string) {
  const flagged: string[] = [];
  const lower = text.toLowerCase();
  for (const phrase of AI_PHRASES) {
    if (lower.includes(phrase.toLowerCase())) flagged.push(phrase);
  }
  return { raw: Math.min(flagged.length * 5, 25), flagged };
}

function scoreBurstiness(sentences: string[]) {
  const lengths = sentences.map((s) => tokeniseWords(s).length);
  const sd = stdDev(lengths);
  const raw = sd < 5 ? 20 : sd < 8 ? 14 : sd < 12 ? 8 : 0;
  return { raw, burstiness: Math.round(sd * 100) / 100 };
}

function scoreLexicalDiversity(words: string[]) {
  if (words.length === 0) return { raw: 0, ttr: 0 };
  const ttr = new Set(words).size / words.length;
  const raw = ttr >= 0.55 && ttr <= 0.70 ? 20 : ttr >= 0.45 && ttr < 0.55 ? 12 : ttr > 0.70 && ttr <= 0.80 ? 10 : 0;
  return { raw, ttr: Math.round(ttr * 1000) / 1000 };
}

function scorePassiveVoice(text: string, sentences: string[]) {
  const matches = (text.match(/\b(was|is|were|been|be)\s+\w+(?:ed|en)\b/gi) ?? []).length;
  const ratio = sentences.length > 0 ? matches / sentences.length : 0;
  const raw = ratio > 0.4 ? 15 : ratio > 0.25 ? 10 : ratio > 0.15 ? 5 : 0;
  return { raw, ratio: Math.round(ratio * 1000) / 1000 };
}

function scoreSentenceLengthUniformity(sentences: string[]): number {
  const inRange = sentences.filter((s) => { const l = tokeniseWords(s).length; return l >= 20 && l <= 30; }).length;
  const ratio = sentences.length > 0 ? inRange / sentences.length : 0;
  return ratio > 0.6 ? 10 : ratio > 0.4 ? 6 : ratio > 0.2 ? 3 : 0;
}

function scorePersonalPronounDensity(words: string[]): number {
  const pronouns = new Set(["i", "my", "we", "our", "i've", "i'm", "mine", "ours"]);
  const density = words.length > 0 ? words.filter((w) => pronouns.has(w)).length / words.length : 0;
  return density < 0.005 ? 10 : density < 0.015 ? 6 : density < 0.03 ? 3 : 0;
}

export function detectAi(text: string): DetectionResult {
  const words = tokeniseWords(text);
  const sentences = tokeniseSentences(text);
  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const avgSentenceLength = sentenceCount > 0 ? Math.round((wordCount / sentenceCount) * 10) / 10 : 0;

  const { raw: phraseScore, flagged: flaggedPhrases } = scoreAiPhrases(text);
  const { raw: burstyScore, burstiness } = scoreBurstiness(sentences);
  const { raw: ttrScore, ttr } = scoreLexicalDiversity(words);
  const { raw: passiveScore, ratio: passiveVoiceRatio } = scorePassiveVoice(text, sentences);
  const uniformityScore = scoreSentenceLengthUniformity(sentences);
  const pronounScore = scorePersonalPronounDensity(words);

  const score = Math.min(100, Math.max(0, Math.round(phraseScore + burstyScore + ttrScore + passiveScore + uniformityScore + pronounScore)));
  const label: DetectionResult["label"] = score <= 35 ? "Likely Human" : score <= 65 ? "Possibly AI" : "Likely AI";
  const confidence: DetectionResult["confidence"] = score < 20 || score > 80 ? "High" : score < 35 || score > 65 ? "Medium" : "Low";

  return {
    score, label, confidence,
    flaggedPhrases,
    breakdown: [
      { signal: "AI Phrase Patterns", weight: phraseScore, explanation: flaggedPhrases.length > 0 ? `Detected ${flaggedPhrases.length} pattern(s): ${flaggedPhrases.slice(0, 3).join(", ")}` : "No common AI transition phrases detected." },
      { signal: "Sentence Burstiness", weight: burstyScore, explanation: burstiness < 5 ? `Very uniform sentence lengths (std dev ${burstiness}) — AI-like.` : burstiness < 10 ? `Moderate variation (std dev ${burstiness}).` : `High variation (std dev ${burstiness}) — human indicator.` },
      { signal: "Lexical Diversity", weight: ttrScore, explanation: `Type-Token Ratio: ${(ttr * 100).toFixed(1)}%. ${ttr >= 0.55 && ttr <= 0.70 ? "Falls in the AI-typical range." : ttr > 0.80 ? "Very high — suggests human authorship." : "Outside typical AI range."}` },
      { signal: "Passive Voice Usage", weight: passiveScore, explanation: `Passive voice ratio: ${(passiveVoiceRatio * 100).toFixed(1)}%. ${passiveVoiceRatio > 0.25 ? "Elevated — associated with AI text." : "Within normal range."}` },
      { signal: "Sentence Length Uniformity", weight: uniformityScore, explanation: uniformityScore > 6 ? "High proportion of sentences in the 20–30 word AI sweet spot." : uniformityScore > 0 ? "Moderate concentration in AI-typical length range." : "Lengths vary widely — more human-like." },
      { signal: "Personal Pronoun Density", weight: pronounScore, explanation: pronounScore > 6 ? "Very few first-person pronouns — AI typically avoids personal voice." : pronounScore > 0 ? "Low personal pronoun usage." : "Normal personal pronoun usage — consistent with human writing." },
    ],
    stats: { wordCount, sentenceCount, avgSentenceLength, lexicalDiversity: Math.round(ttr * 1000) / 10, passiveVoiceRatio: Math.round(passiveVoiceRatio * 1000) / 10, burstiness },
  };
}
