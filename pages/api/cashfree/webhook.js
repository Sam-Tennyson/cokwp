// import { supabase } from "../../../services/supabase";
// import crypto from "crypto";

// // Disable body parsing to handle raw body for signature verification
// export const config = {
//   api: {
//     bodyParser: false,
//     externalResolver: true,
//   },
// };

// /**
//  * Verifies webhook signature from Cashfree
//  * FIXED: Uses the correct signature format as per Cashfree documentation
//  */
// function verifyWebhookSignature(rawBody, signature, timestamp) {
//   const webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET;

//   if (!webhookSecret) {
//     console.warn("[Webhook] ⚠️ CASHFREE_WEBHOOK_SECRET not configured - Skipping signature verification");
//     return true;
//   }

//   try {
//     console.log("[Webhook] 🔍 Signature Debug Info:");
//     console.log("[Webhook] ├─ Webhook Secret (first/last 4):", 
//       webhookSecret.substring(0, 4) + "..." + webhookSecret.substring(webhookSecret.length - 4));
//     console.log("[Webhook] ├─ Timestamp:", timestamp);
//     console.log("[Webhook] ├─ Raw Body Length:", rawBody.length);
//     console.log("[Webhook] ├─ Received Signature:", signature);

//     // FIX: Cashfree uses the EXACT raw body string without any modifications
//     // The signature is: base64(hmac_sha256(timestamp + body, secret))
    
//     // Try the official Cashfree format
//     const message = timestamp + rawBody;
    
//     console.log("[Webhook] ├─ Message (first 100 chars):", message.substring(0, 100));
//     console.log("[Webhook] ├─ Message (last 50 chars):", message.substring(message.length - 50));
    
//     const expectedSignature = crypto
//       .createHmac("sha256", webhookSecret)
//       .update(message)
//       .digest("base64");

//     console.log("[Webhook] ├─ Expected Signature:", expectedSignature);
//     console.log("[Webhook] ├─ Signatures Match:", expectedSignature === signature);

//     return expectedSignature === signature;
//   } catch (err) {
//     console.error("[Webhook] Error during signature verification:", err);
//     return false;
//   }
// }

// /**
//  * Reads raw body from request stream - FIXED version
//  */
// async function getRawBody(req) {
//   return new Promise((resolve, reject) => {
//     const chunks = [];
//     req.on("data", (chunk) => {
//       chunks.push(chunk);
//     });
//     req.on("end", () => {
//       // IMPORTANT: Use Buffer.concat to preserve exact bytes
//       const buffer = Buffer.concat(chunks);
//       resolve(buffer.toString('utf8'));
//     });
//     req.on("error", reject);
//   });
// }

// /**
//  * Updates purchase record in Supabase with payment details
//  */
// async function updatePurchaseStatus(orderId, status, webhookData = {}) {
//   try {
//     console.log(`[Webhook] Updating purchase status: ${orderId} → ${status}`);

//     const { payment = {}, customer_details = {}, charges_details = {} } = webhookData;

//     const updateData = {
//       payment_status: status,
//       updated_at: new Date().toISOString(),
//     };

//     // Add payment completion timestamp for successful payments
//     if (status === "success" && payment.payment_time) {
//       updateData.payment_completed_at = payment.payment_time;
//     }

//     // Store Cashfree payment ID for reference and refunds
//     if (payment.cf_payment_id) {
//       updateData.cashfree_payment_id = payment.cf_payment_id.toString();
//     }

//     // Store payment method details
//     if (payment.payment_method) {
//       updateData.payment_method = payment.payment_method;
//     }

//     if (payment.payment_group) {
//       updateData.payment_group = payment.payment_group;
//     }

//     if (payment.bank_reference) {
//       updateData.bank_reference = payment.bank_reference;
//     }

//     // Store settlement amount (actual amount after deducting charges)
//     if (charges_details.settlement_amount) {
//       updateData.settlement_amount = charges_details.settlement_amount;
//       updateData.service_charge = charges_details.service_charge;
//     }

//     // Store failure reason if payment failed
//     if (status === "failed" && payment.payment_message) {
//       updateData.failure_reason = payment.payment_message;
//     }

//     console.log("[Webhook] Update data:", JSON.stringify(updateData, null, 2));

//     // Update purchase record in Supabase
//     const { data, error } = await supabase
//       .from("purchases")
//       .update(updateData)
//       .eq("transaction_id", orderId)
//       .select();

//     if (error) {
//       console.error("[Webhook] ❌ Supabase update error:", error);
//       return { success: false, error };
//     }

//     if (!data || data.length === 0) {
//       console.error(`[Webhook] ⚠️ No purchase record found for order_id: ${orderId}`);
//       return { success: false, error: "Purchase record not found" };
//     }

