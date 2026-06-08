import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { messages, context } = await req.json();
  const msg = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 4096,
    system: `You are SafeShield AI, a specialist school compliance consultant. You help UK school leaders with safeguarding, Ofsted readiness, data protection (GDPR/UK GDPR), health & safety, governance, and digital standards. Be concise, practical, and reference UK legislation and frameworks (KCSIE, EIF, DfE standards) where relevant. ${context ? `User context: ${context}` : ""}`,
    messages,
  });
  const text = msg.content[0].type === "text" ? msg.content[0].text : "";
  return NextResponse.json({ text });
}
