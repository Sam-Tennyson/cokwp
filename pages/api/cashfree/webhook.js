import { supabase } from "../../../services/supabase";
import crypto from "crypto";

/**
 * Cashfree Webhook Handler
 * 
 * Handles payment webhook events from Cashfree Payment Gateway
 * 
 * Required Webhook Events (Subscribe to these in Cashfree Dashboard):
 * - PAYMENT_SUCCESS_WEBHOOK: Payment completed successfully
 * - PAYMENT_FAILED_WEBHOOK: Payment failed or declined (optional but recommended)
 * - PAYMENT_USER_DROPPED_WEBHOOK: User abandoned payment (optional for analytics)
 * 
 * Actual Payload Structure:
 * {
 *   "data": {
 *     "order": { "order_id", "order_amount", "order_currency" },
 *     "payment": { "cf_payment_id", "payment_status", "payment_method", etc. },
 *     "customer_details": { "customer_name", "customer_email", etc. },
 *     "charges_details": { "service_charge", "settlement_amount", etc. }
 *   },
 *   "event_time": "2025-10-25T15:47:06+05:30",
 *   "type": "PAYMENT_SUCCESS_WEBHOOK"
 * }
 */

// Disable body parsing to handle raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

/**
 * Verifies webhook signature from Cashfree
 * Important: Always verify signatures in production to prevent fake webhooks
 * 
 * @param {string} rawBody - Raw request body as string
 * @param {string} signature - Signature from x-webhook-signature header
 * @param {string} timestamp - Timestamp from x-webhook-timestamp header
 * @returns {boolean} - True if signature is valid
 */
function verifyWebhookSignature(rawBody, signature, timestamp) {
  const webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET;

  // Skip verification if webhook secret is not configured (sandbox mode)
  if (!webhookSecret) {
    console.warn("[Webhook] ⚠️ CASHFREE_WEBHOOK_SECRET not configured - Skipping signature verification");
    return true;
  }

  try {
    console.log("[Webhook] 🔍 Signature Debug Info:");
    console.log("[Webhook] ├─ Webhook Secret:", webhookSecret);
    console.log("[Webhook] ├─ Webhook Secret Length:", webhookSecret.length);
    console.log("[Webhook] ├─ Timestamp:", timestamp);
    console.log("[Webhook] ├─ Raw Body (first 200 chars):", rawBody.substring(0, 200));
    console.log("[Webhook] ├─ Raw Body (last 50 chars):", rawBody.substring(rawBody.length - 50));

    // Try different signature formats that Cashfree might use
    // In your current verifyWebhookSignature function, replace the formats array with:
    const formats = [
      {
        name: "timestamp(seconds) + rawBody",
        value: Math.floor(parseInt(timestamp) / 1000).toString() + rawBody
      },
      {
        name: "timestamp(milliseconds) + rawBody",
        value: timestamp + rawBody
      },
    ];

    console.log("[Webhook] 🧪 Testing different signature formats:");

    for (const format of formats) {
      const testSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(format.value)
        .digest("base64");

      console.log(`[Webhook] ├─ Format: ${format.name}`);
      console.log(`[Webhook] │  └─ Generated: ${testSignature}`);

      if (testSignature === signature) {
        console.log(`[Webhook] ✅ MATCH FOUND with format: ${format.name}`);
        return true;
      }
    }

    // None matched
    console.error("[Webhook] ❌ No signature format matched!");
    console.error("[Webhook] Received signature:", signature);
    console.error("[Webhook] Timestamp:", timestamp);
    console.error("[Webhook] Raw Body Length:", rawBody.length);

    return false;
  } catch (err) {
    console.error("[Webhook] Error during signature verification:", err);
    return false;
  }
}

/**
 * Reads raw body from request stream
 * Required for webhook signature verification
 */
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk.toString();
    });
    req.on("end", () => {
      resolve(data);
    });
    req.on("error", reject);
  });
}

/**
 * Updates purchase record in Supabase with payment details
 * 
 * @param {string} orderId - Transaction/order ID from Cashfree
 * @param {string} status - Payment status ('success', 'failed', 'abandoned')
 * @param {object} webhookData - Full webhook data containing payment, customer, and charges details
 * @returns {Promise<object>} - Result object with success status
 */
