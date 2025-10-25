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
    
    // Diagnostic logs for debugging
    try {
      console.log("[Cashfree][create-order] env=", cfg.env, "endpoint=", cfg.endpoints.createOrder);
      console.log("[Cashfree][create-order] NODE_ENV=", process.env.NODE_ENV);
      console.log("[Cashfree][create-order] NEXT_PUBLIC_CASHFREE_ENV=", process.env.NEXT_PUBLIC_CASHFREE_ENV);
      
      if (cfg.appId) {
        console.log("[Cashfree][create-order] appId length=", cfg.appId.length, "prefix=", cfg.appId.slice(0, 6));
      } else {
        console.log("[Cashfree][create-order] WARNING: appId not found. Checked env vars: CASHFREE_" + cfg.env + "_APP_ID, CASHFREE_APP_ID");
      }
      
      if (cfg.secretKey) {
        console.log("[Cashfree][create-order] secretKey length=", cfg.secretKey.length);
      } else {
        console.log("[Cashfree][create-order] WARNING: secretKey not found. Checked env vars: CASHFREE_" + cfg.env + "_SECRET_KEY, CASHFREE_SECRET_KEY");
      }
    } catch (err) {
      console.error("[Cashfree][create-order] Logging error:", err);
    }
    
    if (!cfg.appId || !cfg.secretKey) {
      res.status(500).json({ 
        message: "Cashfree credentials not configured", 
        env: cfg.env,
        nodeEnv: process.env.NODE_ENV,
        hint: `Set CASHFREE_${cfg.env}_APP_ID and CASHFREE_${cfg.env}_SECRET_KEY or CASHFREE_APP_ID and CASHFREE_SECRET_KEY`
      });
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
        notify_url: getNotifyUrl(),
      },
    };

    // Add order_note for better tracking
    if (courseName) {
      payload.order_note = `Payment for ${courseName}`;
    }

    // Log webhook URL for debugging
    console.log("[Cashfree][create-order] Webhook URL:", getNotifyUrl());

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

    console.log("data", data);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
