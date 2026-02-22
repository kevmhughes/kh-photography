import React, { useState, useEffect } from "react";
import StickyLinks from "../StickyLinks/StickyLinks";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    message: "",
  });

  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load reCAPTCHA v3 dynamically
  useEffect(() => {
    if (!window.grecaptcha) {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Safely get reCAPTCHA token
  const getRecaptchaToken = async (): Promise<string> => {
    if (!window.grecaptcha) throw new Error("reCAPTCHA not loaded yet");

    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, { action: "contact_form" })
          .then(resolve)
          .catch(reject);
      });
    });
  };

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!scriptLoaded) {
      alert("reCAPTCHA is still loading, please wait a moment.");
      return;
    }

    try {
      const token = await getRecaptchaToken();
      console.log("reCAPTCHA token:", token);

      const response = await fetch("/api/contact/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, token }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || "Failed to send email");

      setStatus("success");
    } catch (err: any) {
      console.error("Error sending email:", err);
      setStatus("error");
    }
  };

  return (
    <div>
      <StickyLinks />
      <div className="contact-form-and-text-container">
        <div className="contact-text">
          For inquiries about prints, licensing, or upcoming photography tours,
          please don’t hesitate to reach out.
        </div>
        <form
          id="contact-form"
          className="contact-container"
          onSubmit={sendEmail}
          style={{ fontFamily: "Raleway" }}
        >
          <label className="form-text">Name</label>
          <input
            type="text"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            required
          />
          <label className="form-text">E-mail</label>
          <input
            type="email"
            name="user_email"
            value={formData.user_email}
            onChange={handleChange}
            required
          />
          <label className="form-text">Message</label>
          <textarea
            name="message"
            rows={5}
            minLength={10}
            maxLength={500}
            placeholder="Write your message here..."
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit" className="form-text form-button">
            Send
          </button>
        </form>

        <div className="container">
          {status === "success" && (
            <div className="container success-message message-container">
              Your message has been sent successfully!
            </div>
          )}
          {status === "error" && (
            <div className="container error-message message-container">
              Something went wrong, please try again later.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;