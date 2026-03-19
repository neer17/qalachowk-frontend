import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <div className={styles.page}>
      <main>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={`${styles.container} ${styles.heroContent}`}>
            <div className={styles.heroText}>
              <h1 className={`${styles.fontSerif} ${styles.heroTitle}`}>
                The Art of the Every Square
              </h1>
              <p className={styles.heroDescription}>
                Where ancestral folk art meets contemporary elegance.
                Handcrafted jewelry that carries the soul of Indian heritage.
              </p>
              <Link href="#" className={styles.heroButton}>
                Explore Collections
              </Link>
            </div>
            <div className={styles.heroImageContainer}>
              <div className={styles.heroImageWrapper}>
                <Image
                  className={styles.heroImage}
                  width={800}
                  height={600}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMs2uFTnEWoOfyix5b7PPqcFQFAxuLom6CCILhG50-Gsvor_8490ylY8sP8O-HMhzlDaNrdtfPuXyfK8Yt0KiI2_lX_5a4ln3DW-wGge9ulRvHXFIzqS1bieBWuxXM1u2TKCnvaVJDZIS3G4NuxhsBQECBfJHKDRoPc9T6zvHanEp4JvhxFxJStFHNf8oy975cSMBWvrV4-npuQQvaR21kjgYIgnNA34lxZfPCkWR2mDYC60hHCMtSF1fqkPZbWjHmmZNrmws_gSQP"
                  alt="Featured Jewelry"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mandana Divider */}
        <div aria-hidden="true" className={styles.mandanaPattern}></div>

        {/* Collection Highlights */}
        <section className={`${styles.container} ${styles.collectionsSection}`}>
          <div className={styles.collectionsGrid}>
            {/* Collection 1 */}
            <div className={styles.collectionCard}>
              <div className={styles.collectionImageWrapper}>
                <Image
                  className={styles.collectionImage}
                  width={600}
                  height={750}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe-VkwAsKj-AEuFfyP1NzA9XpqT_0UoRQkW2zjQA1hVl4oEBhyLMZkAed42ZTJ8_BJBkD-wB0hzxWz7t3BN9VWmhiCzzLPlzzcYWvewI10WR-RDusrqlckNgFGGBniEYQMpdZAchF5Xp_GPq1qWHI-XxIvtdP3SYdMj0bhVwXsKopn0eE22Q9HZIA8hQv5hwA0y-7DxjRw0GVCEdygxYFcIOb12i82iCsKFUMsJj9G24reYRMVO0DqnjCQQrB0m7LIUQhtFI_eZRWJ"
                  alt="Warli Whispers Collection"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              <h3 className={`${styles.fontSerif} ${styles.collectionTitle}`}>
                Warli Whispers
              </h3>
              <p className={styles.collectionSubtitle}>
                Traditional Line Art • Silver Finish
              </p>
            </div>

            {/* Collection 2 */}
            <div className={styles.collectionCard}>
              <div className={styles.collectionImageWrapper}>
                <Image
                  className={styles.collectionImage}
                  width={600}
                  height={750}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYqfQt_5jkDLuL9fOgnXhPGjfwrnP3M3_l3qqCmWqHjfonpbkyTpSA2XbZLCdITk4GLazsooGTir3lwuqxjwQQ_ANrtv8kqEJmQ9MGALQza_B85HiZmBS7Gf44X2ahx9XyNMc56fr7B-udPgHoAB5cV1m12k1kuKeypYDW8vXdFoBU43-034wUmWFlV1glDVms13C-2b4O-r8A_vR7Ew9pHPxZzYQJ4-sdwZC7q84wsiB_JTY2Fm5OVBLdJYEZBe9IM4Ybz-D2RFyu"
                  alt="Madhubani Meadows Collection"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              <h3 className={`${styles.fontSerif} ${styles.collectionTitle}`}>
                Madhubani Meadows
              </h3>
              <p className={styles.collectionSubtitle}>
                Botanical Motifs • Hand Painted
              </p>
            </div>
          </div>
        </section>

        {/* Brand Story */}
        <section className={styles.brandStorySection}>
          <div className={styles.brandStoryContent}>
            <div className={styles.brandStoryIcon}>
              <svg
                fill="currentColor"
                height="40"
                viewBox="0 0 40 40"
                width="40"
              >
                <path d="M20,5 L22,12 L29,12 L23,17 L25,24 L20,20 L15,24 L17,17 L11,12 L18,12 Z"></path>
              </svg>
            </div>
            <h2 className={`${styles.fontSerif} ${styles.brandStoryTitle}`}>
              Bridging Time & Craft
            </h2>
            <div className={styles.brandStoryText}>
              <p>
                Qala Chowk is more than a boutique; it is a revivalist movement.
                We believe that jewelry is a canvas for storytelling, where
                every stroke of Warli line art and every curve of Madhubani
                florals finds a home in modern silhouettes.
              </p>
              <p>
                Each piece is meticulously handcrafted by artisans whose
                families have guarded these folk arts for generations. By fusing
                these ancient narratives with contemporary design, we create
                heirlooms for the modern soul.
              </p>
            </div>
            <div className={styles.brandStoryButtonWrapper}>
              <Link href="#" className={styles.brandStoryButton}>
                Read Our Story
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Existing Footer (we can update this later if needed) */}
      <Footer />
    </div>
  );
}
