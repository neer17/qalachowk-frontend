"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { OrderService, OrderDetail } from "@/lib/api/orderService";
import { UserService } from "@/lib/api/userService";
import { useAuth } from "@/context/SupabaseAuthContext";
import Image from "next/image";

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
  const { user } = useAuth();

  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const provider = user.app_metadata?.provider as string | undefined;
    const phone = user.phone ?? undefined;

    UserService.getDbUserId(provider, user.id, phone)
      .then((dbUserId) => OrderService.getUserOrders(dbUserId))
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
  }, [user]);

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <p style={{ textAlign: "center", paddingTop: "4rem" }}>
          Loading order...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.pageContainer}>
        <p
          style={{ textAlign: "center", paddingTop: "4rem", color: "#934b19" }}
        >
          Please sign in to view your orders.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <p
          style={{ textAlign: "center", paddingTop: "4rem", color: "#934b19" }}
        >
          {error}
        </p>
      </div>
    );
  }

  if (orders.length === 0 || !selectedOrder) {
    return (
      <div className={styles.pageContainer}>
        <p style={{ textAlign: "center", paddingTop: "4rem" }}>
          You have no orders yet.
        </p>
      </div>
    );
  }

  const order = selectedOrder;
  const stepIndex = getStepIndex(order.status);
  const isCancelled =
    order.status === "CANCELLED" || order.status === "RETURNED";
  const shippingAddr = order.shippingAddress;
  const billingAddr = order.billingAddress;

  const otherOrders = orders.filter((o) => o.id !== order.id);

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerFlex}>
          <div>
            <h2 className={styles.orderId}>
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h2>
            <p className={styles.orderDate}>
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className={styles.statusContainer}>
            <span className={styles.statusBadge}>
              {STATUS_LABELS[order.status] ?? order.status}
            </span>
            {order.trackingNumber && (
              <p className={styles.estimatedDelivery}>
                Tracking: {order.trackingNumber}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Order Timeline */}
      {!isCancelled && (
        <section className={styles.timelineSection}>
          <div className={styles.timelineRelative}>
            <div className={styles.timelineLine}></div>
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
                    ></div>
                    <span
                      className={
                        isCurrent
                          ? styles.nodeLabelActiveBold
                          : isActive
                            ? styles.nodeLabelActiveMedium
                            : styles.nodeLabelInactive
                      }
                    >
                      {STATUS_LABELS[step]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <div className={styles.mandanaDivider}></div>

      {/* Order Content Grid */}
      <div className={styles.gridContainer}>
        {/* Left: Items */}
        <div className={styles.leftColumn}>
          <h3 className={styles.selectionTitle}>Your Selection</h3>
          <div className={styles.itemsList}>
            {order.orderItems.map((item, i) => (
              <div key={item.id ?? i} className={styles.itemRow}>
                <div className={styles.itemImageContainer}>
                  {item.product?.images?.[0] && (
                    <Image
                      className={styles.itemImage}
                      src={item.product.images[0].url}
                      alt={item.product?.name ?? "Product"}
                      // sizes="(min-width: 768px) 50vw, 100vw"
                      objectFit="contain"
                      fill
                    />
                  )}
                </div>
                <div className={styles.itemDetails}>
                  <div className={styles.itemTitleRow}>
                    <h4 className={styles.itemTitle}>
                      {item.product?.name ??
                        `Product #${item.productId.slice(0, 8).toUpperCase()}`}
                    </h4>
                    {item.price !== undefined && (
                      <p className={styles.itemPrice}>
                        {formatAmount(item.price)}
                      </p>
                    )}
                  </div>
                  <p className={styles.itemQuantity}>
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Summary */}
        <div className={styles.rightColumn}>
          <div className={styles.summaryBox}>
            <div className={styles.addressGrid}>
              <div>
                <h5 className={styles.addressLabel}>Shipping Address</h5>
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
              <div>
                <h5 className={styles.addressLabel}>Billing Address</h5>
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

            <div className={styles.lightDivider}></div>

            <div className={styles.summaryMetrics}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal</span>
                <span className={styles.summaryValue}>
                  {formatAmount(order.subtotal)}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Shipping</span>
                <span className={styles.summaryValueStressed}>
                  Complimentary
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Tax</span>
                <span className={styles.summaryValue}>
                  {formatAmount(order.tax)}
                </span>
              </div>
            </div>

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>
                {formatAmount(order.total)}
              </span>
            </div>

            <div className={styles.actionsBox}>
              <button className={styles.primaryButton}>Track Shipment</button>
              <button className={styles.secondaryButton}>
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* All Orders */}
      {otherOrders.length > 0 && (
        <section className={styles.historySection}>
          <div className={styles.mandanaDividerShort}></div>
          <h3 className={styles.historyTitle}>Your Orders</h3>
          <div className={styles.historyList}>
            {otherOrders.map((o) => (
              <button
                key={o.id}
                className={styles.historyItem}
                onClick={() => {
                  setSelectedOrder(o);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <div className={styles.historyItemLeft}>
                  <span className={styles.historyOrderId}>
                    #{o.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span className={styles.historyOrderDate}>
                    {formatDate(o.createdAt)}
                  </span>
                </div>
                <div className={styles.historyItemRight}>
                  <span className={styles.historyStatus}>
                    {STATUS_LABELS[o.status] ?? o.status}
                  </span>
                  <span className={styles.historyTotal}>
                    {formatAmount(o.total)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Help Section */}
      <section className={styles.helpSection}>
        <div className={styles.mandanaDividerShort}></div>
        <p className={styles.helpTitle}>Need assistance with your heirloom?</p>
        <p className={styles.helpText}>
          Our curators are available daily from 10 AM to 7 PM.
        </p>
        <a className={styles.helpLink} href="#">
          Contact Support
        </a>
      </section>
    </div>
  );
}
