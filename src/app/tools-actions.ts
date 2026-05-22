"use server";

import { detectAi, type DetectionResult } from "@/lib/ai-detector";

export type DetectorState = {
  result: DetectionResult | null;
  error: string;
  inputText: string;
};

export async function analyseTextAction(
  _prev: DetectorState,
  formData: FormData
): Promise<DetectorState> {
  const text = ((formData.get("text") as string | null) ?? "").trim();

  if (!text) {
    return { result: null, error: "Please paste some text to analyse.", inputText: text };
  }

  const wordCount = text
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  if (wordCount < 50) {
    return {
      result: null,
      error: `Please provide at least 50 words for a reliable analysis. You have ${wordCount} word${wordCount === 1 ? "" : "s"}.`,
      inputText: text,
    };
  }

  const result = detectAi(text);

  return { result, error: "", inputText: text };
}
