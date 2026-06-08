import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages, context } = await req.json();

  const systemPrompt = `You are SafeShield AI, a specialist school compliance consultant. You help UK school leaders with safeguarding, Ofsted readiness, data protection (GDPR/UK GDPR), health & safety, governance, and digital standards. Be concise, practical, and reference UK legislation and frameworks (KCSIE, EIF, DfE standards) where relevant. ${context ? `User context: ${context}` : ""}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SAFE_SHILED_APP_CHAT_GPT}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 4096,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: err }, { status: response.status });
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  return NextResponse.json({ text });
}
