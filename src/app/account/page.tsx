"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/SupabaseAuthContext";
import styles from "./page.module.css";
import Link from "next/link";

export default function AccountPage() {
  const { user, isAuthLoading, logout } = useAuth();
  const router = useRouter();

  if (isAuthLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.stateContainer}>
          <p className={styles.stateText}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.stateContainer}>
          <p className={styles.stateText}>
            Please sign in to view your account.
          </p>
          <button
            className={styles.btnPrimary}
            onClick={() => router.push("/")}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const fullName =
    user.firstName || user.lastName
      ? [user.firstName, user.lastName].filter(Boolean).join(" ")
      : null;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <span className={styles.eyebrow}>Your Account</span>
        <h1 className={styles.pageTitle}>{fullName ?? "Welcome back"}</h1>
      </div>

      {/* Profile Card */}
      <div className={styles.contentGrid}>
        <div className={styles.profileSection}>
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Profile Details</h2>

            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>Name</span>
              <span className={styles.fieldValue}>{fullName ?? "—"}</span>
            </div>

            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>Phone</span>
              <span className={styles.fieldValue}>{user.phone ?? "—"}</span>
            </div>
          </div>
        </div>

        <div className={styles.linksSection}>
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>My Orders</h2>
            <p className={styles.sectionDesc}>
              View your order history, track shipments, and download invoices.
            </p>
            <Link href="/order-details" className={styles.btnOutline}>
              View Orders →
            </Link>
          </div>

          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Wishlist</h2>
            <p className={styles.sectionDesc}>
              Browse the pieces you&apos;ve saved for later.
            </p>
            <Link href="/wishlist" className={styles.btnOutline}>
              View Wishlist →
            </Link>
          </div>

          <div className={styles.sectionCard}>
            <button className={styles.btnLogout} onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
