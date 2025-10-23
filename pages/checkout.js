"use client";

import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { getCashfreeInstance } from "../services/cashfree-config";

export default function CheckoutPage() {
  const router = useRouter();
  const { courseId, courseName, amount } = router.query || {};
  const [cashfree, setCashfree] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isLive = useMemo(() => (process.env.NEXT_PUBLIC_CASHFREE_ENV || "TEST") === "LIVE", []);

  useEffect(() => {
    const loadCashfree = async () => {
      try {
        const cf = await getCashfreeInstance();
        setCashfree(cf);
      } catch (err) {
        console.error("Failed to load Cashfree SDK from npm:", err);
      }
    };
    loadCashfree();
  }, [isLive]);

  const handlePayment = async () => {
    if (!cashfree) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/cashfree-create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, courseName, amount }),
      });
      const data = await response.json();
      if (!response.ok) {
        const msg = data?.message || data?.details?.message || "Failed to create order";
        const code = data?.code || data?.details?.code || response.status;
        throw new Error(`${msg} [${code}]`);
      }
      const paymentSessionId = data?.payment_session_id || data?.order_token;
      if (!paymentSessionId) throw new Error("Missing payment session id");
      await cashfree.checkout({ paymentSessionId, redirectTarget: "_self" });
    } catch (error) {
      console.error("Payment failed to initiate:", error);
      alert(error?.message || "Payment initiation failed");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Checkout</title>
      </Head>
      <div>
        <h1 className="text-xl font-semibold mb-2">Complete Your Purchase</h1>
        <p className="text-gray-700 mb-4">{courseName} — ₹{amount}</p>
        <button
          onClick={handlePayment}
          disabled={!cashfree || isLoading}
          className="inline-flex text-white bg-blue-500 border-0 py-2 px-4 focus:outline-none hover:bg-blue-600 rounded"
        >
          {isLoading ? "Redirecting..." : "Pay Now"}
        </button>
      </div>
    </>
  );
}