//     console.log("[Webhook] ✅ Purchase updated successfully:", data[0]);
//     return { success: true, data: data[0] };
//   } catch (err) {
//     console.error("[Webhook] ❌ Error updating purchase:", err);
//     return { success: false, error: err.message };
//   }
// }

// /**
//  * Main webhook handler
//  */
// export default async function handler(req, res) {
//   const startTime = Date.now();
//   console.log("\n[Webhook] ╔═══════════════════════════════════════════════════════════");
//   console.log("[Webhook] ║ CASHFREE WEBHOOK RECEIVED");
//   console.log("[Webhook] ╠═══════════════════════════════════════════════════════════");
//   console.log("[Webhook] ║ Method:", req.method);
//   console.log("[Webhook] ║ URL:", req.url);
//   console.log("[Webhook] ║ Timestamp:", new Date().toISOString());
//   console.log("[Webhook] ╚═══════════════════════════════════════════════════════════\n");

//   // Only allow POST requests
//   if (req.method !== "POST") {
//     console.error("[Webhook] ❌ Method not allowed:", req.method);
//     return res.status(405).json({ 
//       success: false,
//       message: "Method Not Allowed - Only POST requests are accepted" 
//     });
//   }

//   try {
//     // Read raw body for signature verification
//     const rawBody = await getRawBody(req);
//     console.log("[Webhook] 📦 Raw Body Length:", rawBody.length);

//     // Extract signature headers
//     const signature = req.headers["x-webhook-signature"] || req.headers["X-Webhook-Signature"];
//     const timestamp = req.headers["x-webhook-timestamp"] || req.headers["X-Webhook-Timestamp"];

//     console.log("[Webhook] 🔐 Verifying webhook signature...");
//     console.log("[Webhook] ├─ Environment:", process.env.NODE_ENV || "development");
//     console.log("[Webhook] ├─ Signature:", signature ? "Present" : "Missing");
//     console.log("[Webhook] ├─ Timestamp:", timestamp ? timestamp : "Missing");
//     console.log("[Webhook] └─ Secret Configured:", process.env.CASHFREE_WEBHOOK_SECRET ? "Yes" : "No");

//     // Verify signature if headers are present
//     if (signature && timestamp) {
//       const isValid = verifyWebhookSignature(rawBody, signature, timestamp);
      
//       if (!isValid) {
//         console.error("[Webhook] ❌ Invalid webhook signature - Rejecting webhook");
//         return res.status(401).json({ 
//           success: false,
//           message: "Invalid webhook signature" 
//         });
//       } else {
//         console.log("[Webhook] ✅ Signature verified successfully");
//       }
//     } else {
//       console.warn("[Webhook] ⚠️ Missing signature or timestamp headers");
//       // In production, you might want to be stricter about this
//     }

//     // Parse webhook payload from raw body
//     const webhookPayload = JSON.parse(rawBody);
    
//     if (!webhookPayload || !webhookPayload.type) {
//       console.error("[Webhook] ❌ Invalid payload - missing 'type' field");
//       return res.status(400).json({ 
//         success: false,
//         message: "Invalid webhook payload" 
//       });
//     }

//     const eventType = webhookPayload.type;
//     const eventTime = webhookPayload.event_time;
//     const webhookData = webhookPayload.data || {};

//     // Log webhook details
//     console.log("[Webhook] 📋 Event Type:", eventType);
//     console.log("[Webhook] 🕐 Event Time:", eventTime);

//     // Extract order details
//     const order = webhookData.order || {};
//     const payment = webhookData.payment || {};
//     const orderId = order.order_id;
//     const orderAmount = order.order_amount;
//     const paymentStatus = payment.payment_status;

//     if (!orderId) {
//       console.error("[Webhook] ❌ Missing order_id in webhook payload");
//       return res.status(400).json({ 
//         success: false,
//         message: "Missing order_id in webhook payload" 
//       });
//     }

//     console.log("\n[Webhook] 💳 Payment Details:");
//     console.log(`[Webhook] ├─ Order ID: ${orderId}`);
//     console.log(`[Webhook] ├─ Amount: ₹${orderAmount}`);
//     console.log(`[Webhook] ├─ Payment Status: ${paymentStatus}`);
//     console.log(`[Webhook] └─ Payment Method: ${payment.payment_group || 'N/A'}\n`);

//     // Handle different webhook event types
//     let updateResult;

//     switch (eventType) {
//       case "PAYMENT_SUCCESS_WEBHOOK":
//         console.log("[Webhook] ✅ Processing PAYMENT SUCCESS");
//         updateResult = await updatePurchaseStatus(orderId, "success", webhookData);
//         break;

