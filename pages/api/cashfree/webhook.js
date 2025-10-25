// Cashfree Webhook endpoint (sandbox/demo)
// Note: For production, verify webhook signatures per Cashfree docs.

export default async function handler(req, res) {
  // Log all incoming requests for debugging
  console.log("[Cashfree Webhook] Received request:", {
    method: req.method,
    headers: req.headers,
    query: req.query,
  });

  if (req.method !== "POST") {
    console.log("[Cashfree Webhook] Method not allowed:", req.method);
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const event = req.body || {};
    
    // Detailed logging for debugging
    console.log("[Cashfree Webhook] Event received:");
    console.log("[Cashfree Webhook] Full body:", JSON.stringify(event, null, 2));
    console.log("[Cashfree Webhook] Event type:", event.type);
    console.log("[Cashfree Webhook] Order ID:", event.data?.order?.order_id);
    console.log("[Cashfree Webhook] Payment status:", event.data?.payment?.payment_status);

    // Process different event types
    if (event.type === "PAYMENT_SUCCESS_WEBHOOK") {
      console.log("[Cashfree Webhook] ✅ Payment successful!");
    } else if (event.type === "PAYMENT_FAILED_WEBHOOK") {
      console.log("[Cashfree Webhook] ❌ Payment failed!");
    } else {
      console.log("[Cashfree Webhook] ℹ️ Other event:", event.type);
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({ received: true, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("[Cashfree Webhook] Error processing webhook:", err);
    res.status(500).json({ message: "Webhook handling error" });
  }
}


