"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import {
  OrderService,
  OrderDetail,
  getOrderInvoice,
} from "@/lib/api/orderService";
import { useAuth } from "@/context/SupabaseAuthContext";
import Image from "next/image";
import { notifications } from "@mantine/notifications";

const STATUS_STEPS = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "In Transit",
  PARTIALLY_SHIPPED: "In Transit",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
};

function getStepIndex(status: string): number {
  if (status === "PARTIALLY_SHIPPED") return STATUS_STEPS.indexOf("SHIPPED");
  return STATUS_STEPS.indexOf(status);
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatAmount(amount?: number | string): string {
  if (amount === undefined || amount === null) return "—";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `₹ ${num.toLocaleString("en-IN")}`;
}

export default function OrderDetailsPage() {
  const { user, isAuthLoading } = useAuth();

  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    OrderService.getUserOrders(user.id)
      .then((data) => {
        const raw = Array.isArray(data)
          ? data
          : ((data as { data?: OrderDetail[] }).data ?? []);
        const list = Array.isArray(raw) ? raw : [];
        setOrders(list);
        if (list.length > 0) setSelectedOrder(list[0]);
      })
      .catch(() => setError("Failed to load order details. Please try again."))
      .finally(() => setLoading(false));
  }, [user, isAuthLoading]);

  if (loading || isAuthLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.stateContainer}>
          <p className={styles.stateText}>Loading your order…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.stateContainer}>
          <p className={styles.stateText}>
            Please sign in to view your orders.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.stateContainer}>
          <p className={styles.stateText}>{error}</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0 || !selectedOrder) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.stateContainer}>
          <p className={styles.stateText}>You have no orders yet.</p>
        </div>
      </div>
    );
  }

  async function handleDownloadInvoice(orderId: string) {
    setInvoiceLoading(true);
    try {
      const url = await getOrderInvoice(orderId);
      window.open(url, "_blank");
    } catch {
      notifications.show({
        title: "Invoice unavailable",
        message:
          "Could not generate invoice. Please contact care@qalachowk.com",
        color: "red",
      });
    } finally {
      setInvoiceLoading(false);
    }
  }

  const order = selectedOrder;
  const stepIndex = getStepIndex(order.status);
  const isCancelled =
    order.status === "CANCELLED" || order.status === "RETURNED";
  const shippingAddr = order.shippingAddress;
  const billingAddr = order.billingAddress;
  return (
    <div className={styles.pageWrapper}>
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <span className={styles.eyebrow}>Your Order</span>
        <h1 className={styles.pageTitle}>#{order.id}</h1>
        <div className={styles.orderMeta}>
          <p className={styles.orderDate}>
            Placed on{" "}
            <span className={styles.orderDateValue}>
              {formatDate(order.createdAt)}
            </span>
          </p>
          <span className={styles.statusBadge}>
            {STATUS_LABELS[order.status] ?? order.status}
          </span>
        </div>
      </div>

      {/* ── Order Timeline ── */}
      {!isCancelled && (
        <div className={styles.timelineSection}>
          <div className={styles.timelineRelative}>
            <div className={styles.timelineLine} />
            <div className={styles.timelineFlex}>
              {STATUS_STEPS.map((step, i) => {
                const isActive = i <= stepIndex;
                const isCurrent = i === stepIndex;
                return (
                  <div key={step} className={styles.timelineNode}>
                    <div
                      className={
                        isCurrent
                          ? styles.dotActiveRing
                          : isActive
                            ? styles.dotActive
                            : styles.dotInactive
                      }
                    />
                    <span
                      className={
                        isActive ? styles.nodeLabelActive : styles.nodeLabel
                      }
                    >
                      {STATUS_LABELS[step]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content Grid ── */}
      <div className={styles.contentGrid}>
        {/* Left: Items */}
        <div className={styles.itemsColumn}>
          <h2 className={styles.columnHeading}>Your Selection</h2>
          <p className={styles.columnSubheading}>
            {order.orderItems.length === 1
              ? "1 item"
              : `${order.orderItems.length} items`}
          </p>
          <div className={styles.itemsList}>
            {order.orderItems.map((item, i) => (
              <div key={item.id ?? i} className={styles.itemRow}>
                <div className={styles.itemImageWrap}>
                  {item.product?.images?.[0] && (
                    <Image
                      className={styles.itemImage}
                      src={item.product.images[0].url}
                      alt={item.product?.name ?? "Product"}
                      objectFit="contain"
                      fill
                    />
                  )}
                </div>
                <div className={styles.itemInfo}>
                  <h4 className={styles.itemName}>
                    {item.product?.name ??
                      `Product #${item.productId.slice(0, 8).toUpperCase()}`}
                  </h4>
                  {item.price !== undefined && (
                    <p className={styles.itemPrice}>
                      {formatAmount(item.price)}
                    </p>
                  )}
                  <p className={styles.itemQty}>Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Summary Panel */}
        <div className={styles.summaryColumn}>
          <div className={styles.summaryPanel}>
            <h2 className={styles.summaryHeading}>Order Summary</h2>

            {/* Addresses */}
            <div className={styles.addressSection}>
              <div className={styles.addressBlock}>
                <span className={styles.addressLabel}>Shipping Address</span>
                <address className={styles.addressText}>
                  {shippingAddr.address}
                  {shippingAddr.street && (
                    <>
                      <br />
                      {shippingAddr.street}
                    </>
                  )}
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

              <div className={styles.addressBlock}>
                <span className={styles.addressLabel}>Billing Address</span>
                <address className={styles.addressText}>
                  {billingAddr ? (
                    <>
                      {billingAddr.address}
                      {billingAddr.street && (
                        <>
                          <br />
                          {billingAddr.street}
                        </>
                      )}
                      <br />
                      {billingAddr.city}, {billingAddr.state}{" "}
                      {billingAddr.pinCode}
                      <br />
                      {billingAddr.country}
                    </>
                  ) : (
                    "Same as shipping address"
                  )}
                </address>
              </div>
            </div>

            <div className={styles.summaryDivider} />

            {/* Pricing Rows */}
            {(() => {
              const displayTotal = order.total ?? 0;
              const displayTax =
                order.tax !== undefined
                  ? order.tax
                  : Math.round((displayTotal * 3) / 103);
              const displaySubtotal =
                order.subtotal !== undefined
                  ? order.subtotal
                  : displayTotal - displayTax;
              return (
                <>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>
                      Subtotal (excl. GST)
                    </span>
                    <span className={styles.summaryValue}>
                      {formatAmount(displaySubtotal)}
                    </span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Shipping</span>
                    <span className={styles.summaryShipping}>
                      Complimentary
                    </span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>GST (3%)</span>
                    <span className={styles.summaryValue}>
                      {formatAmount(displayTax)}
                    </span>
                  </div>

                  <div className={styles.totalRow}>
                    <span className={styles.totalLabel}>Grand Total</span>
                    <span className={styles.totalValue}>
                      {formatAmount(displayTotal)}
                    </span>
                  </div>
                </>
              );
            })()}

            {/* Actions */}
            <div className={styles.actionsBox}>
              {order.trackingNumber && (
                <a
                  className={styles.primaryButton}
                  href={`https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx?consignmentno=${order.trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Track Shipment
                </a>
              )}
              <button
                className={
                  order.trackingNumber
                    ? styles.secondaryButton
                    : styles.primaryButton
                }
                onClick={() => handleDownloadInvoice(order.id)}
                disabled={invoiceLoading}
              >
                {invoiceLoading ? "Generating…" : "Download Invoice"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Order History ── */}
      <div className={styles.historySection}>
        <h2 className={styles.historySectionHeading}>Order History</h2>
        <div className={styles.historyList}>
          {orders.map((o) => {
            const isActive = o.id === order.id;
            return (
              <button
                key={o.id}
                className={
                  isActive
                    ? `${styles.historyItem} ${styles.historyItemActive}`
                    : styles.historyItem
                }
                onClick={() => {
                  if (!isActive) {
                    setSelectedOrder(o);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                <div className={styles.historyLeft}>
                  <span className={styles.historyId}>#{o.id}</span>
                  <span className={styles.historyDate}>
                    {formatDate(o.createdAt)}
                  </span>
                </div>
                <div className={styles.historyRight}>
                  <span className={styles.historyStatus}>
                    {STATUS_LABELS[o.status] ?? o.status}
                  </span>
                  <span className={styles.historyTotal}>
                    {formatAmount(o.total)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Help Section ── */}
      <div className={styles.helpSection}>
        <p className={styles.helpTitle}>Need assistance with your heirloom?</p>
        <p className={styles.helpText}>
          Our curators are available daily from 10 AM to 7 PM.
        </p>
        <a className={styles.helpLink} href="mailto:hello@qalachowk.com">
          Contact Support
        </a>
      </div>
    </div>
  );
}
