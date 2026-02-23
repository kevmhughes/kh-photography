import React, { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import StickyLinks from "../StickyLinks/StickyLinks";
import "./Contact.css";

import toast from "react-hot-toast";

declare global {
  interface Window {
    grecaptcha: {
      reset: () => void;
      getResponse: () => string;
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options?: { action?: string },
      ) => Promise<string>;
    };
  }
}

const Contact = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    message: "",
  });

  useEffect(() => {
    Object.keys(localStorage)
      .filter((key) => key.startsWith("rc::"))
      .forEach((key) => localStorage.removeItem(key));
  }, []);

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!captchaToken) {
      toast.error("Please complete the reCAPTCHA.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          "g-recaptcha-response": captchaToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result?.error);
      toast.success("Your message has been sent successfully!");

      // Reset form
      setFormData({
        user_name: "",
        user_email: "",
        message: "",
      });
    } catch (err) {
      console.error("Error sending email:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setCaptchaToken(null);
      window.grecaptcha?.reset();
      setIsSubmitting(false);
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

          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaChange}
          />

          <button
            type="submit"
            className="form-text form-button"
            disabled={!captchaToken || isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
