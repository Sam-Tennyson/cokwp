/**
 * Cashfree configuration mapping for TEST and LIVE environments.
 * Keep credentials in environment variables. This module only maps endpoints and reads env values.
 */

import { load } from "@cashfreepayments/cashfree-js";

const CASHFREE_ENVIRONMENTS = {
  TEST: {
    baseUrl: "https://sandbox.cashfree.com/pg",
  },
  LIVE: {
    baseUrl: "https://api.cashfree.com/pg",
  },
};

export function getCashfreeConfig() {
  // Read environment - defaults to TEST if not explicitly set to LIVE
  const envVar = process.env.NEXT_PUBLIC_CASHFREE_ENV || "";
  const env = envVar.toUpperCase() === "LIVE" ? "LIVE" : "TEST";
  
  // Read credentials - use env-specific variables if available, fallback to generic
  const appId = (
    process.env.CASHFREE_APP_ID ||
    ""
  ).trim();
  
  const secretKey = (
    process.env.CASHFREE_SECRET_KEY ||
    ""
  ).trim();
  
  const config = CASHFREE_ENVIRONMENTS[env];
  
  return {
    env,
    appId,
    secretKey,
    endpoints: {
      createOrder: `${config.baseUrl}/orders`,
    },
  };
}

export function getReturnUrl() {
  const host = process.env.NEXT_PUBLIC_APP_URL;
  if (!host) {
    console.error("[Cashfree Config] WARNING: NEXT_PUBLIC_APP_URL not set! Using localhost fallback.");
  }
  const finalHost = host || "http://localhost:3000";
  return `${finalHost}/payment-status?order_id={order_id}`;
}

export function getNotifyUrl() {
  const host = process.env.NEXT_PUBLIC_APP_URL;
  if (!host) {
    console.error("[Cashfree Config] CRITICAL: NEXT_PUBLIC_APP_URL not set! Webhook will NOT work in production!");
  }
  const finalHost = host || "http://localhost:3000";
  // IMPORTANT: Trailing slash required because next.config.js has trailingSlash: true
  return `${finalHost}/api/cashfree/webhook/`;
}


export async function getCashfreeInstance() {
  const isLive = (process.env.NEXT_PUBLIC_CASHFREE_ENV || "TEST") === "LIVE";
  return await load({
    mode: isLive ? "production" : "sandbox"
  });
}


