import crypto from "crypto";

// ✅ Disable body parsing (very important!)
export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ Helper to read raw body from request
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = [];
    req.on("data", (chunk) => data.push(chunk));
    req.on("end", () => resolve(Buffer.concat(data)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawBody = await getRawBody(req);
  const bodyString = rawBody.toString("utf8");

  const timestamp = req.headers["x-webhook-timestamp"];
  const signature = req.headers["x-webhook-signature"];
  const secretKey = process.env.CASHFREE_WEBHOOK_SECRET;

  if (!timestamp || !signature || !secretKey) {
    console.error("❌ Missing headers or secret key");
    return res.status(400).json({ error: "Missing headers or secret key" });
  }

  // ✅ Create expected signature
  const expected = crypto
    .createHmac("sha256", secretKey)
    .update(timestamp + bodyString)
    .digest("base64");

  if (expected !== signature) {
    console.error("❌ Invalid signature");
    console.log("Expected:", expected);
    console.log("Received:", signature);
    return res.status(401).json({ error: "Invalid signature" });
  }

  console.log("✅ Webhook signature verified");
  const data = JSON.parse(bodyString);
  console.log("📦 Webhook Data:", data);

  // TODO: Handle events here
  // Example:
  // if (data.type === "PAYMENT_SUCCESS_WEBHOOK") { ... }

  return res.status(200).json({ received: true });
}
