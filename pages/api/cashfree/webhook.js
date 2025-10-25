// Cashfree Webhook endpoint (sandbox/demo)
// Note: For production, verify webhook signatures per Cashfree docs.

// Disable body parsing to handle raw body if needed for signature verification
export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  // CRITICAL: Log request details to debug 308 redirect issue
  console.log("[Cashfree Webhook] === WEBHOOK REQUEST RECEIVED ===");
  console.log("[Cashfree Webhook] Method:", req.method);
  console.log("[Cashfree Webhook] URL:", req.url);
  console.log("[Cashfree Webhook] Host:", req.headers.host);
  console.log("[Cashfree Webhook] User-Agent:", req.headers['user-agent']);
  console.log("[Cashfree Webhook] Content-Type:", req.headers['content-type']);
  
  // Log all incoming requests for debugging
  console.log("[Cashfree Webhook] Full headers:", req.headers);
  console.log("[Cashfree Webhook] Query params:", req.query);

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


