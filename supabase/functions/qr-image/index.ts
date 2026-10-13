import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import QRCode from "npm:qrcode@1.5.4";

// Renders the same ticket-URL QR the web page shows, as a PNG, so it can be embedded
// directly in the confirmation email (no click required to see it).
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method !== "GET") return new Response("method_not_allowed", { status: 405 });

  const token = new URL(req.url).searchParams.get("t") ?? "";
  if (!UUID.test(token)) return new Response("invalid_token", { status: 400 });

  const siteUrl = Deno.env.get("SITE_URL") ?? "https://effie.com.py";
  const ticketUrl = `${siteUrl}/entradas/ticket?t=${token}`;

  const png = await QRCode.toBuffer(ticketUrl, { margin: 1, width: 480, errorCorrectionLevel: "M" });

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
