let cachedInstance = null;

async function loadFromNpm(isLive) {
  try {
    if (typeof window === "undefined") return null;
    const mod = await import("@cashfreepayments/cashfree-js");
    const loader = mod?.load || mod?.default?.load || mod?.default;
    if (typeof loader === "function") {
      const instance = await loader({ mode: isLive ? "production" : "sandbox" });
      if (instance && typeof instance.checkout === "function") {
        return instance;
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

// export async function getCashfreeInstance() {
//   if (cachedInstance) return cachedInstance;
//   const isLive = (process.env.NEXT_PUBLIC_CASHFREE_ENV || "TEST") === "LIVE";
//   const npmInstance = await loadFromNpm(isLive);
//   if (!npmInstance) {
//     throw new Error("Failed to initialize Cashfree SDK from npm package");
//   }
//   cachedInstance = npmInstance;
//   return npmInstance;
// }

// Note: CDN fallback intentionally removed to enforce npm-based SDK usage


