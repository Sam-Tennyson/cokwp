import { getCashfreeConfig, getReturnUrl, getNotifyUrl } from "../../services/cashfree-config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const { courseId, courseName, amount } = req.body || {};
    if (!courseId || !courseName || !amount) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const cfg = getCashfreeConfig();
    // Minimal diagnostic logs for local debugging
    try {
      console.log("[Cashfree][create-order] env=", cfg.env, "endpoint=", cfg.endpoints.createOrder);
      if (cfg.appId) {
        console.log("[Cashfree][create-order] appId length=", cfg.appId.length, "prefix=", cfg.appId.slice(0, 6));
      }
      if (cfg.secretKey) {
        console.log("[Cashfree][create-order] secretKey length=", cfg.secretKey.length);
      }
    } catch (_) {}
    if (!cfg.appId || !cfg.secretKey) {
      res.status(500).json({ message: "Cashfree credentials not configured" });
      return;
    }

    const orderId = `order_${courseId}_${Date.now()}`;
    const payload = {
      order_id: orderId,
      order_amount: Number(amount),
      order_currency: "INR",
      customer_details: {
        customer_id: `cust_${courseId}`,
        customer_email: "customer@example.com",
        customer_phone: "9999999999",
      },
      order_meta: {
        return_url: getReturnUrl(),
      },
    };

    // Add order_note for better tracking
    if (courseName) {
      payload.order_note = `Payment for ${courseName}`;
    }

    const response = await fetch(cfg.endpoints.createOrder, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": cfg.appId.trim(),
        "x-client-secret": cfg.secretKey.trim(),
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      const errorMessage = data?.message || data?.reason || data?.error || "Cashfree error";
      res.status(response.status).json({
        message: errorMessage,
        code: data?.code || data?.sub_code,
        env: cfg.env,
        details: data,
      });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
