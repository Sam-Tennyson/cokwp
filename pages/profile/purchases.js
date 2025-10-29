"use client";

import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../services/supabase";
import { useSessionStore } from "../../stores/session";

export default function PurchasesPage() {
  const { userSession } = useSessionStore();
  const [isLoading, setIsLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState("");

  const userId = userSession?.id || null;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    const fetchPurchases = async () => {
      setIsLoading(true);
      setError("");
      const { data, error: err } = await supabase
        .from("purchases")
        .select("id, course_id, amount, payment_status, transaction_id, created_at, updated_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (err) {
        setError(err.message || "Failed to load purchases");
      } else {
        setPurchases(data || []);
      }
      setIsLoading(false);
    };

    fetchPurchases();

    const channel = supabase
      .channel(`purchases-user-${userId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "purchases", filter: `user_id=eq.${userId}` },
        () => {
          fetchPurchases();
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "purchases", filter: `user_id=eq.${userId}` },
        () => {
          fetchPurchases();
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <>
      <Head>
        <title>My Purchases</title>
      </Head>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">My Purchases</h1>
        {!userId && (
          <div className="p-4 rounded border bg-yellow-50 text-yellow-900">Please log in to view your purchases.</div>
        )}
        {userId && isLoading && (
          <div className="p-4 rounded border bg-gray-50 text-gray-700">Loading purchases...</div>
        )}
        {userId && !isLoading && error && (
          <div className="p-4 rounded border bg-red-50 text-red-900">{error}</div>
        )}
        {userId && !isLoading && !error && purchases.length === 0 && (
          <div className="p-4 rounded border bg-gray-50 text-gray-700">No purchases yet.</div>
        )}
        {userId && !isLoading && !error && purchases.length > 0 && (
          <div className="space-y-3">
            {purchases.map((p) => (
              <div key={p.id} className="p-4 rounded border bg-white flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Course ID</div>
                  <div className="font-medium text-gray-900">{p.course_id}</div>
                  <div className="text-xs text-gray-500 mt-1">Order: {p.transaction_id}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="font-semibold">₹{p.amount}</div>
                  <div className="mt-1 text-xs">
                    {p.payment_status === "success" && (
                      <span className="px-2 py-0.5 rounded bg-green-100 text-green-700">Success</span>
                    )}
                    {p.payment_status === "pending" && (
                      <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">Pending</span>
                    )}
                    {p.payment_status === "failed" && (
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-700">Failed</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}



