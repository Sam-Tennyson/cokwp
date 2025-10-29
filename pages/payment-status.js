"use client";

import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { getCashfreeInstance } from "../services/cashfree-config";
import { supabase } from "../services/supabase";
import { useSessionStore } from "../stores/session";

export default function PaymentStatusPage() {
  const router = useRouter();
  const { userSession } = useSessionStore();
  const [uiStatus, setUiStatus] = useState("processing");
  const [message, setMessage] = useState("Payment submitted! We are now verifying your purchase. Please wait, this may take a moment...");
  const [details, setDetails] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const isLive = useMemo(() => (process.env.NEXT_PUBLIC_CASHFREE_ENV || "TEST") === "LIVE", []);

  useEffect(() => {
    const init = async () => {
      try {
        const cf = await getCashfreeInstance();
        const redirect = cf.redirectResult?.();
        // We do NOT trust redirect status for final decision. Use it only for diagnostics.
        // Keep UI in "processing" until webhook updates the DB and realtime notifies us.
        if (redirect?.orderId) {
          setDetails({ orderId: redirect.orderId, referenceId: redirect.referenceId, rawStatus: redirect.status });
        }
        const qOrderId = router.query?.order_id ? String(router.query.order_id) : null;
        const effectiveOrderId = qOrderId || (redirect?.orderId ? String(redirect.orderId) : null);
        if (effectiveOrderId) setOrderId(effectiveOrderId);
      } catch {}
    };
    init();
  }, [isLive, router.query]);

  useEffect(() => {
    if (!orderId) return;

    let channel = null;
    let cancelled = false;

    const handleStatusChange = (paymentStatus, payload) => {
      if (cancelled) return;
      if (paymentStatus === "success") {
        setUiStatus("success");
        setMessage("Purchase complete! Your access has been activated.");
        setDetails((prev) => ({ ...(prev || {}), dbPayload: payload?.new }));
      } else if (paymentStatus === "failed") {
        setUiStatus("failed");
        setMessage("Payment failed. If you were charged, it will be reversed. You can try again.");
        setDetails((prev) => ({ ...(prev || {}), dbPayload: payload?.new }));
      } else if (paymentStatus === "pending") {
        setUiStatus("processing");
        setMessage("Still verifying your purchase. Please wait...");
      }
    };

    const bootstrap = async () => {
      console.log("bootstrap", orderId);
      // Initial read (in case webhook already processed)
      const { data: existing, error } = await supabase
        .from("purchases")
        .select("id, payment_status, transaction_id, course_id, amount, updated_at")
        .eq("transaction_id", String(orderId))
        .maybeSingle();
      if (!error && existing) {
        handleStatusChange(existing.payment_status, { new: existing });
      }

      // Subscribe to realtime updates for this order
      channel = supabase
        .channel(`purchase-${orderId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "purchases",
            filter: `transaction_id=eq.${orderId}`,
          },
          (payload) => {
            const newStatus = payload?.new?.payment_status;
            handleStatusChange(newStatus, payload);
          }
        )
        .subscribe();
    };

    bootstrap();

    return () => {
      cancelled = true;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [orderId]);

  // TEST mode fallback: verify order via API (useful when webhooks are unreachable on localhost)
  useEffect(() => {
    if (!orderId) return;
    if (isLive) return;

    const verify = async () => {
      try {
        const res = await fetch("/api/cashfree-verify-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        const data = await res.json();
        if (!res.ok) return;
        if (data?.payment_status === "success") {
          setUiStatus("success");
          setMessage("Purchase complete! Your access has been activated.");
          setDetails((prev) => ({ ...(prev || {}), verified: true, order: data?.order, dbPayload: data?.purchase }));
        } else if (data?.payment_status === "failed") {
          setUiStatus("failed");
          setMessage("Payment failed. If you were charged, it will be reversed. You can try again.");
          setDetails((prev) => ({ ...(prev || {}), verified: true, order: data?.order, dbPayload: data?.purchase }));
        }
      } catch {}
    };

    verify();
  }, [orderId, isLive]);

  return (
    <>
      <Head>
        <title>Payment Status</title>
      </Head>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-semibold mb-3">Payment Status</h1>
        {uiStatus === "processing" && (
          <div className="p-4 rounded border bg-yellow-50 text-yellow-900">
            <p className="font-medium">Processing</p>
            <p className="text-sm mt-1">{message}</p>
          </div>
        )}
        {uiStatus === "success" && (
          <div className="p-4 rounded border bg-green-50 text-green-900">
            <p className="font-medium">Success</p>
            <p className="text-sm mt-1">{message}</p>
          </div>
        )}
        {uiStatus === "failed" && (
          <div className="p-4 rounded border bg-red-50 text-red-900">
            <p className="font-medium">Failed</p>
            <p className="text-sm mt-1">{message}</p>
          </div>
        )}
      </div>
    </>
  );
}


