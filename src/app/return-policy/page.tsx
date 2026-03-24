import styles from "@/styles/legal.module.css";

export const metadata = {
  title: "Return & Refund Policy | Qala Chowk",
  description:
    "Return and Refund Policy for products purchased on qalachowk.com, operated by QalaChowk Design Studio LLP.",
};

export default function ReturnPolicy() {
  return (
    <div className={styles.page}>
      <header className={styles.heroHeader}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Return &amp; Refund Policy</h1>
          <p className={styles.heroSubtitle}>
            Each piece is handcrafted with care. Please read our policy on
            returns, refunds, and exchanges before placing your order.
          </p>
          <p className={styles.effectiveDate}>Effective: 24 March 2026</p>
        </div>
      </header>

      <div className={styles.content}>
        {/* Overview */}
        <section className={styles.section}>
          <div className={styles.highlight}>
            <p>
              <strong>Important:</strong> All products sold on qalachowk.com are{" "}
              <strong>non-returnable</strong> and{" "}
              <strong>non-exchangeable</strong> unless the product is received
              in a damaged condition. Please read this policy in its entirety
              before placing an order.
            </p>
          </div>
        </section>

        {/* Scope */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Scope of This Policy</h2>
          <div className={styles.prose}>
            <p>
              This Return and Refund Policy is published in compliance with the
              Consumer Protection (E-Commerce) Rules, 2020 and the Consumer
              Protection Act, 2019. It applies to all purchases made on the
              Platform operated by <strong>QalaChowk Design Studio LLP</strong>{" "}
              (GSTIN: 08AABFQ4036B1ZP).
            </p>
          </div>
        </section>

        {/* Non-Returnable */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            2. Non-Returnable &amp; Non-Exchangeable Products
          </h2>
          <div className={styles.prose}>
            <p>
              Due to the handcrafted nature of our jewellery, all products are{" "}
              <strong>non-returnable</strong> and{" "}
              <strong>non-exchangeable</strong> under normal circumstances. This
              includes, but is not limited to:
            </p>
          </div>
          <ul className={styles.list}>
            <li>Products that you have changed your mind about.</li>
            <li>
              Products with minor variations in colour, texture, weight, or
              finish — these are inherent to handcrafted jewellery and are not
              considered defects.
            </li>
            <li>
              Products that have been used, worn, or altered after delivery.
            </li>
            <li>Products where packaging has been damaged by the customer.</li>
          </ul>
        </section>

        {/* Damaged Goods */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            3. Damaged or Defective Products
          </h2>
          <div className={styles.prose}>
            <p>
              We accept return and refund requests{" "}
              <strong>
                only in cases where the product is received in a damaged or
                defective condition
              </strong>
              . To be eligible for a refund, you must comply with the following
              procedure:
            </p>
          </div>

          <h3 className={styles.sectionSubtitle}>
            a) Mandatory Unboxing Video
          </h3>
          <div className={styles.highlight}>
            <p>
              You <strong>must record a continuous, unedited video</strong>{" "}
              while opening the parcel. The video must clearly show the sealed
              condition of the package before opening, the unboxing process, and
              the damaged/defective product. Refund requests without a valid
              unboxing video shall not be entertained.
            </p>
          </div>

          <h3 className={styles.sectionSubtitle}>
            b) 48-Hour Reporting Window
          </h3>
          <div className={styles.prose}>
            <p>
              The refund request, along with the unboxing video and photographs
              of the damaged product, must be submitted{" "}
              <strong>within forty-eight (48) hours of delivery</strong>.
              Requests received after this window shall not be accepted.
            </p>
          </div>

          <h3 className={styles.sectionSubtitle}>c) How to Submit a Request</h3>
          <div className={styles.prose}>
            <p>
              Send an email to{" "}
              <a href="mailto:care@qalachowk.com">care@qalachowk.com</a> with
              the following details:
            </p>
          </div>
          <ol className={styles.orderedList}>
            <li>Your order number.</li>
            <li>Your registered phone number.</li>
            <li>A clear description of the damage or defect.</li>
            <li>The unboxing video (as an attachment or a shareable link).</li>
            <li>Photographs of the damaged product and packaging.</li>
          </ol>
        </section>

        {/* Verification */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Verification and Approval</h2>
          <div className={styles.prose}>
            <p>
              Upon receiving your request, our team shall review the unboxing
              video and photographs within three (3) business days. We reserve
              the right to reject a refund request if:
            </p>
          </div>
          <ul className={styles.list}>
            <li>
              No unboxing video is provided, or the video is edited, incomplete,
              or unclear.
            </li>
            <li>
              The damage appears to have occurred after delivery due to misuse
              or mishandling by the customer.
            </li>
            <li>
              The request is submitted after the 48-hour reporting window.
            </li>
          </ul>
          <div className={styles.prose}>
            <p>
              You shall be notified of the outcome via email. Our decision in
              this regard shall be final, subject to your rights under the
              Consumer Protection Act, 2019.
            </p>
          </div>
        </section>

        {/* Return Shipping */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Return Shipping</h2>
          <div className={styles.prose}>
            <p>
              If your refund request is approved, you shall be required to ship
              the product back to us. The{" "}
              <strong>
                return shipping cost shall be borne by the customer
              </strong>
              . The product must be returned in its original packaging, unused
              and unaltered, within seven (7) days of receiving approval.
            </p>
            <p>Return shipments must be sent to:</p>
          </div>
          <div className={styles.contactCard}>
            <p className={styles.contactLabel}>Return Address</p>
            <p>
              QalaChowk Design Studio LLP
              <br />
              7/MA/144, Indira Gandhi Nagar,
              <br />
              Jagatpura, Jaipur, Rajasthan — 302017
            </p>
          </div>
        </section>

        {/* Refund Process */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Refund Process</h2>
          <div className={styles.prose}>
            <p>
              Once we receive and inspect the returned product, the refund shall
              be processed as follows:
            </p>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Detail</th>
                <th>Policy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Refund method</td>
                <td>
                  Original payment source (the same method used to make the
                  purchase)
                </td>
              </tr>
              <tr>
                <td>Refund timeline</td>
                <td>
                  Within seven (7) business days of receiving the returned
                  product
                </td>
              </tr>
              <tr>
                <td>Shipping charges refund</td>
                <td>
                  Original shipping charges are non-refundable. Return shipping
                  is borne by the customer.
                </td>
              </tr>
              <tr>
                <td>Partial damage</td>
                <td>
                  If only part of an order is damaged, refund shall be issued
                  only for the affected item(s).
                </td>
              </tr>
            </tbody>
          </table>
          <div className={styles.prose}>
            <p>
              Please note that your bank or payment provider may take additional
              time (typically 5–10 business days) to reflect the refund in your
              account after we initiate it.
            </p>
          </div>
        </section>

        {/* Cancellation */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Order Cancellation</h2>
          <div className={styles.prose}>
            <p>
              You may cancel an order only if it has{" "}
              <strong>not yet been dispatched</strong>. To cancel, email us at{" "}
              <a href="mailto:care@qalachowk.com">care@qalachowk.com</a> with
              your order number. If the order has already been dispatched,
              cancellation shall not be possible and the provisions of this
              policy shall apply.
            </p>
            <p>
              For successfully cancelled orders, a full refund shall be issued
              to the original payment source within seven (7) business days.
            </p>
          </div>
        </section>

        {/* Consumer Rights */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Your Consumer Rights</h2>
          <div className={styles.prose}>
            <p>
              Nothing in this policy shall limit or exclude your statutory
              rights under the Consumer Protection Act, 2019. If you believe
              your complaint has not been adequately addressed, you may:
            </p>
          </div>
          <ol className={styles.orderedList}>
            <li>
              Contact our Grievance Officer — Mr. Neeraj Sewani at{" "}
              <a href="mailto:neerajsewanisrt8@gmail.com">
                neerajsewanisrt8@gmail.com
              </a>{" "}
              or +91 82339 27761.
            </li>
            <li>
              File a complaint on the National Consumer Helpline at{" "}
              <strong>1800-11-4000</strong> or at{" "}
              <a
                href="https://consumerhelpline.gov.in"
                target="_blank"
                rel="noopener noreferrer"
              >
                consumerhelpline.gov.in
              </a>
              .
            </li>
            <li>
              Approach the appropriate Consumer Disputes Redressal Forum under
              the Consumer Protection Act, 2019.
            </li>
          </ol>
        </section>

        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerSymbol}>&#10054;</span>
          <div className={styles.dividerLine} />
        </div>

        <section className={styles.section}>
          <div className={styles.prose}>
            <p>
              For any questions regarding this policy, write to us at{" "}
              <a href="mailto:care@qalachowk.com">care@qalachowk.com</a> or call{" "}
              <a href="tel:+918769931749">+91 87699 31749</a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
