import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

// Admin-only: verifies the caller is an admin (via their own JWT) before using the
// service-role key to create/invite a staff account and set their role.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const ROLES = new Set(["admin", "door"]);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const authHeader = req.headers.get("Authorization") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const caller = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
  const { data: isAdmin } = await caller.rpc("is_admin");
  if (!isAdmin) return json({ error: "forbidden" }, 403);

  let email = "";
  let role = "";
  try {
    const body = await req.json();
    email = String(body.email ?? "").trim().toLowerCase();
    role = String(body.role ?? "");
  } catch {
    return json({ error: "invalid_body" }, 400);
  }
  if (!EMAIL.test(email)) return json({ error: "invalid_email" }, 400);
  if (!ROLES.has(role)) return json({ error: "invalid_role" }, 400);

  const admin = createClient(supabaseUrl, serviceKey);

  const { error: createError } = await admin.auth.admin.createUser({ email, email_confirm: true });
  if (createError && !createError.message.toLowerCase().includes("already")) {
    return json({ error: createError.message }, 400);
  }

  const { error: staffError } = await admin.from("staff").upsert({ email, role }, { onConflict: "email" });
  if (staffError) return json({ error: staffError.message }, 400);

  const siteUrl = Deno.env.get("SITE_URL") ?? "https://effie.com.py";
  const { error: linkError } = await admin.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/entradas/set-password`,
  });

  return json({ added: true, email_sent: !linkError });
});
