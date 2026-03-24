import styles from "@/styles/legal.module.css";

export const metadata = {
  title: "Terms & Conditions | Qala Chowk",
  description:
    "Terms and Conditions governing the use of qalachowk.com, operated by QalaChowk Design Studio LLP.",
};

export default function TermsAndConditions() {
  return (
    <div className={styles.page}>
      <header className={styles.heroHeader}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Terms &amp; Conditions</h1>
          <p className={styles.heroSubtitle}>
            Please read these terms carefully before using our Platform or
            placing an order.
          </p>
          <p className={styles.effectiveDate}>Effective: 24 March 2026</p>
        </div>
      </header>

      <div className={styles.content}>
        {/* Definitions */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Definitions</h2>
          <div className={styles.prose}>
            <p>In these Terms and Conditions:</p>
          </div>
          <ul className={styles.list}>
            <li>
              <strong>&ldquo;Company&rdquo;</strong>,{" "}
              <strong>&ldquo;we&rdquo;</strong>,{" "}
              <strong>&ldquo;us&rdquo;</strong>, or{" "}
              <strong>&ldquo;our&rdquo;</strong> refers to QalaChowk Design
              Studio LLP, an LLP registered under the Limited Liability
              Partnership Act, 2008, with GSTIN 08AABFQ4036B1ZP, having its
              registered office at 7/MA/144, Indira Gandhi Nagar, Jagatpura,
              Jaipur, Rajasthan — 302017.
            </li>
            <li>
              <strong>&ldquo;Platform&rdquo;</strong> refers to the website
              qalachowk.com and any associated mobile applications.
            </li>
            <li>
              <strong>&ldquo;User&rdquo;</strong>,{" "}
              <strong>&ldquo;you&rdquo;</strong>, or{" "}
              <strong>&ldquo;your&rdquo;</strong> refers to any person who
              accesses or uses the Platform.
            </li>
            <li>
              <strong>&ldquo;Products&rdquo;</strong> refers to the handcrafted
              jewellery and accessories listed for sale on the Platform.
            </li>
          </ul>
        </section>

        {/* Acceptance */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Acceptance of Terms</h2>
          <div className={styles.prose}>
            <p>
              By accessing, browsing, or placing an order on the Platform, you
              agree to be bound by these Terms and Conditions, our{" "}
              <a href="/privacy-policy">Privacy Policy</a>,{" "}
              <a href="/return-policy">Return &amp; Refund Policy</a>, and{" "}
              <a href="/shipping-policy">Shipping Policy</a>. If you do not
              agree with any part of these terms, you must not use the Platform.
            </p>
          </div>
        </section>

        {/* Eligibility */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Eligibility</h2>
          <div className={styles.prose}>
            <p>
              You must be at least eighteen (18) years of age and competent to
              enter into a contract under the Indian Contract Act, 1872, to use
              the Platform or place an order. By using the Platform, you
              represent and warrant that you meet these eligibility
              requirements.
            </p>
          </div>
        </section>

        {/* Account */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Account and Authentication</h2>
          <div className={styles.prose}>
            <p>
              To place an order, you must authenticate your identity using your
              mobile phone number via a One-Time Password (OTP). You are
              responsible for:
            </p>
          </div>
          <ul className={styles.list}>
            <li>Providing accurate and current contact information.</li>
            <li>
              Maintaining the confidentiality of any OTP sent to your registered
              mobile number.
            </li>
            <li>
              All activities that occur under your account or phone number.
            </li>
          </ul>
          <div className={styles.prose}>
            <p>
              We reserve the right to suspend or terminate accounts suspected of
              fraudulent or unauthorized use.
            </p>
          </div>
        </section>

        {/* Products and Pricing */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Products and Pricing</h2>

          <h3 className={styles.sectionSubtitle}>a) Product Description</h3>
          <div className={styles.prose}>
            <p>
              All Products listed on the Platform are handcrafted jewellery
              inspired by traditional Indian folk arts (Warli, Madhubani,
              Mandana). Our Products are made from <strong>brass</strong> and{" "}
              <strong>silver</strong>, with options that include{" "}
              <strong>gold plating on brass</strong> and{" "}
              <strong>silver plating on brass</strong>.
            </p>
            <p>
              As each piece is handcrafted, minor variations in colour, texture,
              weight, and finish are inherent and not considered defects.
              Product images on the Platform are representative and may differ
              slightly from the actual product due to screen calibration and
              photography conditions.
            </p>
          </div>

          <h3 className={styles.sectionSubtitle}>b) Pricing</h3>
          <div className={styles.prose}>
            <p>
              All prices are listed in Indian Rupees (INR) and are inclusive of
              applicable Goods and Services Tax (GST). We reserve the right to
              modify prices at any time without prior notice. The price
              applicable to your order shall be the price displayed at the time
              of placing the order.
            </p>
          </div>

          <h3 className={styles.sectionSubtitle}>c) Availability</h3>
          <div className={styles.prose}>
            <p>
              Product availability is subject to stock. We make reasonable
              efforts to ensure accuracy of stock information but do not
              guarantee that all Products displayed are available. In the event
              a Product is unavailable after an order is placed, we shall notify
              you and issue a full refund.
            </p>
          </div>
        </section>

        {/* Orders */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Orders and Payment</h2>
          <div className={styles.prose}>
            <p>
              Placing an order on the Platform constitutes an offer to purchase
              the selected Products. We reserve the right to accept or reject
              any order at our sole discretion, including for reasons such as
              pricing errors, suspected fraud, or unavailability of stock.
            </p>
            <p>
              Payment is processed securely through <strong>Razorpay</strong>.
              We accept all payment methods supported by Razorpay, including
              credit/debit cards, UPI, net banking, and wallets. An order is
              confirmed only upon successful payment authorisation.
            </p>
          </div>
        </section>

        {/* Cancellation */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Order Cancellation</h2>
          <div className={styles.prose}>
            <p>
              As our Products are handcrafted and prepared upon order
              confirmation, cancellations are accepted only if requested{" "}
              <strong>before the order has been dispatched</strong>. To request
              a cancellation, contact us at{" "}
              <a href="mailto:care@qalachowk.com">care@qalachowk.com</a> with
              your order number. If the order has already been dispatched,
              cancellation shall not be possible and the{" "}
              <a href="/return-policy">Return &amp; Refund Policy</a> shall
              apply.
            </p>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Intellectual Property</h2>
          <div className={styles.prose}>
            <p>
              All content on the Platform — including but not limited to product
              designs, photographs, illustrations, text, logos, the &ldquo;Qala
              Chowk&rdquo; brand name, and the design system — is the
              intellectual property of QalaChowk Design Studio LLP and is
              protected under the Copyright Act, 1957, the Trade Marks Act,
              1999, and the Designs Act, 2000.
            </p>
            <p>
              You may not reproduce, distribute, modify, create derivative works
              from, publicly display, or commercially exploit any content from
              the Platform without our prior written consent.
            </p>
          </div>
        </section>

        {/* User Conduct */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. User Conduct</h2>
          <div className={styles.prose}>
            <p>You agree not to:</p>
          </div>
          <ul className={styles.list}>
            <li>
              Use the Platform for any unlawful purpose or in violation of any
              applicable law.
            </li>
            <li>
              Attempt to gain unauthorized access to any portion of the Platform
              or its systems.
            </li>
            <li>
              Use automated tools (bots, scrapers) to extract data from the
              Platform.
            </li>
            <li>
              Impersonate any person or entity, or misrepresent your affiliation
              with any person or entity.
            </li>
            <li>
              Interfere with or disrupt the Platform&apos;s functionality or
              security.
            </li>
          </ul>
        </section>

        {/* Limitation of Liability */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>10. Limitation of Liability</h2>
          <div className={styles.prose}>
            <p>
              To the maximum extent permitted by applicable law, QalaChowk
              Design Studio LLP shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, including
              but not limited to loss of profits, data, or goodwill, arising out
              of or in connection with your use of the Platform.
            </p>
            <p>
              Our total aggregate liability in respect of any claim arising out
              of or relating to the Platform or any Product shall not exceed the
              amount paid by you for the specific Product giving rise to the
              claim.
            </p>
          </div>
        </section>

        {/* Indemnification */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>11. Indemnification</h2>
          <div className={styles.prose}>
            <p>
              You agree to indemnify and hold harmless QalaChowk Design Studio
              LLP, its partners, employees, and agents from and against any
              claims, liabilities, damages, losses, and expenses (including
              reasonable legal fees) arising out of your use of the Platform,
              violation of these Terms, or infringement of any third-party
              rights.
            </p>
          </div>
        </section>

        {/* Governing Law */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            12. Governing Law and Jurisdiction
          </h2>
          <div className={styles.prose}>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of India. Any dispute arising out of or in connection
              with these Terms shall be subject to the exclusive jurisdiction of
              the courts at <strong>Jaipur, Rajasthan</strong>.
            </p>
          </div>
        </section>

        {/* Dispute Resolution */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>13. Dispute Resolution</h2>
          <div className={styles.prose}>
            <p>
              In the event of any dispute, you shall first attempt to resolve
              the matter amicably by writing to{" "}
              <a href="mailto:care@qalachowk.com">care@qalachowk.com</a>. If the
              dispute is not resolved within thirty (30) days, either party may
              approach the competent consumer forum or court of appropriate
              jurisdiction at Jaipur, Rajasthan.
            </p>
            <p>
              Nothing in this clause shall limit your right to approach the
              National Consumer Disputes Redressal Commission, State Consumer
              Disputes Redressal Commission, or District Consumer Disputes
              Redressal Forum, as the case may be, under the Consumer Protection
              Act, 2019.
            </p>
          </div>
        </section>

        {/* Severability */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>14. Severability</h2>
          <div className={styles.prose}>
            <p>
              If any provision of these Terms is found to be invalid or
              unenforceable by a court of competent jurisdiction, the remaining
              provisions shall continue in full force and effect.
            </p>
          </div>
        </section>

        {/* Amendments */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>15. Amendments</h2>
          <div className={styles.prose}>
            <p>
              We reserve the right to amend these Terms at any time. The amended
              Terms shall be effective upon posting on the Platform with a
              revised &ldquo;Effective&rdquo; date. Your continued use of the
              Platform after such amendments constitutes your acceptance of the
              revised Terms.
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
          <div className={styles.contactCard}>
            <p className={styles.contactLabel}>Registered Office</p>
            <p>
              <strong>QalaChowk Design Studio LLP</strong>
              <br />
              GSTIN: 08AABFQ4036B1ZP
              <br />
              7/MA/144, Indira Gandhi Nagar, Jagatpura, Jaipur, Rajasthan —
              302017
              <br />
              Email: <a href="mailto:care@qalachowk.com">care@qalachowk.com</a>
              <br />
              Phone: <a href="tel:+918769931749">+91 87699 31749</a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
