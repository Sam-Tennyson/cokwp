import { Cashfree, CFEnvironment } from "cashfree-pg";

let client = null;

function getEnvironment() {
  const envVar = (process.env.NEXT_PUBLIC_CASHFREE_ENV || "TEST").toUpperCase();
  return envVar === "LIVE" ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;
}

function ensureClient() {
  if (client) return client;
  const appId = (process.env.CASHFREE_APP_ID || "").trim();
  const secretKey = (process.env.CASHFREE_SECRET_KEY || "").trim();
  if (!appId || !secretKey) {
    throw new Error("Cashfree credentials are missing. Set CASHFREE_APP_ID and CASHFREE_SECRET_KEY.");
  }
  const env = getEnvironment();
  const enableAnalytics = String(process.env.CASHFREE_ENABLE_ERROR_ANALYTICS || "false").toLowerCase() === "true";
  client = new Cashfree(env, appId, secretKey, undefined, undefined, undefined, enableAnalytics);
  return client;
}

/**
 * Verify webhook signature using Cashfree SDK.
 * @param {string} signature
 * @param {string|Buffer} rawBody
 * @param {string|number} timestamp
 * @returns {import("cashfree-pg").PGWebhookEvent}
 */
export function verifyWebhookSignature(signature, rawBody, timestamp) {
  const sdk = ensureClient();
  const bodyString = Buffer.isBuffer(rawBody) ? rawBody.toString("utf8") : String(rawBody || "");
  return sdk.PGVerifyWebhookSignature(signature, bodyString, String(timestamp));
}

/**
 * Create a Cashfree order.
 * @param {object} order
 * @returns {Promise<any>}
 */
export function createOrder(order) {
  const sdk = ensureClient();
  return sdk.PGCreateOrder(order);
}

/**
 * Fetch a Cashfree order by id.
 * @param {string} orderId
 * @returns {Promise<any>}
 */
export function getOrder(orderId) {
  const sdk = ensureClient();
  return sdk.PGFetchOrder(orderId);
}

/**
 * Update order extended data (alias kept as updateOrder for backward compatibility).
 * @param {string} orderId
 * @param {object} update
 * @returns {Promise<any>}
 */
export function updateOrder(orderId, update) {
  const sdk = ensureClient();
  return sdk.PGUpdateOrderExtendedData(orderId, update);
}