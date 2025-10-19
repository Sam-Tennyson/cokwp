"use client";

import Head from "next/head";
import { useEffect, useMemo, useState } from "react";

export default function PaymentStatusPage() {
  const [paymentStatus, setPaymentStatus] = useState("Loading...");
  const isLive = useMemo(() => (process.env.NEXT_PUBLIC_CASHFREE_ENV || "TEST") === "LIVE", []);

  useEffect(() => {
    const checkStatus = async () => {
      const { load } = await import("@cashfreepayments/cashfree-js");
      const cf = await load({ mode: isLive ? "production" : "sandbox" });
      const result = cf.redirectResult?.();
      if (result) {
        if (result.status === "SUCCESS") {
          setPaymentStatus(`Payment Successful! Order ID: ${result.orderId}, Reference ID: ${result.referenceId}`);
        } else if (result.status === "CANCELLED") {
          setPaymentStatus("Payment was cancelled by the user.");
        } else {
          setPaymentStatus(`Payment Failed. Error: ${result.message || "Unknown error"}`);
        }
      } else {
        setPaymentStatus("No redirect result found.");
      }
    };
    checkStatus();
  }, [isLive]);

  return (
    <>
      <Head>
        <title>Payment Status</title>
      </Head>
      <div>
        <h1 className="text-xl font-semibold mb-2">Payment Status</h1>
        <p>{paymentStatus}</p>
      </div>
    </>
  );
}


