import styles from "@/styles/legal.module.css";

export const metadata = {
  title: "Privacy Policy | Qala Chowk",
  description:
    "Privacy Policy of QalaChowk Design Studio LLP — how we collect, use, and protect your personal data.",
};

export default function PrivacyPolicy() {
  return (
    <div className={styles.page}>
      <header className={styles.heroHeader}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Privacy Policy</h1>
          <p className={styles.heroSubtitle}>
            Your trust is the foundation of our craft. This policy explains how
            we collect, use, and safeguard your personal information.
          </p>
          <p className={styles.effectiveDate}>Effective: 24 March 2026</p>
        </div>
      </header>

      <div className={styles.content}>
        {/* Introduction */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Introduction</h2>
          <div className={styles.prose}>
            <p>
              This Privacy Policy is published in compliance with the
              Information Technology Act, 2000, the Information Technology
              (Reasonable Security Practices and Procedures and Sensitive
              Personal Data or Information) Rules, 2011, and the Digital
              Personal Data Protection Act, 2023 (&ldquo;DPDP Act&rdquo;).
            </p>
            <p>
              This policy applies to{" "}
              <strong>QalaChowk Design Studio LLP</strong> (GSTIN:
              08AABFQ4036B1ZP), operating the website{" "}
              <strong>qalachowk.com</strong> (the &ldquo;Platform&rdquo;). By
              accessing or using the Platform, you consent to the collection,
              use, and disclosure of your personal data as described herein.
            </p>
          </div>
        </section>

        {/* Data We Collect */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Data We Collect</h2>
          <div className={styles.prose}>
            <p>
              We collect the following categories of personal data when you
              interact with the Platform:
            </p>
          </div>

          <h3 className={styles.sectionSubtitle}>
            a) Data You Provide Directly
          </h3>
          <ul className={styles.list}>
            <li>
              <strong>Identity data:</strong> Full name as provided during
              account creation or checkout.
            </li>
            <li>
              <strong>Contact data:</strong> Mobile phone number (used for
              OTP-based authentication), email address, and delivery address.
            </li>
            <li>
              <strong>Order data:</strong> Products ordered, order value,
              delivery preferences, and transaction history.
            </li>
            <li>
              <strong>Payment data:</strong> Payment is processed by Razorpay.
              We do not store your card details, bank account numbers, or UPI
              IDs on our servers. Razorpay&apos;s privacy policy governs
              payment-related data.
            </li>
          </ul>

          <h3 className={styles.sectionSubtitle}>
            b) Data Collected Automatically
          </h3>
          <ul className={styles.list}>
            <li>
              <strong>Device data:</strong> IP address, browser type, operating
              system, screen resolution, and device identifiers.
            </li>
            <li>
              <strong>Usage data:</strong> Pages visited, products viewed, time
              spent on pages, click patterns, and referral source.
            </li>
            <li>
              <strong>Cart and wishlist data:</strong> Stored locally on your
              device using IndexedDB. This data does not leave your browser
              unless you place an order.
            </li>
          </ul>
        </section>

        {/* Purpose of Collection */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Purpose of Data Collection</h2>
          <div className={styles.prose}>
            <p>We use your personal data for the following purposes:</p>
          </div>
          <ol className={styles.orderedList}>
            <li>
              To authenticate your identity via OTP and maintain your account
              session.
            </li>
            <li>
              To process and fulfil your orders, including shipping and
              delivery.
            </li>
            <li>
              To communicate order confirmations, shipping updates, and
              customer-service responses.
            </li>
            <li>
              To analyse website usage patterns and improve user experience (via
              Google Analytics and Meta Pixel).
            </li>
            <li>
              To send promotional communications where you have provided
              explicit consent (e.g., newsletter subscription). You may
              unsubscribe at any time.
            </li>
            <li>To comply with applicable legal obligations and tax laws.</li>
          </ol>
        </section>

        {/* Cookies and Tracking */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Cookies and Tracking</h2>
          <div className={styles.prose}>
            <p>The Platform uses the following tracking technologies:</p>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Technology</th>
                <th>Provider</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Google Analytics</td>
                <td>Google LLC</td>
                <td>
                  Website traffic analysis, user behaviour, page performance
                </td>
              </tr>
              <tr>
                <td>Meta Pixel</td>
                <td>Meta Platforms, Inc.</td>
                <td>
                  Conversion tracking, ad performance measurement, remarketing
                </td>
              </tr>
              <tr>
                <td>Essential Cookies</td>
                <td>QalaChowk</td>
                <td>
                  Session management, authentication tokens, cart persistence
                </td>
              </tr>
            </tbody>
          </table>
          <div className={styles.prose}>
            <p>
              You may disable non-essential cookies through your browser
              settings. However, disabling essential cookies may impair the
              functionality of the Platform. By continuing to use the Platform,
              you consent to our use of cookies as described above.
            </p>
          </div>
        </section>

        {/* Data Sharing */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Data Sharing</h2>
          <div className={styles.prose}>
            <p>
              We do not sell your personal data. We share data only with the
              following categories of recipients, and only to the extent
              necessary for the stated purposes:
            </p>
          </div>
          <ul className={styles.list}>
            <li>
              <strong>Payment processor:</strong> Razorpay, for processing
              transactions securely.
            </li>
            <li>
              <strong>Logistics partners:</strong> Courier and shipping
              partners, for delivering your orders (name, address, phone
              number).
            </li>
            <li>
              <strong>Analytics providers:</strong> Google and Meta, for
              anonymised usage analytics.
            </li>
            <li>
              <strong>Legal authorities:</strong> Where required by law, court
              order, or a lawful request from a government authority.
            </li>
          </ul>
        </section>

        {/* Data Retention */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Data Retention</h2>
          <div className={styles.prose}>
            <p>
              We retain your personal data only for as long as necessary to
              fulfil the purposes for which it was collected:
            </p>
          </div>
          <ul className={styles.list}>
            <li>
              <strong>Account data:</strong> Retained as long as your account is
              active. You may request deletion at any time.
            </li>
            <li>
              <strong>Order and transaction data:</strong> Retained for a
              minimum of eight (8) years from the date of the transaction, as
              required under the Income Tax Act, 1961 and the Goods and Services
              Tax Act, 2017.
            </li>
            <li>
              <strong>Analytics data:</strong> Retained in anonymised form for
              up to twenty-six (26) months.
            </li>
          </ul>
        </section>

        {/* Your Rights */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            7. Your Rights under the DPDP Act, 2023
          </h2>
          <div className={styles.prose}>
            <p>As a data principal, you have the right to:</p>
          </div>
          <ol className={styles.orderedList}>
            <li>
              <strong>Access</strong> — Obtain a summary of your personal data
              held by us and the processing activities undertaken.
            </li>
            <li>
              <strong>Correction</strong> — Request correction of inaccurate or
              incomplete personal data.
            </li>
            <li>
              <strong>Erasure</strong> — Request deletion of your personal data,
              subject to legal retention requirements.
            </li>
            <li>
              <strong>Grievance redressal</strong> — Lodge a complaint with our
              Grievance Officer (see Section 10 below).
            </li>
            <li>
              <strong>Nomination</strong> — Nominate another individual to
              exercise your rights in the event of your death or incapacity.
            </li>
          </ol>
          <div className={styles.prose}>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:care@qalachowk.com">care@qalachowk.com</a>. We
              shall respond within thirty (30) days of receiving your request.
            </p>
          </div>
        </section>

        {/* Data Security */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Data Security</h2>
          <div className={styles.prose}>
            <p>
              We implement reasonable security practices and procedures
              commensurate with the sensitivity of the data collected, in
              accordance with Section 8 of the DPDP Act, 2023 and the IT
              (Reasonable Security Practices) Rules, 2011. These include:
            </p>
          </div>
          <ul className={styles.list}>
            <li>Encrypted data transmission (HTTPS / TLS).</li>
            <li>Secure, token-based authentication with session expiry.</li>
            <li>
              Payment processing delegated entirely to PCI-DSS compliant
              Razorpay infrastructure.
            </li>
            <li>
              Periodic access reviews and restriction of data access to
              authorised personnel only.
            </li>
          </ul>
        </section>

        {/* Children */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. Children&apos;s Privacy</h2>
          <div className={styles.prose}>
            <p>
              The Platform is not directed at individuals below the age of
              eighteen (18) years. We do not knowingly collect personal data
              from children. If we become aware that we have inadvertently
              collected data from a minor, we shall delete it promptly.
            </p>
          </div>
        </section>

        {/* Grievance Officer */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>10. Grievance Officer</h2>
          <div className={styles.prose}>
            <p>
              In accordance with Section 5(2) of the Information Technology
              (Intermediary Guidelines and Digital Media Ethics Code) Rules,
              2021, and the DPDP Act, 2023, we have appointed the following
              Grievance Officer:
            </p>
          </div>
          <div className={styles.contactCard}>
            <p className={styles.contactLabel}>Grievance Officer</p>
            <p>
              <strong>Mr. Neeraj Sewani</strong>
              <br />
              Designation: Co-Founder
              <br />
              QalaChowk Design Studio LLP
              <br />
              7/MA/144, Indira Gandhi Nagar, Jagatpura, Jaipur, Rajasthan —
              302017
              <br />
              Email:{" "}
              <a href="mailto:neerajsewanisrt8@gmail.com">
                neerajsewanisrt8@gmail.com
              </a>
              <br />
              Phone: +91 82339 27761
            </p>
          </div>
          <div className={styles.prose}>
            <p>
              Grievances shall be acknowledged within forty-eight (48) hours and
              resolved within thirty (30) days from the date of receipt.
            </p>
          </div>
        </section>

        {/* Amendments */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>11. Amendments</h2>
          <div className={styles.prose}>
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or applicable law. The updated policy
              will be posted on this page with a revised &ldquo;Effective&rdquo;
              date. Your continued use of the Platform after such changes
              constitutes your acceptance of the revised policy.
            </p>
          </div>
        </section>

        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerSymbol}>&#10054;</span>
          <div className={styles.dividerLine} />
        </div>

        {/* Contact */}
        <section className={styles.section}>
          <div className={styles.prose}>
            <p>
              For any questions or concerns regarding this Privacy Policy, write
              to us at{" "}
              <a href="mailto:care@qalachowk.com">care@qalachowk.com</a> or call{" "}
              <a href="tel:+918769931749">+91 87699 31749</a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
