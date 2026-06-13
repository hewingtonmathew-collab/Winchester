import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages, context } = await req.json();

  const systemPrompt = `You are a senior education compliance consultant writing formal advisory reports for UK school headteachers and governors. Your tone is authoritative, precise, and professional — like a QC barrister or Big Four consultant advising a client. Write in clear, confident prose. No bullet-point padding, no filler phrases like "it is important to note". Every sentence must add value. Reference specific UK legislation, statutory guidance, and official framework URLs where relevant. ${context ? `Context: ${context}` : ""}`;

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
