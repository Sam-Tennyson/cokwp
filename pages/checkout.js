"use client";

import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { getCashfreeInstance } from "../services/cashfree-config";
import { useSessionStore } from "../stores/session";
import { useProfileStore } from "../stores/profile";

export default function CheckoutPage() {
  const router = useRouter();
  const { userSession } = useSessionStore();
  const profile = useProfileStore((state) => state.profile);
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
      const payload = {
        courseId,
        // courseName,
        // amount,
        userId: userSession.id,
      }
      const response = await fetch("/api/cashfree-create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ courseId, courseName, amount }),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        const msg = data?.message || data?.details?.message || "Failed to create order";
        const code = data?.code || data?.details?.code || response.status;
        console.error("[Checkout] Order creation error:", { status: response.status, code, msg, data });
        throw new Error(`${msg} [${code}]`);
      }
      const paymentSessionId = data?.payment_session_id || data?.order_token;
      if (!paymentSessionId) throw new Error("Missing payment session id");
      try {
        await cashfree.checkout({ paymentSessionId, redirectTarget: "_self" });
      } catch (checkoutErr) {
        console.error("[Checkout] Cashfree checkout() failed:", checkoutErr);
        alert(checkoutErr?.message || "Checkout initialization failed");
        setIsLoading(false);
      }
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Complete Your Purchase</h1>
        
        {/* User Profile Info */}
        {profile && (
          <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
            <h2 className="text-sm font-medium text-gray-500 mb-3">Account Information</h2>
            <div className="flex items-center gap-4">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-medium">
                  {profile.first_name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <div>
                <div className="font-medium text-gray-900">
                  {profile.first_name && profile.last_name
                    ? `${profile.first_name} ${profile.last_name}`
                    : "User"}
                </div>
                <div className="text-sm text-gray-600">{profile.email}</div>
                {profile.phone && (
                  <div className="text-sm text-gray-600">{profile.phone}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Course Info */}
        <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500 mb-3">Course Details</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">{courseName}</p>
              <p className="text-sm text-gray-500">Premium Course</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{amount}</p>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={!cashfree || isLoading}
          className="w-full inline-flex justify-center text-white bg-blue-500 border-0 py-3 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Redirecting..." : "Pay Now"}
        </button>
      </div>
    </>
  );
}


