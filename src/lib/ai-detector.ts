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
  // Transition phrases
  "Furthermore,",
  "Moreover,",
  "In conclusion,",
  "It is important to note",
  "It is worth noting",
  "This ensures that",
  "This allows",
  "In order to",
  "As a result,",
  "Additionally,",
  "Consequently,",
  "In summary,",
  // Filler openers
  "Certainly!",
  "Of course!",
  "Absolutely!",
  "Great question",
  // Over-hedging
  "It is generally accepted",
  "widely regarded as",
  "it is commonly understood",
];

function tokeniseWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

function tokeniseSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function scoreAiPhrases(text: string): {
  raw: number;
  flagged: string[];
} {
  const flagged: string[] = [];
  const lowerText = text.toLowerCase();

  for (const phrase of AI_PHRASES) {
    if (lowerText.includes(phrase.toLowerCase())) {
      flagged.push(phrase);
    }
  }

  // Scale: each phrase = 5 points, capped at 25
  const raw = Math.min(flagged.length * 5, 25);
  return { raw, flagged };
}

function scoreBurstiness(sentences: string[]): {
  raw: number;
  burstiness: number;
} {
  const lengths = sentences.map((s) => tokeniseWords(s).length);
  const sd = stdDev(lengths);

  // Low std dev (< 5) = very uniform = AI-like → high score
  // High std dev (> 15) = very bursty = human-like → low score
  let raw: number;
  if (sd < 5) {
    raw = 20;
  } else if (sd < 8) {
    raw = 14;
  } else if (sd < 12) {
    raw = 8;
  } else {
    raw = 0;
  }

  return { raw, burstiness: Math.round(sd * 100) / 100 };
}

function scoreLexicalDiversity(words: string[]): {
  raw: number;
  ttr: number;
} {
  if (words.length === 0) return { raw: 0, ttr: 0 };
  const unique = new Set(words).size;
  const ttr = unique / words.length;

  // AI tends toward moderate TTR (0.55–0.70)
  // Very high (> 0.80) or very low (< 0.40) = human markers
  let raw: number;
  if (ttr >= 0.55 && ttr <= 0.70) {
    raw = 20; // exactly in AI sweet spot
  } else if (ttr >= 0.45 && ttr < 0.55) {
    raw = 12;
  } else if (ttr > 0.70 && ttr <= 0.80) {
    raw = 10;
  } else {
    raw = 0; // extreme TTR = human signal
  }

  return { raw, ttr: Math.round(ttr * 1000) / 1000 };
}

function scorePassiveVoice(text: string, sentences: string[]): {
  raw: number;
  ratio: number;
} {
  const passivePattern =
    /\b(was|is|were|been|be)\s+\w+(?:ed|en)\b/gi;
  const matches = text.match(passivePattern) ?? [];
  const ratio =
    sentences.length > 0 ? matches.length / sentences.length : 0;

  // > 25% = AI signal
  let raw: number;
  if (ratio > 0.4) {
    raw = 15;
  } else if (ratio > 0.25) {
    raw = 10;
  } else if (ratio > 0.15) {
    raw = 5;
  } else {
    raw = 0;
  }

  return { raw, ratio: Math.round(ratio * 1000) / 1000 };
}

function scoreSentenceLengthUniformity(sentences: string[]): number {
  const lengths = sentences.map((s) => tokeniseWords(s).length);
  const inAiSweet = lengths.filter((l) => l >= 20 && l <= 30).length;
  const ratio = sentences.length > 0 ? inAiSweet / sentences.length : 0;

  // High proportion of 20-30 word sentences = AI
  if (ratio > 0.6) return 10;
  if (ratio > 0.4) return 6;
  if (ratio > 0.2) return 3;
  return 0;
}

function scorePersonalPronounDensity(words: string[]): number {
  const pronouns = new Set(["i", "my", "we", "our", "i've", "i'm", "mine", "ours"]);
  const count = words.filter((w) => pronouns.has(w)).length;
  const density = words.length > 0 ? count / words.length : 0;

  // Very low personal pronoun density = AI signal
  if (density < 0.005) return 10;
  if (density < 0.015) return 6;
  if (density < 0.03) return 3;
  return 0;
}

