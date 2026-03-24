import styles from "@/styles/legal.module.css";

export const metadata = {
  title: "Shipping Policy | Qala Chowk",
  description:
    "Shipping and delivery information for orders placed on qalachowk.com, operated by QalaChowk Design Studio LLP.",
};

export default function ShippingPolicy() {
  return (
    <div className={styles.page}>
      <header className={styles.heroHeader}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Shipping Policy</h1>
          <p className={styles.heroSubtitle}>
            From our studio in Jaipur to your doorstep — here is everything you
            need to know about how we deliver.
          </p>
          <p className={styles.effectiveDate}>Effective: 24 March 2026</p>
        </div>
      </header>

      <div className={styles.content}>
        {/* Coverage */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Shipping Coverage</h2>
          <div className={styles.prose}>
            <p>
              We currently ship to addresses <strong>within India only</strong>.
              We deliver to all serviceable PIN codes across the country. If
              your PIN code is not serviceable, you will be notified during
              checkout.
            </p>
            <p>
              International shipping is not available at this time. We are
              working to bring Qala Chowk to the world — follow us for updates.
            </p>
          </div>
        </section>

        {/* Shipping Charges */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Shipping Charges</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order Value</th>
                <th>Shipping Charge</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Above &#x20B9;999</td>
                <td>
                  <strong>Free</strong>
                </td>
              </tr>
              <tr>
                <td>Below &#x20B9;999</td>
                <td>Standard shipping charges apply (displayed at checkout)</td>
              </tr>
            </tbody>
          </table>
          <div className={styles.prose}>
            <p>
              Shipping charges, if applicable, are calculated at checkout and
              are inclusive of GST. The exact amount depends on the delivery
              location and the weight of the package.
            </p>
          </div>
        </section>

        {/* Delivery Timeline */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Delivery Timeline</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Stage</th>
                <th>Timeline</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Order processing</td>
                <td>1–2 business days after order confirmation</td>
              </tr>
              <tr>
                <td>Dispatch to delivery</td>
                <td>5–7 business days from dispatch</td>
              </tr>
              <tr>
                <td>Total estimated delivery</td>
                <td>
                  <strong>6–9 business days</strong> from order confirmation
                </td>
              </tr>
            </tbody>
          </table>
          <div className={styles.prose}>
            <p>
              Please note that delivery timelines are estimates and may vary
              depending on your location, courier partner availability, and
              unforeseen circumstances such as natural calamities, strikes, or
              public holidays. Business days exclude Sundays and national
              holidays.
            </p>
          </div>
        </section>

        {/* Order Tracking */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Order Tracking</h2>
          <div className={styles.prose}>
            <p>
              Once your order is dispatched, you will receive an email and/or
              SMS notification with:
            </p>
          </div>
          <ul className={styles.list}>
            <li>A tracking number for your shipment.</li>
            <li>
              A link to track your order on the courier partner&apos;s website.
            </li>
          </ul>
          <div className={styles.prose}>
            <p>
              You can also track your order status by logging into your account
              on the Platform and visiting the{" "}
              <a href="/order-details">Order Details</a> page.
            </p>
          </div>
        </section>

        {/* Packaging */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Packaging</h2>
          <div className={styles.prose}>
            <p>
              Each piece of jewellery is carefully packaged in branded Qala
              Chowk packaging designed to protect the product during transit.
              Our packaging includes:
            </p>
          </div>
          <ul className={styles.list}>
            <li>A protective jewellery pouch or box for each piece.</li>
            <li>
              Tamper-evident outer packaging to ensure the product reaches you
              in its original condition.
            </li>
            <li>
              A care card with instructions on how to maintain your handcrafted
              jewellery.
            </li>
          </ul>
        </section>

        {/* Delivery Issues */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Delivery Issues</h2>

          <h3 className={styles.sectionSubtitle}>a) Incorrect Address</h3>
          <div className={styles.prose}>
            <p>
              Please ensure that the delivery address provided during checkout
              is accurate and complete. We shall not be responsible for
              non-delivery or delayed delivery arising from incorrect or
              incomplete address details. If a shipment is returned to us due to
              an incorrect address, re-shipping charges may apply.
            </p>
          </div>

          <h3 className={styles.sectionSubtitle}>
            b) Failed Delivery Attempts
          </h3>
          <div className={styles.prose}>
            <p>
              If the courier partner is unable to deliver after multiple
              attempts, the package will be returned to our warehouse. In such
              cases, we will contact you to arrange re-delivery (additional
              shipping charges may apply) or process a refund minus the original
              shipping charges.
            </p>
          </div>

          <h3 className={styles.sectionSubtitle}>
            c) Damaged or Missing Products
          </h3>
          <div className={styles.prose}>
            <p>
              If your package arrives damaged or if items are missing, please
              refer to our{" "}
              <a href="/return-policy">Return &amp; Refund Policy</a>. Remember
              to record an unboxing video while opening the parcel — this is
              mandatory for processing any damage claims.
            </p>
          </div>
        </section>

        {/* Force Majeure */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Force Majeure</h2>
          <div className={styles.prose}>
            <p>
              QalaChowk Design Studio LLP shall not be liable for any delay or
              failure in delivery caused by events beyond our reasonable
              control, including but not limited to natural disasters,
              epidemics, government orders, strikes, civil unrest, or
              disruptions in courier services. In such events, we shall make
              reasonable efforts to inform you and resume delivery as soon as
              practicable.
            </p>
          </div>
        </section>

        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerSymbol}>&#10054;</span>
          <div className={styles.dividerLine} />
        </div>

        <section className={styles.section}>
          <div className={styles.prose}>
            <p>
              For any shipping-related queries, reach out to us at{" "}
              <a href="mailto:care@qalachowk.com">care@qalachowk.com</a> or call{" "}
              <a href="tel:+918769931749">+91 87699 31749</a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
