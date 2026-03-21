"use client";
import { Suspense } from "react";
import styles from "./page.module.css";
import { useRouter, useSearchParams } from "next/navigation";

function OrderConfirmedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className={styles.mainContainer}>
      <div className={styles.contentWrapper}>
        {/* Success Icon Motif */}
        <div className={styles.iconWrapper}>
          <div className={`${styles.iconDiamond} ${styles.rotate45}`}></div>
          <div className={`${styles.iconDiamond} ${styles.rotateN12}`}></div>
          <div className={styles.iconCenter}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48px"
              viewBox="0 -960 960 960"
              width="48px"
              fill="currentColor"
            >
              <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h2 className={styles.heading}>Thank you for your order!</h2>

        {/* Order Info */}
        <p className={styles.orderNumber}>
          {orderId ? `Order #${orderId}` : "Order Confirmed"}
        </p>
        <p className={styles.deliveryDate}>Arriving by March 24th</p>

        {/* Mandana Divider */}
        <div className={styles.mandanaDivider}></div>

        {/* Summary Card */}
        <div className={styles.summaryCard}>
          <div className={styles.summaryHeader}>
            <span className={styles.summaryLabel}>Estimated Delivery</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#B8860B"
            >
              <path d="M240-160q-50 0-85-35t-35-85H40v-440h520v140h260v240l-87 87q-15 41-51 67t-82 26q-46 0-82-26t-51-67H458q-15 41-51 67t-82 26Zm0-80q17 0 28.5-11.5T280-280q0-17-11.5-28.5T240-320q-17 0-28.5 11.5T200-280q0 17 11.5 28.5T240-240Zm400 0q17 0 28.5-11.5T680-280q0-17-11.5-28.5T640-320q-17 0-28.5 11.5T600-280q0 17 11.5 28.5T640-240ZM120-360h32q17-38 54-61t84-23q47 0 84 23t54 61h132v-360H120v360Zm560 0h34l66-66v-154H560v220h32q17-38 54-61t84-23q47 0 84 23Z" />
            </svg>
          </div>
          <div className={styles.summaryDates}>March 22nd — March 24th</div>
          <p className={styles.summaryDesc}>
            A notification will be sent when your items are dispatched from our
            studio.
          </p>
        </div>

        {/* Actions */}
        <button
          className={styles.primaryActionButton}
          onClick={() => router.push("/")}
        >
          Continue Shopping
          <svg
            className={styles.buttonArrow}
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="currentColor"
          >
            <path d="m700-300-57-56 84-84H120v-80h607l-83-84 57-56 179 180-180 180Z" />
          </svg>
        </button>

        <button
          className={styles.secondaryActionText}
          onClick={() => router.push(`/order-details?orderId=${orderId}`)}
        >
          View Order Details
        </button>
      </div>

      {/* Decorative Focus Image */}
      <div className={styles.decorativeImageContainer}>
        <div
          className={styles.decorativeImage}
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAQuexfB65bTW6XFvFgC5_yzIGB32BpTplRz8uy08m6rtkv33390ptXha92z6TSxHrvgm6TjY4l87-Ohftp-bTYhK7PqeaEqRxjX88q0JRNApvBHNIHn1gCqKjzYco9ZvqVcqMutwGQ_2Nn9JxjXO9d_vdyegXOLwdv8F-mfutvCsdBCkzAHfSBxgHEXcT9xUIKP6AaB2i_ly6skicp2lBJ5bbnvcFxA0HCx2IspLZRzP05cFYIwNIM9nLO3P4sYm12X_1j8Nx-u4Un')",
          }}
        />
      </div>
    </main>
  );
}

export default function OrderConfirmed() {
  return (
    <Suspense>
      <OrderConfirmedContent />
    </Suspense>
  );
}
