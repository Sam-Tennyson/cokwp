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

function getEffectiveEnv() {
  const raw = (process.env.NEXT_PUBLIC_CASHFREE_ENV || "TEST").toUpperCase();
  return raw === "LIVE" ? "LIVE" : "TEST";
}

export function getCashfreeConfig() {
  const env = getEffectiveEnv();
  const config = CASHFREE_ENVIRONMENTS[env];

  // Prefer env-specific credentials; fallback to generic names if provided
  const appId = (
    env === "LIVE"
      ? (process.env.CASHFREE_LIVE_APP_ID)
      : (process.env.CASHFREE_TEST_APP_ID)
  || "").trim();

  const secretKey = (
    env === "LIVE"
      ? (process.env.CASHFREE_LIVE_SECRET_KEY)
      : (process.env.CASHFREE_TEST_SECRET_KEY)
  || "").trim();

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


