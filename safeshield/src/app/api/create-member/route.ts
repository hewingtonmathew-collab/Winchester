import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side admin endpoint for provisioning member accounts.
// Uses the service-role key (never exposed to the browser) so it can:
//   - create users without email confirmation
//   - bypass client-side email validation quirks
//   - NOT disturb the calling admin's own session
//
// The caller must be the super admin (verified via their access token).
export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceKey || !anonKey) {
    return NextResponse.json(
      { error: "Server is missing Supabase configuration (SUPABASE_SERVICE_ROLE_KEY)." },
      { status: 500 }
    );
  }

  // 1. Verify the caller is the super admin via their bearer token.
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const anon = createClient(url, anonKey);
  const { data: userData, error: userErr } = await anon.auth.getUser(token);
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "Invalid session." }, { status: 401 });
  }
  const role = (userData.user.app_metadata as { role?: string } | undefined)?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Only the super admin can create members." }, { status: 403 });
  }

  // 2. Parse + validate the request body.
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  // 3. Create the user with the service-role (admin) client.
  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // mark confirmed so they can log in immediately
    user_metadata: { full_name: name },
  });
  if (createErr || !created.user) {
    return NextResponse.json(
      { error: createErr?.message ?? "Could not create user." },
      { status: 400 }
    );
  }

  const userId = created.user.id;

  // 4. Ensure the profile is active with their name (trigger may have created the row).
  await admin
    .from("profiles")
    .update({ status: "active", full_name: name })
    .eq("id", userId);

  return NextResponse.json({
    user: { id: userId, email, full_name: name },
  });
}
