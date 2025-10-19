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
    if (!cfg.appId || !cfg.secretKey) {
      res.status(500).json({ message: "Cashfree credentials not configured" });
      return;
    }

    const orderId = `order_${courseId}_${Date.now()}`;
    const payload = {
      order_id: orderId,
      order_amount: Number(amount),
      order_currency: "INR",
      order_note: `Payment for ${courseName}`,
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

    const response = await fetch(cfg.endpoints.createOrder, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": cfg.appId,
        "x-client-secret": cfg.secretKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json({ message: "Cashfree error", details: data });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}


