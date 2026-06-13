"use client";

import React, { useRef, useState } from "react";
import styles from "./ComingSoon.module.css";
import { WaitlistService } from "@/lib/api/waitlistService";

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOUBLE_SUBMIT_MS = 5000;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const ga = (name: string, params?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
};

const fbq = (event: string, params?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, params);
  }
};

const NotifyForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const lastSubmitRef = useRef<number>(0);
  const focusedOnceRef = useRef<boolean>(false);

  const onFocus = () => {
    if (focusedOnceRef.current) return;
    focusedOnceRef.current = true;
    ga("notify_form_focus");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitRef.current < DOUBLE_SUBMIT_MS) return;

    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }

    lastSubmitRef.current = now;
    setStatus("submitting");
    setMessage(null);
    ga("notify_signup_submit");

    const result = await WaitlistService.signup({ email: trimmed, website });

    if (result.ok) {
      setStatus("success");
      setMessage("You're on the list. See you at launch.");
      ga("notify_signup_success");
      fbq("Lead", { content_name: "coming_soon_waitlist" });
    } else {
      setStatus("error");
      setMessage(result.error || "Something went wrong. Please try again.");
      ga("notify_signup_error", { message: result.error });
    }
  };

  if (status === "success") {
    return (
      <p className={styles.formSuccess} role="status">
        {message}
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className={styles.honeypot}
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      <label htmlFor="cs-email" className={styles.formLabel}>
        Email address
      </label>
      <div className={styles.formRow}>
        <input
          id="cs-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={onFocus}
          className={styles.formInput}
          disabled={status === "submitting"}
        />
        <button
          type="submit"
          className={styles.formButton}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : "Notify me"}
        </button>
      </div>
      {status === "error" && message ? (
        <p className={styles.formError} role="alert">
          {message}
        </p>
      ) : null}
    </form>
  );
};

export default NotifyForm;
