let cachedInstance = null;

async function loadFromNpm(isLive) {
  try {
    const mod = await import("@cashfreepayments/cashfree-js");
    const loader = mod?.load;
    if (typeof loader === "function") {
      return await loader({ mode: isLive ? "production" : "sandbox" });
    }
    return null;
  } catch (e) {
    return null;
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src='${src}']`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
    document.body.appendChild(script);
  });
}

async function loadFromCdn(isLive) {
  const url = isLive
    ? "https://sdk.cashfree.com/js/ui/2.0.0/cashfree.prod.js"
    : "https://sdk.cashfree.com/js/ui/2.0.0/cashfree.sandbox.js";
  await loadScript(url);
  const factory = window && window.Cashfree;
  if (typeof factory === "function") {
    // CDN uses capitalized mode strings
    return factory({ mode: isLive ? "PROD" : "SANDBOX" });
  }
  throw new Error("Cashfree global not available after CDN load");
}

export async function getCashfreeInstance() {
  if (cachedInstance) return cachedInstance;
  const isLive = (process.env.NEXT_PUBLIC_CASHFREE_ENV || "TEST") === "LIVE";
  const npmInstance = await loadFromNpm(isLive);
  if (npmInstance && typeof npmInstance.checkout === "function") {
    cachedInstance = npmInstance;
    return npmInstance;
  }
  const cdnInstance = await loadFromCdn(isLive);
  cachedInstance = cdnInstance;
  return cdnInstance;
}