async function updatePurchaseStatus(orderId, status, webhookData = {}) {
  try {
    console.log(`[Webhook] Updating purchase status: ${orderId} → ${status}`);

    const { payment = {}, customer_details = {}, charges_details = {} } = webhookData;

    // Prepare update data
    const updateData = {
      payment_status: status,
      updated_at: new Date().toISOString(),
    };

    // Add payment completion timestamp for successful payments
    if (status === "success" && payment.payment_time) {
      updateData.payment_completed_at = payment.payment_time;
    }

    // Store Cashfree payment ID for reference and refunds
    if (payment.cf_payment_id) {
      updateData.cashfree_payment_id = payment.cf_payment_id.toString();
    }

    // Store payment method details (card, UPI, etc.)
    if (payment.payment_method) {
      updateData.payment_method = payment.payment_method;
    }

    // Store payment group (credit_card, debit_card, upi, netbanking, etc.)
    if (payment.payment_group) {
      updateData.payment_group = payment.payment_group;
    }

    // Store bank reference for reconciliation
    if (payment.bank_reference) {
      updateData.bank_reference = payment.bank_reference;
    }

    // Store settlement amount (actual amount after deducting charges)
    if (charges_details.settlement_amount) {
      updateData.settlement_amount = charges_details.settlement_amount;
      updateData.service_charge = charges_details.service_charge;
    }

    // Store failure reason if payment failed
    if (status === "failed" && payment.payment_message) {
      updateData.failure_reason = payment.payment_message;
    }

    console.log("[Webhook] Update data:", JSON.stringify(updateData, null, 2));

    // Update purchase record in Supabase
    const { data, error } = await supabase
      .from("purchases")
      .update(updateData)
      .eq("transaction_id", orderId)
      .select();

    if (error) {
      console.error("[Webhook] ❌ Supabase update error:", error);
      return { success: false, error };
    }

    if (!data || data.length === 0) {
      console.error(`[Webhook] ⚠️ No purchase record found for order_id: ${orderId}`);
      return { success: false, error: "Purchase record not found" };
    }

    console.log("[Webhook] ✅ Purchase updated successfully:", data[0]);
    return { success: true, data: data[0] };
  } catch (err) {
    console.error("[Webhook] ❌ Error updating purchase:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Main webhook handler
 * Processes incoming webhook events from Cashfree
 */
export default async function handler(req, res) {
  const startTime = Date.now();
  console.log("\n[Webhook] ╔═══════════════════════════════════════════════════════════");
  console.log("[Webhook] ║ CASHFREE WEBHOOK RECEIVED");
  console.log("[Webhook] ╠═══════════════════════════════════════════════════════════");
  console.log("[Webhook] ║ Method:", req.method);
  console.log("[Webhook] ║ URL:", req.url);
  console.log("[Webhook] ║ Timestamp:", new Date().toISOString());
  console.log("[Webhook] ╚═══════════════════════════════════════════════════════════\n");

  // Only allow POST requests
  if (req.method !== "POST") {
    console.error("[Webhook] ❌ Method not allowed:", req.method);
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed - Only POST requests are accepted"
    });
  }

  try {
    // Read raw body for signature verification
    const rawBody = await getRawBody(req);
    console.log("[Webhook] 📦 Raw Body Length:", rawBody.length);

    // Log all headers to debug
    console.log("[Webhook] 📋 All Request Headers:");
    Object.keys(req.headers).forEach(key => {
      if (key.toLowerCase().includes('webhook') || key.toLowerCase().includes('signature') || key.toLowerCase().includes('timestamp')) {
        console.log(`[Webhook] ├─ ${key}: ${req.headers[key]}`);
      }
    });

    // Extract signature headers (try both casings)
    const signature = req.headers["x-webhook-signature"] || req.headers["X-Webhook-Signature"];
    const timestamp = req.headers["x-webhook-timestamp"] || req.headers["X-Webhook-Timestamp"];

    console.log("[Webhook] 🔐 Verifying webhook signature...");
    console.log("[Webhook] ├─ Environment:", process.env.NODE_ENV || "development");
    console.log("[Webhook] ├─ Signature:", signature ? "Present" : "Missing");
    console.log("[Webhook] ├─ Timestamp:", timestamp ? timestamp : "Missing");
    console.log("[Webhook] └─ Secret Configured:", process.env.CASHFREE_WEBHOOK_SECRET ? "Yes" : "No");

    // TEMPORARY: Skip signature verification for debugging

    // TODO: Re-enable after confirming correct webhook secret and format
    console.warn("[Webhook] ⚠️⚠️⚠️ SIGNATURE VERIFICATION TEMPORARILY DISABLED ⚠️⚠️⚠️");
    console.warn("[Webhook] This is INSECURE and should be fixed ASAP!");

    // Always verify signature if headers are present
    if (signature && timestamp) {
      const isValid = verifyWebhookSignature(rawBody, signature, timestamp);

      if (!isValid) {
        console.error("[Webhook] ⚠️ Invalid webhook signature - but continuing anyway (TEMPORARY)");
        // TEMPORARILY commenting out the rejection to test webhook processing
        return res.status(401).json({ 
          success: false,
          message: "Invalid webhook signature" 
        });
      } else {
        console.log("[Webhook] ✅ Signature verified successfully");
      }
    }

    // Parse webhook payload from raw body
    const webhookPayload = JSON.parse(rawBody);

    if (!webhookPayload || !webhookPayload.type) {
      console.error("[Webhook] ❌ Invalid payload - missing 'type' field");
      return res.status(400).json({
        success: false,
        message: "Invalid webhook payload"
      });
    }

    const eventType = webhookPayload.type;
    const eventTime = webhookPayload.event_time;
    const webhookData = webhookPayload.data || {};

    // Log webhook details
    console.log("[Webhook] 📋 Event Type:", eventType);
    console.log("[Webhook] 🕐 Event Time:", eventTime);
    console.log("[Webhook] 📦 Full Payload:");
    console.log(JSON.stringify(webhookPayload, null, 2));

    // Extract order details
    const order = webhookData.order || {};
    const payment = webhookData.payment || {};
    const orderId = order.order_id;
    const orderAmount = order.order_amount;
    const paymentStatus = payment.payment_status;

    if (!orderId) {
      console.error("[Webhook] ❌ Missing order_id in webhook payload");
      return res.status(400).json({
        success: false,
        message: "Missing order_id in webhook payload"
      });
    }

    console.log("\n[Webhook] 💳 Payment Details:");
    console.log(`[Webhook] ├─ Order ID: ${orderId}`);
    console.log(`[Webhook] ├─ Amount: ₹${orderAmount}`);
    console.log(`[Webhook] ├─ Payment Status: ${paymentStatus}`);
    console.log(`[Webhook] └─ Payment Method: ${payment.payment_group || 'N/A'}\n`);

    // Handle different webhook event types
    let updateResult;

    switch (eventType) {
      case "PAYMENT_SUCCESS_WEBHOOK":
        console.log("[Webhook] ✅ Processing PAYMENT SUCCESS");
        console.log(`[Webhook] 💰 Payment of ₹${orderAmount} received successfully`);

        if (payment.payment_method?.card) {
          console.log(`[Webhook] 💳 Card: ${payment.payment_method.card.card_network} ending ${payment.payment_method.card.card_number}`);
        }

        updateResult = await updatePurchaseStatus(orderId, "success", webhookData);
        break;

      case "PAYMENT_FAILED_WEBHOOK":
        console.log("[Webhook] ❌ Processing PAYMENT FAILED");
        console.log(`[Webhook] 💔 Payment failed: ${payment.payment_message || 'Unknown reason'}`);

        updateResult = await updatePurchaseStatus(orderId, "failed", webhookData);
        break;

      case "PAYMENT_USER_DROPPED_WEBHOOK":
        console.log("[Webhook] 🚪 Processing USER DROPPED");
        console.log("[Webhook] User abandoned the payment page");

        updateResult = await updatePurchaseStatus(orderId, "abandoned", webhookData);
        break;

      case "PAYMENT_CHARGES_WEBHOOK":
        console.log("[Webhook] 💵 Processing PAYMENT CHARGES");
        console.log(`[Webhook] Service Charge: ₹${webhookData.charges_details?.service_charge || 0}`);
        console.log(`[Webhook] Settlement Amount: ₹${webhookData.charges_details?.settlement_amount || 0}`);

        // This webhook is informational - update charges if payment is already successful
        if (paymentStatus === "SUCCESS") {
          updateResult = await updatePurchaseStatus(orderId, "success", webhookData);
        } else {
          console.log("[Webhook] ℹ️ Charges webhook received but payment not successful yet");
          updateResult = { success: true, skipped: true };
        }
        break;

      default:
        console.log(`[Webhook] ℹ️ Unhandled webhook event type: ${eventType}`);
        console.log("[Webhook] ℹ️ This event type is not critical for course purchases");
        updateResult = { success: true, skipped: true };
    }

    // Log the result
    const processingTime = Date.now() - startTime;

    if (updateResult.success) {
      console.log("\n[Webhook] ╔═══════════════════════════════════════════════════════════");
      console.log("[Webhook] ║ ✅ WEBHOOK PROCESSED SUCCESSFULLY");
      console.log("[Webhook] ╠═══════════════════════════════════════════════════════════");
      console.log(`[Webhook] ║ Order ID: ${orderId}`);
      console.log(`[Webhook] ║ Processing Time: ${processingTime}ms`);
      console.log("[Webhook] ╚═══════════════════════════════════════════════════════════\n");
    } else {
      console.error("\n[Webhook] ╔═══════════════════════════════════════════════════════════");
      console.error("[Webhook] ║ ⚠️ WEBHOOK PROCESSING FAILED");
      console.error("[Webhook] ╠═══════════════════════════════════════════════════════════");
      console.error(`[Webhook] ║ Order ID: ${orderId}`);
      console.error(`[Webhook] ║ Error: ${updateResult.error}`);
      console.error("[Webhook] ╚═══════════════════════════════════════════════════════════\n");
    }

    // Always return 200 OK to prevent Cashfree from retrying
    // Even if there's an error, we acknowledge receipt and log it
    return res.status(200).json({
      success: true,
      received: true,
      orderId: orderId,
      eventType: eventType,
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    const processingTime = Date.now() - startTime;
    console.error("\n[Webhook] ╔═══════════════════════════════════════════════════════════");
    console.error("[Webhook] ║ ❌ WEBHOOK PROCESSING ERROR");
    console.error("[Webhook] ╠═══════════════════════════════════════════════════════════");
    console.error("[Webhook] ║ Error:", err.message);
    console.error("[Webhook] ║ Stack:", err.stack);
    console.error("[Webhook] ╚═══════════════════════════════════════════════════════════\n");

    // Return 200 even on error to prevent retries for malformed data
    // The error is logged for manual investigation
    return res.status(200).json({
      success: true,
      received: true,
      error: "Processing error logged - will be investigated",
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    });
  }
}


