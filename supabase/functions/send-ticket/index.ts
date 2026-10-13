import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

// Public endpoint: it only accepts a ticket token and emails that attendee once,
// so a caller can never choose the recipient or resend repeatedly.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return json({ sent: false, reason: "email_not_configured" });

  let token = "";
  try {
    token = String((await req.json()).token ?? "");
  } catch {
    return json({ error: "invalid_body" }, 400);
  }
  if (!UUID.test(token)) return json({ error: "invalid_token" }, 400);

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const { data: attendee, error } = await admin
    .from("attendees")
    .update({ email_sent_at: new Date().toISOString() })
    .eq("ticket_token", token)
    .is("email_sent_at", null)
    .select("first_name, last_name, email, company, code")
    .maybeSingle();

  if (error) return json({ error: "lookup_failed" }, 500);
  if (!attendee) return json({ sent: false, reason: "already_sent_or_missing" });

  const siteUrl = Deno.env.get("SITE_URL") ?? "https://effie.com.py";
  const from = Deno.env.get("EMAIL_FROM") ?? "Effie Paraguay <entradas@effie.com.py>";
  const link = `${siteUrl}/entradas/ticket?t=${token}`;
  const qrImageUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/qr-image?t=${token}`;
  const name = escapeHtml(attendee.first_name);

  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;color:#ffffff">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#111111;border:1px solid #3a3220;border-radius:20px">
<tr><td style="padding:32px">
<p style="margin:0 0 8px;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#B89650">Entrada exonerada</p>
<h1 style="margin:0 0 20px;font-size:24px;font-weight:normal;color:#ffffff">Premiación Effie Paraguay 2026</h1>
<p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:#B8B8B8">Hola ${name}, tu entrada está confirmada.</p>
<p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#B8B8B8">Jueves 15 de octubre · Convocatoria 19:30 h<br>Rogelio<br>Dress code: Business casual</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:8px 0 20px">
<table role="presentation" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px"><tr><td style="padding:12px">
<img src="${qrImageUrl}" width="220" height="220" alt="Código QR de tu entrada, mostralo en la puerta" style="display:block;width:220px;height:220px">
</td></tr></table>
</td></tr></table>
<p style="margin:0 0 24px;font-size:13px;letter-spacing:2px;text-align:center;color:#999999">${escapeHtml(attendee.code)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<a href="${link}" style="display:inline-block;background:#B89650;color:#000000;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:bold">Ver mi entrada en la web</a>
</td></tr></table>
<p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#999999">En la puerta mostrá este QR (si no se ve la imagen, tocá el botón de arriba) o decí tu nombre.</p>
</td></tr></table></td></tr></table></body></html>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: attendee.email,
      subject: "Tu entrada para la Premiación Effie Paraguay 2026",
      html,
      text: `Hola ${attendee.first_name}, tu entrada está confirmada. Jueves 15 de octubre, 19:30 h, Rogelio. Dress code: Business casual. Ver entrada con tu QR: ${link}`,
    }),
  });

  if (!response.ok) {
    await admin.from("attendees").update({ email_sent_at: null }).eq("ticket_token", token);
    const detail = await response.text().catch(() => "");
    console.error("resend_error", response.status, detail);
    return json({ sent: false, reason: "provider_error", status: response.status, detail }, 502);
  }

  return json({ sent: true });
});