export function detectAi(text: string): DetectionResult {
  const words = tokeniseWords(text);
  const sentences = tokeniseSentences(text);

  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const avgSentenceLength =
    sentenceCount > 0 ? Math.round((wordCount / sentenceCount) * 10) / 10 : 0;

  // --- Signal 1: AI phrase patterns (weight 25) ---
  const { raw: phraseScore, flagged: flaggedPhrases } = scoreAiPhrases(text);

  // --- Signal 2: Burstiness (weight 20) ---
  const { raw: burstyScore, burstiness } = scoreBurstiness(sentences);

  // --- Signal 3: Lexical diversity / TTR (weight 20) ---
  const { raw: ttrScore, ttr } = scoreLexicalDiversity(words);

  // --- Signal 4: Passive voice ratio (weight 15) ---
  const { raw: passiveScore, ratio: passiveVoiceRatio } = scorePassiveVoice(text, sentences);

  // --- Signal 5: Sentence length uniformity (weight 10) ---
  const uniformityScore = scoreSentenceLengthUniformity(sentences);

  // --- Signal 6: Personal pronoun density (weight 10) ---
  const pronounScore = scorePersonalPronounDensity(words);

  // Sum: max possible = 25 + 20 + 20 + 15 + 10 + 10 = 100
  const rawScore =
    phraseScore + burstyScore + ttrScore + passiveScore + uniformityScore + pronounScore;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  let label: DetectionResult["label"];
  if (score <= 35) {
    label = "Likely Human";
  } else if (score <= 65) {
    label = "Possibly AI";
  } else {
    label = "Likely AI";
  }

  let confidence: DetectionResult["confidence"];
  if (score < 20 || score > 80) {
    confidence = "High";
  } else if (score < 35 || score > 65) {
    confidence = "Medium";
  } else {
    confidence = "Low";
  }

  const breakdown: DetectionResult["breakdown"] = [
    {
      signal: "AI Phrase Patterns",
      weight: phraseScore,
      explanation:
        flaggedPhrases.length > 0
          ? `Detected ${flaggedPhrases.length} common AI writing pattern(s): ${flaggedPhrases.slice(0, 3).join(", ")}${flaggedPhrases.length > 3 ? "…" : ""}`
          : "No common AI transition phrases or filler openers detected.",
    },
    {
      signal: "Sentence Burstiness",
      weight: burstyScore,
      explanation:
        burstiness < 5
          ? `Very uniform sentence lengths (std dev ${burstiness}). AI typically writes with consistent length sentences.`
          : burstiness < 10
          ? `Moderate variation in sentence lengths (std dev ${burstiness}).`
          : `High variation in sentence lengths (std dev ${burstiness}) — a human-writing indicator.`,
    },
    {
      signal: "Lexical Diversity",
      weight: ttrScore,
      explanation: `Type-Token Ratio: ${(ttr * 100).toFixed(1)}%. ${
        ttr >= 0.55 && ttr <= 0.70
          ? "Falls in the AI-typical range (55–70%)."
          : ttr > 0.80
          ? "Very high diversity — suggests human authorship."
          : "Outside the typical AI range."
      }`,
    },
    {
      signal: "Passive Voice Usage",
      weight: passiveScore,
      explanation: `Passive voice ratio: ${(passiveVoiceRatio * 100).toFixed(1)}% of sentences. ${
        passiveVoiceRatio > 0.25
          ? "Elevated passive voice is associated with AI-generated text."
          : "Passive voice within normal range."
      }`,
    },
    {
      signal: "Sentence Length Uniformity",
      weight: uniformityScore,
      explanation:
        uniformityScore > 6
          ? "High proportion of sentences fall in the 20–30 word AI sweet spot."
          : uniformityScore > 0
          ? "Moderate concentration of sentences in the AI-typical length range."
          : "Sentence lengths vary widely — more consistent with human writing.",
    },
    {
      signal: "Personal Pronoun Density",
      weight: pronounScore,
      explanation:
        pronounScore > 6
          ? "Very few first-person pronouns (I, my, we, our). AI-generated text typically avoids personal voice."
          : pronounScore > 0
          ? "Low personal pronoun usage detected."
          : "Normal personal pronoun usage — consistent with human authorship.",
    },
  ];

  return {
    score,
    label,
    confidence,
    breakdown,
    flaggedPhrases,
    stats: {
      wordCount,
      sentenceCount,
      avgSentenceLength,
      lexicalDiversity: Math.round(ttr * 1000) / 10,
      passiveVoiceRatio: Math.round(passiveVoiceRatio * 1000) / 10,
      burstiness,
    },
  };
}
