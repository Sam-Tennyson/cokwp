import { getCashfreeConfig, getReturnUrl, getNotifyUrl } from "../../services/cashfree-config";
import { supabase } from "../../services/supabase";

/**
 * Cashfree Order Creation API
 * 
 * Flow:
 * 1. Authenticate user
 * 2. Fetch course details from Supabase
 * 3. Create Cashfree order
 * 4. Create purchase record in Supabase (status: 'pending')
 * 5. Return payment_session_id to frontend
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const { courseId, userId } = req.body || {};
    
    if (!courseId) {
      res.status(400).json({ message: "Missing courseId" });
      return;
    }

    if (!userId) {
      res.status(400).json({ message: "Missing userId - User must be authenticated" });
      return;
    }

    console.log("[Cashfree][create-order] 📝 Creating order for course:", courseId);
    console.log("[Cashfree][create-order] 👤 User ID:", userId);

    // Fetch course details from Supabase
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id, title, description, price, is_premium")
      .eq("id", courseId)
      .eq("is_active", true)
      .single();

    if (courseError || !course) {
      console.error("[Cashfree][create-order] ❌ Course not found:", courseError);
      res.status(404).json({ message: "Course not found or inactive" });
      return;
    }

    console.log("[Cashfree][create-order] 📚 Course found:", course.title);
    console.log("[Cashfree][create-order] 💰 Price: ₹", course.price);

    // Check if course requires payment
    // if (!course.is_premium || course.price === 0) {
    //   res.status(400).json({ message: "This course is free or does not require payment" });
    //   return;
    // }

    // Fetch user details from Supabase
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select()
      .eq('id', userId)
      .single()

    if (userError || !user) {
      console.error("[Cashfree][create-order] ❌ User not found:", userError);
      res.status(404).json({ message: "User not found" });
      return;
    }

    console.log("[Cashfree][create-order] 👤 User found:", user.email);

    // Check if user already purchased this course
    const { data: existingPurchase, error: purchaseCheckError } = await supabase
      .from("purchases")
      .select("id, payment_status")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .eq("payment_status", "success")
      .maybeSingle();

    if (existingPurchase) {
      console.log("[Cashfree][create-order] ⚠️ User already purchased this course");
      res.status(400).json({ 
        message: "You have already purchased this course",
        alreadyPurchased: true 
      });
      return;
    }

    const cfg = getCashfreeConfig();
    
    // Diagnostic logs for debugging
    console.log("[Cashfree][create-order] Environment:", cfg.env);
    console.log("[Cashfree][create-order] Endpoint:", cfg.endpoints.createOrder);
    
    if (!cfg.appId || !cfg.secretKey) {
      console.error("[Cashfree][create-order] ❌ Cashfree credentials not configured");
      res.status(500).json({ 
        message: "Cashfree credentials not configured", 
        env: cfg.env,
        hint: `Set CASHFREE_${cfg.env}_APP_ID and CASHFREE_${cfg.env}_SECRET_KEY`
      });
      return;
    }

    // Generate unique order ID
    const orderId = `order_${courseId}_${Date.now()}`;
    const returnUrl = getReturnUrl();
    const notifyUrl = getNotifyUrl();
    
    console.log("[Cashfree][create-order] 🔗 Return URL:", returnUrl);
    console.log("[Cashfree][create-order] 🔗 Webhook URL:", notifyUrl);
    
    // Prepare Cashfree order payload with real user data
    const orderPayload = {
      order_id: orderId,
      order_amount: Number(course.price),
      order_currency: "INR",
      customer_details: {
        customer_id: userId,
        customer_email: user.email || "customer@example.com",
        customer_phone: user.phone || "9999999999",
        customer_name: user.full_name || "Customer",
      },
      order_meta: {
        return_url: returnUrl,
        notify_url: notifyUrl,
      },
      order_note: `Payment for ${course.title}`,
    };
    
    console.log("[Cashfree][create-order] 📦 Order Payload:", JSON.stringify(orderPayload, null, 2));

    // Create order with Cashfree
    const response = await fetch(cfg.endpoints.createOrder, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": cfg.appId.trim(),
        "x-client-secret": cfg.secretKey.trim(),
      },
      body: JSON.stringify(orderPayload),
    });

    const cashfreeData = await response.json();
    
    if (!response.ok) {
      const errorMessage = cashfreeData?.message || cashfreeData?.reason || "Cashfree order creation failed";
      console.error("[Cashfree][create-order] ❌ Cashfree Error:", JSON.stringify(cashfreeData, null, 2));
      res.status(response.status).json({
        message: errorMessage,
        code: cashfreeData?.code || cashfreeData?.sub_code,
        env: cfg.env,
        details: cashfreeData,
      });
      return;
    }

    console.log("[Cashfree][create-order] ✅ Cashfree order created successfully!");
    console.log("[Cashfree][create-order] Order ID:", cashfreeData.order_id);
    console.log("[Cashfree][create-order] Payment Session ID:", cashfreeData.payment_session_id);


    const paymentMode = (process.env.CASHFREE_ENV || process.env.NEXT_PUBLIC_CASHFREE_ENV || "TEST").toUpperCase();
    // Create purchase record in Supabase with status 'pending'
    const { data: purchase, error: purchaseError } = await supabase
      .from("purchases")
      .insert({
        user_id: userId,
        course_id: courseId,
        payment_status: "pending",
        transaction_id: orderId,
        amount: Number(course.price),
        created_at: new Date().toISOString(),
        payment_mode: paymentMode,
      })
      .select()
      .single();

    if (purchaseError) {
      console.error("[Cashfree][create-order] ❌ Failed to create purchase record:", purchaseError);
      // Note: Cashfree order is already created, but database insert failed
      // The webhook can still update the status later if payment succeeds
      res.status(500).json({ 
        message: "Failed to create purchase record",
        error: purchaseError.message,
        orderId: orderId,
        warning: "Order created in Cashfree but database record failed. Proceed with caution."
      });
      return;
    }

    console.log("[Cashfree][create-order] ✅ Purchase record created in Supabase");
    console.log("[Cashfree][create-order] Purchase ID:", purchase.id);
    console.log("[Cashfree][create-order] Payment Status:", purchase.payment_status);

    // Return success response with payment session ID
    res.status(200).json({
      success: true,
      orderId: cashfreeData.order_id,
      payment_session_id: cashfreeData.payment_session_id,
      order_status: cashfreeData.order_status,
      purchaseId: purchase.id,
      course: {
        id: course.id,
        title: course.title,
        price: course.price,
      },
    });

  } catch (err) {
    console.error("[Cashfree][create-order] ❌ Unexpected error:", err);
    res.status(500).json({ 
      message: "Internal Server Error",
      error: err.message 
    });
  }
}
