import crypto from "crypto";
import { verifyWebhookSignature } from "../../../services/cashfree-backend-pg";

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

    // Process event here as needed. For now, acknowledge receipt.
    return res.status(200).json({ ok: true, type: event?.type });
  } catch (err) {
    console.error("Webhook debug error:", err);
    return res.status(500).json({ error: err.message });
  }
}
