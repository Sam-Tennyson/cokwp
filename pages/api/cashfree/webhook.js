// Cashfree Webhook endpoint (sandbox/demo)
// Note: For production, verify webhook signatures per Cashfree docs.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const event = req.body || {};
    // Minimal logging for demo visibility
    console.log("[Cashfree Webhook]", JSON.stringify(event));

    res.status(200).json({ received: true });
  } catch (err) {
    res.status(500).json({ message: "Webhook handling error" });
  }
}


