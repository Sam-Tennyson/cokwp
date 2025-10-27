import crypto from "crypto";

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
    const secret = process.env.CASHFREE_WEBHOOK_SECRET || "<MISSING>";

    // compute HMAC from timestamp + raw bytes
    const toSign = String(timestamp) + bodyUtf8;

    const computed = crypto
      .createHmac("sha256", secret)
      .update(toSign)
      .digest("base64");

    // Also compute raw-bytes HMAC for comparison (Buffer based)
    const computedBuf = crypto
      .createHmac("sha256", secret)
      .update(Buffer.concat([Buffer.from(String(timestamp), "utf8"), raw]))
      .digest();

    const computedBase64FromBuf = computedBuf.toString("base64");

    // Logs (these will appear in Vercel / server logs)
    console.log("=== WEBHOOK DEBUG START ===");
    console.log("content-encoding:", contentEncoding);
    console.log("timestamp header:", timestamp);
    console.log("signature header:", signature);
    console.log("secret present?:", secret !== "<MISSING>");
    console.log("raw body length (bytes):", raw.length);
    console.log("raw body utf8 string:", bodyUtf8);
    console.log("raw body hex (first 300 chars):", bodyHex.slice(0, 300));
    console.log("toSign (first 300 chars):", (String(timestamp) + bodyUtf8).slice(0, 300));
    console.log("computed (string .digest('base64')):", computed);
    console.log("computed (from Buffer concat .toString('base64')):", computedBase64FromBuf);
    console.log("expected == computed ?: ", signature === computed || signature === computedBase64FromBuf);
    console.log("=== WEBHOOK DEBUG END ===");

    // Return debug info to caller (optional - you can remove in prod)
    return res.status(200).json({
      ok: true,
      debug: {
        contentEncoding,
        timestamp,
        signature,
        computed,
        computedBase64FromBuf,
        rawLength: raw.length,
      },
    });
  } catch (err) {
    console.error("Webhook debug error:", err);
    return res.status(500).json({ error: err.message });
  }
}