//       case "PAYMENT_FAILED_WEBHOOK":
//         console.log("[Webhook] ❌ Processing PAYMENT FAILED");
//         updateResult = await updatePurchaseStatus(orderId, "failed", webhookData);
//         break;

//       case "PAYMENT_USER_DROPPED_WEBHOOK":
//         console.log("[Webhook] 🚪 Processing USER DROPPED");
//         updateResult = await updatePurchaseStatus(orderId, "abandoned", webhookData);
//         break;

//       case "PAYMENT_CHARGES_WEBHOOK":
//         console.log("[Webhook] 💵 Processing PAYMENT CHARGES");
//         if (paymentStatus === "SUCCESS") {
//           updateResult = await updatePurchaseStatus(orderId, "success", webhookData);
//         } else {
//           console.log("[Webhook] ℹ️ Charges webhook received but payment not successful yet");
//           updateResult = { success: true, skipped: true };
//         }
//         break;

//       default:
//         console.log(`[Webhook] ℹ️ Unhandled webhook event type: ${eventType}`);
//         updateResult = { success: true, skipped: true };
//     }

//     // Log the result
//     const processingTime = Date.now() - startTime;
    
//     if (updateResult.success) {
//       console.log("\n[Webhook] ╔═══════════════════════════════════════════════════════════");
//       console.log("[Webhook] ║ ✅ WEBHOOK PROCESSED SUCCESSFULLY");
//       console.log("[Webhook] ╠═══════════════════════════════════════════════════════════");
//       console.log(`[Webhook] ║ Order ID: ${orderId}`);
//       console.log(`[Webhook] ║ Processing Time: ${processingTime}ms`);
//       console.log("[Webhook] ╚═══════════════════════════════════════════════════════════\n");
//     } else {
//       console.error("\n[Webhook] ╔═══════════════════════════════════════════════════════════");
//       console.error("[Webhook] ║ ⚠️ WEBHOOK PROCESSING FAILED");
//       console.error("[Webhook] ╠═══════════════════════════════════════════════════════════");
//       console.error(`[Webhook] ║ Order ID: ${orderId}`);
//       console.error(`[Webhook] ║ Error: ${updateResult.error}`);
//       console.error("[Webhook] ╚═══════════════════════════════════════════════════════════\n");
//     }

//     // Always return 200 OK to prevent Cashfree from retrying
//     return res.status(200).json({ 
//       success: true,
//       received: true,
//       orderId: orderId,
//       eventType: eventType,
//       processingTime: `${processingTime}ms`,
//       timestamp: new Date().toISOString()
//     });

//   } catch (err) {
//     const processingTime = Date.now() - startTime;
//     console.error("\n[Webhook] ╔═══════════════════════════════════════════════════════════");
//     console.error("[Webhook] ║ ❌ WEBHOOK PROCESSING ERROR");
//     console.error("[Webhook] ╠═══════════════════════════════════════════════════════════");
//     console.error("[Webhook] ║ Error:", err.message);
//     console.error("[Webhook] ║ Stack:", err.stack);
//     console.error("[Webhook] ╚═══════════════════════════════════════════════════════════\n");
    
//     return res.status(200).json({ 
//       success: true,
//       received: true,
//       error: "Processing error logged - will be investigated",
//       processingTime: `${processingTime}ms`,
//       timestamp: new Date().toISOString()
//     });
//   }
// }

/// pages/api/cashfree/webhook.js
import crypto from 'crypto';
import { supabase } from '../../../services/supabase';

// Disable body parsing to get raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Read raw body from request as Buffer (exact bytes)
 * IMPORTANT: Do NOT stringify before signature verification.
 */
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });
    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    req.on('error', reject);
  });
}

/**
 * Verify Cashfree webhook signature and parse JSON body
 */
