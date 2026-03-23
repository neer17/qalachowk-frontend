"use client";
import { Suspense, useEffect, useState } from "react";
import styles from "./page.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { OrderService, OrderDetail } from "@/lib/api/orderService";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return result;
}

function calculateDeliveryRange(createdAt?: string): string {
  const base = createdAt ? new Date(createdAt) : new Date();
  const start = addBusinessDays(base, 3);
  const end = addBusinessDays(base, 5);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()} – ${fmt(end)}`;
  }
  return `${fmt(start)} – ${fmt(end)}`;
}

function formatAmount(amount?: number | string): string {
  if (amount === undefined || amount === null) return "—";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `₹ ${num.toLocaleString("en-IN")}`;
}

function OrderConfirmedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    OrderService.getOrder(orderId)
      .then((res) => setOrder(res.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  const shortId = orderId ?? null;
  const shippingAddr = order?.shippingAddress;

  return (
    <main className={styles.page}>
      {/* ═══════ EDITORIAL HERO ═══════ */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <svg
            className={styles.heroBgSvg}
            viewBox="0 0 900 580"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="680"
              cy="290"
              r="260"
              stroke="#C8956C"
              strokeWidth="0.5"
              opacity="0.12"
            />
            <circle
              cx="680"
              cy="290"
              r="195"
              stroke="#C8956C"
              strokeWidth="0.5"
              opacity="0.09"
            />
            <circle
              cx="680"
              cy="290"
              r="130"
              stroke="#C8956C"
              strokeWidth="0.5"
              opacity="0.07"
            />
            <polygon
              points="680,50 900,290 680,530 460,290"
              stroke="#C8956C"
              strokeWidth="0.5"
              opacity="0.09"
              fill="none"
            />
            <line
              x1="460"
              y1="50"
              x2="900"
              y2="530"
              stroke="#C8956C"
              strokeWidth="0.3"
              opacity="0.05"
            />
            <line
              x1="900"
              y1="50"
              x2="460"
              y2="530"
              stroke="#C8956C"
              strokeWidth="0.3"
              opacity="0.05"
            />
            <circle
              cx="680"
              cy="290"
              r="44"
              stroke="#C8956C"
              strokeWidth="0.5"
              opacity="0.13"
            />
          </svg>
        </div>

        <div className={styles.heroScrim} />

        <div className={styles.heroContent}>
          {/* ── Left: confirmation headline ── */}
          <div className={styles.heroLeft}>
            <div className={styles.eyebrow}>Order Confirmed</div>

            <div className={styles.iconRow}>
              <div className={styles.iconWrap}>
                <div className={styles.iconRing1} />
                <div className={styles.iconRing2} />
                <div className={styles.iconCore}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="28px"
                    viewBox="0 -960 960 960"
                    width="28px"
                    fill="currentColor"
                  >
                    <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className={styles.headline}>
              Thank you for
              <br />
              your <em>order</em>
            </h1>

            {shortId && (
              <div className={styles.orderIdBlock}>
                <div className={styles.orderIdLabel}>Order</div>
                <div className={styles.orderIdValue}>#{shortId}</div>
                {order?.createdAt && (
                  <div className={styles.orderDate}>
                    Placed on {formatDate(order.createdAt)}
                  </div>
                )}
              </div>
            )}

            <svg
              className={styles.fish}
              width="52"
              height="26"
              viewBox="0 0 52 26"
              fill="none"
            >
              <ellipse
                cx="32"
                cy="13"
                rx="16"
                ry="8"
                stroke="#C8956C"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M16 13 L4 5 L4 21 Z"
                stroke="#C8956C"
                strokeWidth="1"
                fill="none"
              />
              <circle cx="42" cy="10" r="2.5" fill="#C8956C" />
              <path
                d="M22 8 Q32 5 40 8"
                stroke="#C8956C"
                strokeWidth=".8"
                fill="none"
              />
              <path
                d="M22 18 Q32 21 40 18"
                stroke="#C8956C"
                strokeWidth=".8"
                fill="none"
              />
            </svg>

            <p className={styles.subText}>
              Your craft begins its journey from our Jaipur studio.
            </p>
          </div>

          {/* ── Right: frosted delivery pill ── */}
          <div className={styles.heroRight}>
            <div className={styles.glassPill}>
              <div className={styles.pillEyebrow}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="14px"
                  viewBox="0 -960 960 960"
                  width="14px"
                  fill="#C8956C"
                >
                  <path d="M240-160q-50 0-85-35t-35-85H40v-440h520v140h260v240l-87 87q-15 41-51 67t-82 26q-46 0-82-26t-51-67H458q-15 41-51 67t-82 26Zm0-80q17 0 28.5-11.5T280-280q0-17-11.5-28.5T240-320q-17 0-28.5 11.5T200-280q0 17 11.5 28.5T240-240Zm400 0q17 0 28.5-11.5T680-280q0-17-11.5-28.5T640-320q-17 0-28.5 11.5T600-280q0 17 11.5 28.5T640-240ZM120-360h32q17-38 54-61t84-23q47 0 84 23t54 61h132v-360H120v360Zm560 0h34l66-66v-154H560v220h32q17-38 54-61t84-23q47 0 84 23Z" />
                </svg>
                Estimated Delivery
              </div>
              <div className={styles.pillDates}>
                {calculateDeliveryRange(order?.createdAt)}
              </div>
              <p className={styles.pillDesc}>
                A notification will be sent when your items are dispatched from
                our studio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MANDANA DIVIDER ═══ */}
      <div className={styles.mandanaBar} />

      {/* ═══════ ORDER DETAILS ═══════ */}
      {loading ? (
        <section className={styles.loadingSection}>
          <div className={styles.loadingDot} />
          <p className={styles.loadingText}>Retrieving your order…</p>
        </section>
      ) : order ? (
        <section className={styles.detailsSection}>
          <div className={styles.detailsGrid}>
            {/* ── Left: items ── */}
            <div className={styles.itemsCol}>
              <div className={styles.colEyebrow}>Your Selection</div>
              <div className={styles.colTitle}>
                {order.orderItems.length === 1
                  ? "1 item"
                  : `${order.orderItems.length} items`}
              </div>
              <div className={styles.itemsList}>
                {order.orderItems.map((item, i) => (
                  <div key={item.id ?? i} className={styles.itemRow}>
                    <div className={styles.itemImageWrap}>
                      {item.product?.images?.[0] ? (
                        <Image
                          className={styles.itemImage}
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      ) : (
                        <div className={styles.itemImagePh}>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 36 36"
                            fill="none"
                            stroke="#C8956C"
                            strokeWidth=".75"
                          >
                            <rect
                              x="8"
                              y="8"
                              width="20"
                              height="20"
                              fill="none"
                            />
                            <polygon
                              points="18,10 28,18 18,26 8,18"
                              fill="none"
                            />
                            <circle cx="18" cy="18" r="4" fill="none" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>
                        {item.product?.name ??
                          `Product #${item.productId.slice(0, 8).toUpperCase()}`}
                      </div>
                      <div className={styles.itemQty}>
                        Qty · {item.quantity}
                      </div>
                      {item.price !== undefined && (
                        <div className={styles.itemPrice}>
                          {formatAmount(item.price)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: summary ── */}
            <div className={styles.summaryCol}>
              {/* Shipping address */}
              {shippingAddr && (
                <div className={styles.addressBlock}>
                  <div className={styles.addressLabel}>Shipping Address</div>
                  <address className={styles.addressText}>
                    {shippingAddr.address}
                    {shippingAddr.street && <>, {shippingAddr.street}</>}
                    <br />
                    {shippingAddr.city}, {shippingAddr.state}{" "}
                    {shippingAddr.pinCode}
                    <br />
                    {shippingAddr.country}
                    {shippingAddr.phone && (
                      <>
                        <br />
                        {shippingAddr.phone}
                      </>
                    )}
                  </address>
                </div>
              )}

              <div className={styles.hairline} />

              {/* Pricing breakdown */}
              <div className={styles.pricingRows}>
                <div className={styles.pricingRow}>
                  <span className={styles.pricingLabel}>Subtotal</span>
                  <span className={styles.pricingValue}>
                    {formatAmount(order.subtotal)}
                  </span>
                </div>
                <div className={styles.pricingRow}>
                  <span className={styles.pricingLabel}>Shipping</span>
                  <span className={styles.pricingFree}>Complimentary</span>
                </div>
                {order.tax !== undefined && (
                  <div className={styles.pricingRow}>
                    <span className={styles.pricingLabel}>Tax</span>
                    <span className={styles.pricingValue}>
                      {formatAmount(order.tax)}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Grand Total</span>
                <span className={styles.totalValue}>
                  {formatAmount(order.total)}
                </span>
              </div>

              <div className={styles.hairline} />

              {/* Actions */}
              <div className={styles.actions}>
                <button
                  className={styles.btnPrimary}
                  onClick={() => router.push("/")}
                >
                  Continue Shopping
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="17px"
                    viewBox="0 -960 960 960"
                    width="17px"
                    fill="currentColor"
                  >
                    <path d="m700-300-57-56 84-84H120v-80h607l-83-84 57-56 179 180-180 180Z" />
                  </svg>
                </button>
                <button
                  className={styles.btnGhost}
                  onClick={() =>
                    router.push(`/order-details?orderId=${orderId}`)
                  }
                >
                  View Order Details
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Fallback when order fetch fails */
        <section className={styles.fallbackSection}>
          <div className={styles.actions}>
            <button
              className={styles.btnPrimary}
              onClick={() => router.push("/")}
            >
              Continue Shopping
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="17px"
                viewBox="0 -960 960 960"
                width="17px"
                fill="currentColor"
              >
                <path d="m700-300-57-56 84-84H120v-80h607l-83-84 57-56 179 180-180 180Z" />
              </svg>
            </button>
            <button
              className={styles.btnGhost}
              onClick={() => router.push(`/order-details?orderId=${orderId}`)}
            >
              View Order Details
            </button>
          </div>
        </section>
      )}
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
