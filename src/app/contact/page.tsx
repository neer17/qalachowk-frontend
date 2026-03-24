import styles from "@/styles/legal.module.css";

export const metadata = {
  title: "Contact Us | Qala Chowk",
  description:
    "Get in touch with QalaChowk Design Studio LLP — customer care, grievance redressal, and business enquiries.",
};

export default function Contact() {
  return (
    <div className={styles.page}>
      <header className={styles.heroHeader}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Contact Us</h1>
          <p className={styles.heroSubtitle}>
            We&apos;d love to hear from you. Whether it&apos;s a question about
            your order, a collaboration, or just to say hello.
          </p>
        </div>
      </header>

      <div className={styles.content}>
        {/* Customer Care */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Customer Care</h2>
          <div className={styles.prose}>
            <p>
              For order-related queries, product questions, or any assistance
              with the Platform:
            </p>
          </div>
          <div className={styles.contactCard}>
            <p className={styles.contactLabel}>Customer Support</p>
            <p>
              Email: <a href="mailto:care@qalachowk.com">care@qalachowk.com</a>
              <br />
              Phone: <a href="tel:+918769931749">+91 87699 31749</a>
              <br />
              Hours: Monday – Saturday, 10:00 AM – 6:00 PM IST
            </p>
          </div>
        </section>

        {/* Grievance Officer */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Grievance Officer</h2>
          <div className={styles.prose}>
            <p>
              In accordance with Section 5(2) of the Information Technology
              (Intermediary Guidelines and Digital Media Ethics Code) Rules,
              2021, and the Digital Personal Data Protection Act, 2023, we have
              appointed the following Grievance Officer:
            </p>
          </div>
          <div className={styles.contactCard}>
            <p className={styles.contactLabel}>Grievance Officer</p>
            <p>
              <strong>Mr. Neeraj Sewani</strong>
              <br />
              Designation: Co-Founder
              <br />
              Email:{" "}
              <a href="mailto:neerajsewanisrt8@gmail.com">
                neerajsewanisrt8@gmail.com
              </a>
              <br />
              Phone: <a href="tel:+918233927761">+91 82339 27761</a>
            </p>
          </div>
          <div className={styles.prose}>
            <p>
              All grievances shall be acknowledged within forty-eight (48) hours
              of receipt and shall be resolved within thirty (30) days from the
              date of receipt, in compliance with applicable law.
            </p>
          </div>
        </section>

        {/* Registered Office */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Registered Office</h2>
          <div className={styles.contactCard}>
            <p className={styles.contactLabel}>QalaChowk Design Studio LLP</p>
            <p>
              7/MA/144, Indira Gandhi Nagar,
              <br />
              Jagatpura, Jaipur, Rajasthan — 302017
              <br />
              India
              <br />
              <br />
              GSTIN: 08AABFQ4036B1ZP
            </p>
          </div>
        </section>

        {/* Consumer Forum */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Consumer Forum</h2>
          <div className={styles.prose}>
            <p>
              If you believe your complaint has not been adequately resolved,
              you have the right to escalate under the Consumer Protection Act,
              2019:
            </p>
          </div>
          <ul className={styles.list}>
            <li>
              <strong>National Consumer Helpline:</strong> 1800-11-4000
              (toll-free)
            </li>
            <li>
              <strong>Online complaint portal:</strong>{" "}
              <a
                href="https://consumerhelpline.gov.in"
                target="_blank"
                rel="noopener noreferrer"
              >
                consumerhelpline.gov.in
              </a>
            </li>
            <li>
              <strong>Jurisdiction:</strong> District Consumer Disputes
              Redressal Forum, Jaipur, Rajasthan
            </li>
          </ul>
        </section>

        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerSymbol}>&#10054;</span>
          <div className={styles.dividerLine} />
        </div>

        {/* Policies */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Policies</h2>
          <ul className={styles.list}>
            <li>
              <a href="/privacy-policy">Privacy Policy</a>
            </li>
            <li>
              <a href="/terms">Terms &amp; Conditions</a>
            </li>
            <li>
              <a href="/return-policy">Return &amp; Refund Policy</a>
            </li>
            <li>
              <a href="/shipping-policy">Shipping Policy</a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
