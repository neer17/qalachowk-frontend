import Image from "next/image";
import styles from "./page.module.css";

export default function Craft() {
  return (
    <div className={styles.page}>
      <main>
        {/* Navigation placeholder -> Nextjs site has global navbar layout, assuming we don't recreate it here specifically */}
        {/* Hero Section */}
        <header className={styles.heroHeader}>
          <div className={styles.heroContent}>
            <h1
              className={`${styles.fontSerif} ${styles.italic} ${styles.heroTitle}`}
            >
              The Soul of the Maker
            </h1>
            <p className={styles.heroDescription}>
              At Qala Chowk, we don&apos;t just create jewelry; we weave
              narratives. Our craft is a silent dialogue between the ancient
              rhythmic strokes of tribal India and the clean, bold lines of
              contemporary design.
            </p>
          </div>
        </header>

        {/* Mandana Divider */}
        <div aria-hidden="true" className={styles.mandanaDivider}></div>

        {/* The Narrative Section */}
        <section className={styles.narrativeSection}>
          <div className={styles.narrativeGrid}>
            <div className={styles.narrativeTextWrapper}>
              <h2
                className={`${styles.fontSerif} ${styles.italic} ${styles.narrativeTitle}`}
              >
                A Fusion of Eras
              </h2>
              <p className={styles.narrativeParagraph}>
                Our journey began in the &quot;Chowk&quot;—the village
                square—where every wall tells a story and every ritual is etched
                in pigment. By fusing contemporary jewelry silhouettes with the
                primal geometry of{" "}
                <span className={styles.semibold}>Warli</span>, the intricate
                tapestries of <span className={styles.semibold}>Madhubani</span>
                , and the earthy symmetry of{" "}
                <span className={styles.semibold}>Mandana</span>, we bring the
                wall-art of the ancestors to the skin of the modern individual.
              </p>
              <blockquote className={styles.narrativeQuote}>
                <p
                  className={`${styles.fontSerif} ${styles.italic} ${styles.quoteText}`}
                >
                  &quot;We don&apos;t wear jewelry; we wear the memory of the
                  earth.&quot;
                </p>
              </blockquote>
            </div>
            <div className={styles.narrativeImageWrapper}>
              <Image
                className={styles.narrativeImage}
                width={800}
                height={600}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-FXJ-N1ezxhNbEv8mAYm-sftuCjDF0PnK6LUuoaXLO12LLu9NKy6Ld-e8dg17KISonKToDvqV4f9vwp05flYE9UwZ2JIn1WfQtyt86w_PE6v0b-tW8Egcg9b-OnxlpBRb2OIHD6zc_2gANCnEWzPL106iHqsVYvGdtaY5HGGxco62XTt633C4BKqzOJusZRBf_3pmPXPZTJtbKB6_J5mktq4FRjdLo6rfqHygDEdsTi7Y3ibYX4B9XqurTSB0EO2-QceWinc7bweD"
                alt="Artisanal Process"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        </section>

        {/* Art Styles Breakdown */}
        <section className={styles.artStylesSection}>
          <div className={styles.container}>
            <div className={styles.artStylesHeader}>
              <h2
                className={`${styles.fontSerif} ${styles.italic} ${styles.artStylesTitle}`}
              >
                Our Ancestral Alphabet
              </h2>
              <p className={styles.artStylesSubtitle}>
                The three pillars of Qala Chowk’s aesthetic identity.
              </p>
            </div>
            <div className={styles.artStylesGrid}>
              {/* Warli Style */}
              <div className={styles.artStyleCard}>
                <div className={styles.artStyleIcon}>
                  <svg
                    fill="none"
                    height="80"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 100 100"
                    width="80"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M50 80 L60 60 L40 60 Z"></path>
                    <circle cx="50" cy="50" r="10"></circle>
                    <path d="M50 40 L50 20 M40 30 L60 30"></path>
                    <path
                      d="M60 60 Q 80 70 90 40 M40 60 Q 20 70 10 40"
                      strokeDasharray="2 2"
                    ></path>
                  </svg>
                </div>
                <h3 className={styles.artStyleName}>Warli</h3>
                <p className={styles.artStyleDescription}>
                  Hailing from the Sahyadri range, Warli uses basic geometric
                  shapes—circles, triangles, and squares—to represent the circle
                  of life and the harmony of nature.
                </p>
              </div>
              {/* Madhubani Style */}
              <div className={styles.artStyleCard}>
                <div className={styles.artStyleIcon}>
                  <svg
                    fill="none"
                    height="80"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 100 100"
                    width="80"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect height="30" rx="10" width="50" x="25" y="40"></rect>
                    <path d="M25 50 Q 10 50 10 70"></path>
                    <circle cx="65" cy="50" fill="currentColor" r="4"></circle>
                    <path d="M35 70 L35 85 M65 70 L65 85"></path>
                    <path d="M30 40 Q 50 30 70 40" strokeDasharray="1 3"></path>
                  </svg>
                </div>
                <h3 className={styles.artStyleName}>Madhubani</h3>
                <p className={styles.artStyleDescription}>
                  The Mithila art of Bihar, known for its vibrant complexity and
                  &apos;Kachni&apos; (line work), celebrating divinity and the
                  wild flora of the Indian landscape.
                </p>
              </div>
              {/* Mandana Style */}
              <div className={styles.artStyleCard}>
                <div className={styles.artStyleIcon}>
                  <svg
                    fill="none"
                    height="80"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 100 100"
                    width="80"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="50" cy="50" r="5"></circle>
                    <path d="M50 30 Q 70 10 90 30 T 50 50"></path>
                    <path d="M50 30 Q 30 10 10 30 T 50 50"></path>
                    <path d="M50 70 Q 70 90 90 70 T 50 50"></path>
                    <path d="M50 70 Q 30 90 10 70 T 50 50"></path>
                  </svg>
                </div>
                <h3 className={styles.artStyleName}>Mandana</h3>
                <p className={styles.artStyleDescription}>
                  A ritualistic art from Rajasthan, Mandana uses white chalk on
                  red clay walls. It is a protective art, meant to invite
                  auspiciousness through symmetrical grids.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Art Square Philosophy */}
        <section className={styles.philosophySection}>
          <div className={styles.philosophyBox}>
            <div className={styles.philosophyCornerTopLeft}></div>
            <div className={styles.philosophyCornerBottomRight}></div>
            <h2 className={styles.philosophyLabel}>The Philosophy</h2>
            <h3
              className={`${styles.fontSerif} ${styles.italic} ${styles.philosophyTitle}`}
            >
              The &apos;Art Square&apos; Concept
            </h3>
            <p className={styles.philosophyDescription}>
              At the heart of every Qala Chowk piece is the{" "}
              <span className={styles.semibold}>Art Square</span>. Just as
              traditional artists defined their sacred spaces with a boundary,
              we treat each piece of jewelry as a canvas. We don&apos;t just
              decorate; we compose. Every earring, necklace, and ring is
              designed within a structural framework that honors the balance of
              the original tribal formats.
            </p>
            <div className={styles.philosophyDivider}>
              <div className={styles.philosophyLine}></div>
              <div className={styles.philosophySymbol}>❈</div>
              <div className={styles.philosophyLine}></div>
            </div>
          </div>
        </section>

        {/* Visual Showcase */}
        <section className={`${styles.container} ${styles.showcaseSection}`}>
          <div className={styles.showcaseGrid}>
            <div className={styles.showcaseImageWrapper}>
              <Image
                className={styles.showcaseImage}
                width={400}
                height={400}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuApAPjdTP9oFzwp6OElmhMUmGWMM5fFDWMOeS-lJHpkNW2iYEUYYU25Fn7oIHK3uo8pA3l-ff97ab8O1jQjd0nZJi9jsqJvkBaw8OyeN2doAoIQGWsNGO_VUbjCAptHwE4JqOint8bvo1AJ-jraawd--12r6j3XikRWLMC6LTYLFsGsv8zS6Ztnf4cv6fiz1kWX8Id00XLq3EobDZ-HcMj5K3OtEebkRRMiKuX4gj7bXFHnRe6S34AQHbyaja8pXbARp_ejP2mep_aE"
                alt="Macro Detail"
              />
            </div>
            <div
              className={`${styles.showcaseImageWrapper} ${styles.showcaseImageOffset}`}
            >
              <Image
                className={styles.showcaseImage}
                width={400}
                height={400}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNTIHUZVb3HeNpk7cEgK9pOVAvBxH2McSvAXK50g2OgpH7ibywvruTkTKzjYjMOEYrPRryLxMziSCHLdrYfcHUlTwErQNqUiWBHuJGeRTYCKDiTng4Oer3-KOWfnPxx2JLs2L5ez2ETPNCRn8gKb844arLza-1hw03FAxcCLlf_VclHm13EEDyOgbNBgp5CMFywVCyLj4BU6xtyMz7XALtXCrcoLf2kbd2luDSNZJECbEL8mVYi84I5tp4JMe8BCc7UTHOChgSlsL4"
                alt="Macro Detail"
              />
            </div>
            <div className={styles.showcaseImageWrapper}>
              <Image
                className={styles.showcaseImage}
                width={400}
                height={400}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuChAUvh6Aa0vj3YUOfWllAZK2hOFHrGrscVdrqwMwZaoeORbdC3fUqvBf1v94v2S3CILd0x_2K3YJq_W2H2aFnrR49PHpRUOpSXZaGwf3_Ps15QGCYUW2AhQy6ifl_WO16mBXJlSKEF0Jd5qPZUTOsvdwGpK3GRpwfiU8pKsfDnIf6mUG-D4ZYM1LyzYwRS-nB2B9Qj5rqHeaQOS37RPIu4VvY9_oalDomrRj7BJjCIOZDVIBqROrsy5RUXvLwKN0L3A_MLY9TT5lHZ"
                alt="Macro Detail"
              />
            </div>
            <div
              className={`${styles.showcaseImageWrapper} ${styles.showcaseImageOffset}`}
            >
              <Image
                className={styles.showcaseImage}
                width={400}
                height={400}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBy34uVAZ2dte1O5KhaWvqGTCnTnoMeEbi90B2I0kdiN7Tmb3m9N-45U6VNCWvLbp2qOSG-zBWJmusA4dyqKv1IG9rWkqgeGwXAbSY50e2XABR9xShhWGgZMoPId2tL_kjN-KSJkVHyHcgP-K7odjXHqV_z249oAmrMUqzcVck0eihm3TDfDlg1CX3AN3u7zpX6Rg9qEgJHZxL06SLIBrn6OMDbGFjNy2QPo0I9fC1jCaHv4yVsywdpvJMo8i10mfxcosIc8bBWsK-n"
                alt="Macro Detail"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