function verifyAndParseRequest(req, rawBuffer) {
  const timestamp = req.headers['x-webhook-timestamp'];
  const signature = req.headers['x-webhook-signature'];
  const secretKey = process.env.CASHFREE_WEBHOOK_SECRET || '';

  if (!timestamp || !signature) {
    throw new Error('Missing signature headers');
  }

  if (!secretKey) {
    throw new Error('Server misconfigured: missing CASHFREE_WEBHOOK_SECRET');
  }

  const bodyString = String(timestamp) + rawBuffer.toString('utf8');
  const generatedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(bodyString)
    .digest('base64');

  if (generatedSignature !== signature) {
    throw new Error('Generated signature and received signature did not match.');
  }

  return JSON.parse(rawBuffer.toString('utf8'));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBuffer = await getRawBody(req);
    let webhookData;
    try {
      webhookData = verifyAndParseRequest(req, rawBuffer);
    } catch (e) {
      console.error('[Webhook] Signature verification failed:', e.message);
      return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log('Webhook received:', webhookData.type);

    // Handle different webhook events
    switch (webhookData.type) {
      case 'PAYMENT_SUCCESS_WEBHOOK':
        await handlePaymentSuccess(webhookData);
        break;
        
      case 'PAYMENT_FAILED_WEBHOOK':
        await handlePaymentFailure(webhookData);
        break;

      case 'PAYMENT_CHARGES_WEBHOOK':
        await handlePaymentCharges(webhookData);
        break;
        
      case 'REFUND_SUCCESS_WEBHOOK':
        await handleRefundSuccess(webhookData);
        break;

      default:
        console.log('[Webhook] ℹ️ Unhandled webhook event:', webhookData.type);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handlePaymentSuccess(data) {
  const order = data.data?.order || {};
  const payment = data.data?.payment || {};
  const charges = data.data?.charges_details || {};
  
  console.log('[Webhook] Processing Payment Success:', {
    orderId: order.order_id,
    amount: order.order_amount,
    paymentId: payment.cf_payment_id,
    paymentMethod: payment.payment_group
  });
  
  try {
    // Update purchase status in Supabase
    const { data: updateData, error } = await supabase
      .from('purchases')
      .update({
        payment_status: 'success',
        cashfree_payment_id: payment.cf_payment_id?.toString(),
        payment_method: payment.payment_group,
        payment_completed_at: payment.payment_time,
        settlement_amount: charges.settlement_amount,
        service_charge: charges.service_charge,
        bank_reference: payment.bank_reference,
        updated_at: new Date().toISOString()
      })
      .eq('transaction_id', order.order_id)
      .select();
    
    if (error) {
      console.error('[Webhook] Error updating purchase:', error);
      throw error;
    }
    
    if (!updateData || updateData.length === 0) {
      console.error('[Webhook] No purchase record found for order:', order.order_id);
      return;
    }
    
    console.log('[Webhook] ✅ Purchase updated successfully:', updateData[0]);
    
    // TODO: Send confirmation email
    // TODO: Grant course access
    
  } catch (error) {
    console.error('[Webhook] Error in handlePaymentSuccess:', error);
    throw error;
  }
}

async function handlePaymentFailure(data) {
  const order = data.data?.order || {};
  const payment = data.data?.payment || {};
  
  console.log('[Webhook] Processing Payment Failure:', {
    orderId: order.order_id,
    error: payment.payment_message,
    errorCode: payment.payment_code
  });
  
  try {
    // Update purchase status in Supabase
    const { data: updateData, error } = await supabase
      .from('purchases')
      .update({
        payment_status: 'failed',
        failure_reason: payment.payment_message,
        updated_at: new Date().toISOString()
      })
      .eq('transaction_id', order.order_id)
      .select();
    
    if (error) {
      console.error('[Webhook] Error updating purchase:', error);
      throw error;
    }
    
    console.log('[Webhook] ✅ Purchase marked as failed:', updateData);
    
    // TODO: Notify customer about payment failure
    
  } catch (error) {
    console.error('[Webhook] Error in handlePaymentFailure:', error);
    throw error;
  }
}

async function handlePaymentCharges(data) {
  const order = data.data?.order || {};
  const payment = data.data?.payment || {};
  const charges = data.data?.charges_details || {};
  
  console.log('[Webhook] Processing Payment Charges:', {
    orderId: order.order_id,
    serviceCharge: charges.service_charge,
    settlementAmount: charges.settlement_amount
  });
  
  try {
    // Update charges info in Supabase (if payment is already successful)
    if (payment.payment_status === 'SUCCESS') {
      const { data: updateData, error } = await supabase
        .from('purchases')
        .update({
          settlement_amount: charges.settlement_amount,
          service_charge: charges.service_charge,
          updated_at: new Date().toISOString()
        })
        .eq('transaction_id', order.order_id)
        .select();
      
      if (error) {
        console.error('[Webhook] Error updating charges:', error);
        throw error;
      }
      
      console.log('[Webhook] ✅ Charges updated:', updateData);
    } else {
      console.log('[Webhook] ℹ️ Payment not successful yet, charges webhook received');
    }
    
  } catch (error) {
    console.error('[Webhook] Error in handlePaymentCharges:', error);
    throw error;
  }
}

async function handleRefundSuccess(data) {
  const order = data.data?.order || {};
  const payment = data.data?.payment || {};
  
  console.log('Refund Processed:', {
    orderId: order.order_id,
    refundId: payment.cf_payment_id,
    refundAmount: payment.refund_amount
  });
  
  // TODO: Update refund status in database
}