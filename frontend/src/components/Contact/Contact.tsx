import React, { useState } from "react";
import StickyLinks from "../StickyLinks/StickyLinks";
import "./Contact.css";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const Contact = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    message: "",
  });

  const [status, setStatus] = useState<"success" | "error" | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = window.grecaptcha?.getResponse();

      if (!token) {
        setStatus("error");
        return;
      }

      const response = await fetch("/api/contact/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, token }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result?.error);

      setStatus("success");

      setFormData({
        user_name: "",
        user_email: "",
        message: "",
      });

      window.grecaptcha.reset();

    } catch (err) {
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

          {/* ✅ reCAPTCHA v2 Checkbox */}
          <div
            className="g-recaptcha"
            data-sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            style={{ margin: "15px 0" }}
          ></div>

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
              Please complete the reCAPTCHA and try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;