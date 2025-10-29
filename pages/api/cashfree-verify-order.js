import { getOrder } from "../../services/cashfree-backend-pg";
import { supabase } from "../../services/supabase";

function toPlainOrder(raw) {
  const safe = raw || {};
  const data = safe?.data || {};
  const orderId = safe.order_id || data.order_id || null;
  const orderStatus = String(safe.order_status || data.order_status || "");
  const rawPayments = Array.isArray(safe.payments)
    ? safe.payments
    : Array.isArray(data.payments)
    ? data.payments
    : [];
  const payments = rawPayments.map((p) => ({
    payment_id: p?.payment_id || p?.id || null,
    payment_status: String(p?.payment_status || ""),
    payment_amount: Number(p?.payment_amount ?? p?.amount ?? 0),
    payment_currency: p?.payment_currency || p?.currency || "INR",
    bank_reference: p?.bank_reference || p?.reference_id || null,
    cf_payment_id: p?.cf_payment_id || null,
  }));
  return { order_id: orderId, order_status: orderStatus, payments };
}

/**
 * Verify a Cashfree order and update the corresponding purchase record.
 * TEST mode fallback for when webhooks are not reachable (e.g. localhost).
 *
 * POST body: { orderId: string }
 * Response: { ok: boolean, order: any, purchase?: any, payment_status: 'success'|'failed'|'pending' }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, message: "Method Not Allowed" });
    return;
  }

  try {
    const { orderId } = req.body || {};
    if (!orderId) {
      res.status(400).json({ ok: false, message: "Missing orderId" });
      return;
    }

    const order = await getOrder(String(orderId));
    const plainOrder = toPlainOrder(order);

    // Infer status from sanitized order response
    const rawStatus = String(plainOrder?.order_status || "").toUpperCase();
    const payments = Array.isArray(plainOrder?.payments) ? plainOrder.payments : [];
    const anySuccessPayment = payments.some(
      (p) => String(p?.payment_status || "").toUpperCase() === "SUCCESS"
    );

    let paymentStatus = "pending";
    if (rawStatus === "PAID" || anySuccessPayment) {
      paymentStatus = "success";
    } else if (rawStatus === "FAILED" || rawStatus === "EXPIRED" || rawStatus === "CANCELLED") {
      paymentStatus = "failed";
    }

    let updatedPurchase = null;
    if (paymentStatus !== "pending") {
      const { data, error } = await supabase
        .from("purchases")
        .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
        .eq("transaction_id", String(orderId))
        .select()
        .maybeSingle();
      if (!error) {
        updatedPurchase = data || null;
      }
    }

    res.status(200).json({ ok: true, order: plainOrder, purchase: updatedPurchase, payment_status: paymentStatus });
  } catch (err) {
    console.error("[cashfree-verify-order] Error:", err);
    res.status(500).json({ ok: false, message: err?.message || "Internal Server Error" });
  }
}


