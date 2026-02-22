export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { user_name, user_email, message, "g-recaptcha-response": token } = body;

  if (!token) {
    return res.status(400).json({ error: "Missing reCAPTCHA token" });
  }

  if (!user_name || !user_email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!token) {
    return res.status(400).json({ error: "Missing reCAPTCHA token" });
  }

  try {
    // Verify reCAPTCHA v2 with Google
    const recaptchaResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        }),
      }
    );

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }

    // Send email via EmailJS
    const emailResponse = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: process.env.EMAILJS_SERVICE_ID,
          template_id: process.env.EMAILJS_TEMPLATE_ID,
          user_id: process.env.EMAILJS_PUBLIC_KEY,
          accessToken: process.env.EMAILJS_PRIVATE_KEY,
          template_params: { user_name, user_email, message, "g-recaptcha-response": token },
        }),
      }
    );

    console.log("Sending to EmailJS, token:", token);

    if (!emailResponse.ok) {
      const text = await emailResponse.text();
      throw new Error(text || "Failed to send email via EmailJS");
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({
      error: err.message || "Internal Server Error",
    });
  }
}