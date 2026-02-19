import React, { useState } from "react";
import StickyLinks from "../StickyLinks/StickyLinks";
import "./Contact.css";

interface Contact {}

const Contact = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    message: "",
  });

  console.log("form data", formData);

  const [status, setStatus] = React.useState<"success" | "error" | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/contact/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let result: any;
      try {
        result = await response.json(); // try parse JSON
      } catch {
        const text = await response.text(); // fallback to text
        throw new Error(text || "Unknown server error");
      }

      if (!response.ok) {
        throw new Error(result?.error || "Failed to send email");
      }

      alert("Email sent successfully!");
      setStatus("success");
    } catch (err: any) {
      console.error("Error sending email:", err);
      alert("Failed to send email: " + err.message);
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
          <input type="hidden" name="contact_number" />
          <label className="form-text">Name</label>
          <input
            type="text"
            id="name"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            required
          />
          <label className="form-text">E-mail</label>
          <input
            type="email"
            id="email"
            name="user_email"
            value={formData.user_email}
            onChange={handleChange}
            required
          />
          <label className="form-text">Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            minLength={10}
            maxLength={500}
            placeholder="Write your message here..."
            className="form-text"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <div
            className="g-recaptcha"
            data-sitekey="6LeltFkrAAAAAPEG8JPYSCXDftKf4CjX2v6Q7AlN"
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
              Something went wrong, please try again later.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
