import React from "react";
import styles from "./page.module.css";

export default function OrderDetailsPage() {
  return (
    <div className={styles.pageContainer}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.headerFlex}>
          <div>
            <h2 className={styles.orderId}>Order #QC-8821</h2>
            <p className={styles.orderDate}>Placed on October 24, 2026</p>
          </div>
          <div className={styles.statusContainer}>
            <span className={styles.statusBadge}>In Transit</span>
            <p className={styles.estimatedDelivery}>
              Estimated Delivery: Oct 28, 2026
            </p>
          </div>
        </div>
      </header>

      {/* Order Timeline */}
      <section className={styles.timelineSection}>
        <div className={styles.timelineRelative}>
          <div className={styles.timelineLine}></div>
          <div className={styles.timelineFlex}>
            {/* Confirmed */}
            <div className={styles.timelineNode}>
              <div className={styles.dotActive}></div>
              <span className={styles.nodeLabelActiveMedium}>Confirmed</span>
            </div>
            {/* Processing */}
            <div className={styles.timelineNode}>
              <div className={styles.dotActive}></div>
              <span className={styles.nodeLabelActiveMedium}>Processing</span>
            </div>
            {/* In Transit */}
            <div className={styles.timelineNode}>
              <div className={styles.dotActiveRing}></div>
              <span className={styles.nodeLabelActiveBold}>In Transit</span>
            </div>
            {/* Delivered */}
            <div className={styles.timelineNode}>
              <div className={styles.dotInactive}></div>
              <span className={styles.nodeLabelInactive}>Delivered</span>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.mandanaDivider}></div>

      {/* Order Content Grid */}
      <div className={styles.gridContainer}>
        {/* Left: Items */}
        <div className={styles.leftColumn}>
          <h3 className={styles.selectionTitle}>Your Selection</h3>
          <div className={styles.itemsList}>
            {/* Item 1 */}
            <div className={styles.itemRow}>
              <div className={styles.itemImageContainer}>
                <img
                  alt="Sienna Choker"
                  className={styles.itemImage}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNfB3XCVgrXvABwqJx8C0f2DeNgCCjl9MGQJXBRovZfyxB7WZacgFMM9kF7SlKxhkd5IJPXV-qWoeLlg4vysRa-Vm_pnGthop4hVNW3rZVeUcfjGZC_BWK7_V816RzwWx6Og68mGUwAx4qgHiPrOz1uyLDMxSOvFQNSWo08SViZvRZ4nntwbO6yed7CRdoRGHEcjBLUqdNUtfPxHO5vPQLj14Ly4bgAirSZGUxjs_IH04ZJ1rRqvvnJWx5b017C5OYBQ0O514M39ns"
                />
              </div>
              <div className={styles.itemDetails}>
                <div className={styles.itemTitleRow}>
                  <h4 className={styles.itemTitle}>Sienna Choker</h4>
                  <p className={styles.itemPrice}>₹18,500</p>
                </div>
                <p className={styles.itemDescription}>
                  Hand-etched brass with terracotta bead detailing.
                </p>
                <p className={styles.itemQuantity}>Quantity: 1</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className={styles.itemRow}>
              <div className={styles.itemImageContainer}>
                <img
                  alt="Madhubani Meadows Earring"
                  className={styles.itemImage}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtp7JlFN2QXF3LcKw2mPWvgxMjL9fcvhxhuEwcGruNR5PkY4EBWLQKQ90Dp-5n3K1OORBkSgaBTXIreE2XgKNBpJ9_sB1nrMJ-gEU2Ln5adCzZIR2Ukt64uE523bIdUF5bgZamN4Qi50Q9Ql93wSbcJJIkar2tp4QbUxql16WqRoaWdHroSW6dwdCV4oLT-8cFysr3BTFQOyDGHoymCTM1i4mizysxy_WLO-vssBv4_Jx3sRHX5fnXWEFuH1YXPN4d_gDSBiqHaJe5"
                />
              </div>
              <div className={styles.itemDetails}>
                <div className={styles.itemTitleRow}>
                  <h4 className={styles.itemTitle}>
                    Madhubani Meadows Earring
                  </h4>
                  <p className={styles.itemPrice}>₹6,200</p>
                </div>
                <p className={styles.itemDescription}>
                  Fine silver filigree with miniature floral motifs.
                </p>
                <p className={styles.itemQuantity}>Quantity: 1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Details & Summary */}
        <div className={styles.rightColumn}>
          <div className={styles.summaryBox}>
            {/* Address Section */}
            <div className={styles.addressGrid}>
              <div>
                <h5 className={styles.addressLabel}>Shipping Address</h5>
                <address className={styles.addressText}>
                  Aditi Sharma
                  <br />
                  42 Silver Oak Avenue, Koramangala
                  <br />
                  Bengaluru, Karnataka 560034
                  <br />
                  India
                </address>
              </div>
              <div>
                <h5 className={styles.addressLabel}>Billing Address</h5>
                <address className={styles.addressText}>
                  Same as shipping address
                </address>
              </div>
            </div>

            <div className={styles.lightDivider}></div>

            {/* Summary */}
            <div className={styles.summaryMetrics}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal</span>
                <span className={styles.summaryValue}>₹24,700</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Shipping</span>
                <span className={styles.summaryValueStressed}>
                  Complimentary
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Estimated Tax</span>
                <span className={styles.summaryValue}>₹4,446</span>
              </div>
            </div>

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>₹29,146</span>
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
