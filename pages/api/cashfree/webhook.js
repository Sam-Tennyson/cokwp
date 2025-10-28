import crypto from "crypto";
import { verifyWebhookSignature } from "../../../services/cashfree-backend-pg";
import { supabase } from "../../../services/supabase";

export const config = {
  api: {
    bodyParser: false,
  },
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function normalizeType(type) {
  return String(type || "").trim().toUpperCase();
}

function extractOrderId(payload) {
  return (
    payload?.data?.order?.order_id ||
    payload?.data?.order_id ||
    payload?.order_id ||
    payload?.data?.payment?.order_id ||
    null
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const raw = await getRawBody(req);              // Buffer (exact bytes)
    const bodyUtf8 = raw.toString("utf8");         // string interpretation
    const bodyHex = raw.toString("hex");           // hex for byte-level diff

    const timestamp = req.headers["x-webhook-timestamp"];
    const signature = req.headers["x-webhook-signature"];
    const contentEncoding = req.headers["content-encoding"] || "none";

    if (!timestamp || !signature) {
      return res.status(400).json({ error: "Missing webhook headers" });
    }

    let event;
    //  Add meaningful logs here
    console.log("Signature verification started");
    try {
      event = verifyWebhookSignature(signature, bodyUtf8, String(timestamp));
      console.log("Signature verification successful");
    } catch (e) {
      console.log("Signature verification failed");
      console.warn("Cashfree webhook signature verification failed:", e?.message);
      return res.status(401).json({ error: "Invalid signature" });
    }

    // Minimal logging; toggle verbose via env if needed
    if (String(process.env.CASHFREE_WEBHOOK_DEBUG || "false").toLowerCase() === "true") {
      console.log("=== WEBHOOK DEBUG START ===");
      console.log("content-encoding:", contentEncoding);
      console.log("timestamp header:", timestamp);
      console.log("signature header:", signature);
      console.log("raw body length (bytes):", raw.length);
      console.log("raw body hex (first 300 chars):", bodyHex.slice(0, 300));
      console.log("event type:", event?.type);
      console.log("=== WEBHOOK DEBUG END ===");
    }

    // Process event types and update purchases
    // Reference: event.object has the parsed body
    try {
      const payload = event?.object || {};
      const rawType = event?.type;
      const type = normalizeType(rawType);
      const orderId = extractOrderId(payload);

      if (type === "PAYMENT_SUCCESS_WEBHOOK" || type === "PAYMENT_SUCCESS" || type === "ORDER_PAID") {
        if (!orderId) {
          console.warn("[Webhook] Success event missing order_id", { type, payload });
        } else {
          console.log("[Webhook] Marking purchase success", { type, orderId });
          const { error: updateErr } = await supabase
            .from("purchases")
            .update({ payment_status: "success", updated_at: new Date().toISOString() })
            .eq("transaction_id", orderId);
          if (updateErr) console.error("[Webhook] Failed to mark purchase success:", updateErr);
        }
      } else if (type === "PAYMENT_FAILED_WEBHOOK" || type === "PAYMENT_FAILED" || type === "ORDER_FAILED") {
        if (!orderId) {
          console.warn("[Webhook] Failure event missing order_id", { type, payload });
        } else {
          console.log("[Webhook] Marking purchase failed", { type, orderId });
          const { error: updateErr } = await supabase
            .from("purchases")
            .update({ payment_status: "failed", updated_at: new Date().toISOString() })
            .eq("transaction_id", orderId);
          if (updateErr) console.error("[Webhook] Failed to mark purchase failed:", updateErr);
        }
      } else if (type === "PAYMENT_CHARGES_WEBHOOK") {
        // Informational; no DB update required
        console.log("[Webhook] Charges update received", {
          type,
          orderId,
          amount: payload?.data?.payment?.payment_amount || payload?.data?.charges?.amount,
          currency: payload?.data?.payment?.payment_currency || payload?.data?.charges?.currency,
        });
      } else {
        console.log("[Webhook] Unhandled event type", { type, orderId });
      }
    } catch (procErr) {
      console.error("[Webhook] Error processing event:", procErr);
      // Do not fail the webhook for processing errors; signature verified
    }

    return res.status(200).json({ ok: true, type: event?.type });
  } catch (err) {
    console.error("Webhook debug error:", err);
    return res.status(500).json({ error: err.message });
  }
}
