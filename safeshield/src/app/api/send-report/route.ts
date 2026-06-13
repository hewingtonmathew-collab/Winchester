import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
  }

  const { to, subject, html, type } = await req.json() as {
    to: string[];
    subject: string;
    html: string;
    type: "report" | "certificate";
  };

  if (!to || to.length === 0) {
    return NextResponse.json({ error: "No recipients provided" }, { status: 400 });
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "SafeShield <noreply@safeshield-tool-app.vercel.app>",
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
