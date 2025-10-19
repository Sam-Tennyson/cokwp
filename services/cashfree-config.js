/**
 * Cashfree configuration mapping for TEST and LIVE environments.
 * Keep credentials in environment variables. This module only maps endpoints and reads env values.
 */

const CASHFREE_ENVIRONMENTS = {
  TEST: {
    baseUrl: "https://sandbox.cashfree.com/pg",
  },
  LIVE: {
    baseUrl: "https://api.cashfree.com/pg",
  },
};

export function getCashfreeConfig() {
  const env = process.env.NEXT_PUBLIC_CASHFREE_ENV === "LIVE" ? "LIVE" : "TEST";
  const appId = process.env.CASHFREE_APP_ID || "";
  const secretKey = process.env.CASHFREE_SECRET_KEY || "";
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
  const host = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${host}/payment-status?order_id={order_id}`;
}

export function getNotifyUrl() {
  const host = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${host}/api/cashfree/webhook`;
}


