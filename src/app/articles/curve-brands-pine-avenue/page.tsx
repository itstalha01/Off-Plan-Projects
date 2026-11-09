import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { ARTICLE_AUTHOR, BRAND_LOGO_CREDIT } from "@/features/articles/editorial";
import { CURVE_ARTICLE_DESCRIPTION, CURVE_ARTICLE_PATH, CURVE_ARTICLE_TITLE, CURVE_BRANDS, CURVE_PROJECT_PATH, CURVE_SOURCES } from "@/features/articles/curve-brands";
import styles from "./article.module.css";

const url = `https://clearstoreys.com${CURVE_ARTICLE_PATH}`;
const publishedTime = "2026-11-06T00:00:00+05:00";
const modifiedTime = "2026-11-07T00:00:00+05:00";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: CURVE_ARTICLE_TITLE,
      description: CURVE_ARTICLE_DESCRIPTION,
      url,
      mainEntityOfPage: url,
      image: "https://clearstoreys.com/images/curve/gallery/01-facade-dusk.webp",
      author: { "@type": "Person", name: ARTICLE_AUTHOR },
      publisher: { "@type": "Organization", name: "Clearstoreys", url: "https://clearstoreys.com" },
      datePublished: publishedTime,
      dateModified: modifiedTime,
      inLanguage: "en",
    },
  ],
};

export const metadata: Metadata = {
  title: `${CURVE_ARTICLE_TITLE} | Clearstoreys`,
  description: CURVE_ARTICLE_DESCRIPTION,
  authors: [{ name: ARTICLE_AUTHOR }],
  alternates: { canonical: url },
  openGraph: {
    type: "article", url, title: CURVE_ARTICLE_TITLE, authors: [ARTICLE_AUTHOR], publishedTime, modifiedTime,
    description: CURVE_ARTICLE_DESCRIPTION,
    images: [{ url: "/images/curve/gallery/01-facade-dusk.webp", width: 2560, height: 1440, alt: "Architectural render of Curve on Pine Avenue, Lahore" }],
  },
  twitter: { card: "summary_large_image", title: CURVE_ARTICLE_TITLE, description: CURVE_ARTICLE_DESCRIPTION, images: ["/images/curve/gallery/01-facade-dusk.webp"] },
};

export default function CurveBrandsArticle() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <header className={styles.header}>
        <Link href="/" aria-label="Clearstoreys home"><Logo className="flex items-center gap-2.5" /></Link>
        <Link href="/articles">The Journal <ArrowUpRight size={15} aria-hidden="true" /></Link>
      </header>
      <main id="main-content" className={styles.article}>
        <article>
          <div className={styles.masthead}>
            <p>THE CLEARSTOREYS JOURNAL <span>01 / THE CURVE EDITION</span></p>
            <div className={styles.kicker}><span>Places &amp; people</span><span><MapPin size={13} aria-hidden="true" /> Pine Avenue, Lahore</span></div>
            <h1>{CURVE_ARTICLE_TITLE}</h1>
            <div className={styles.introRow}>
              <p className={styles.deck}>Five brands. One Curve.<br />A vote of confidence in Pine Avenue.</p>
              <div className={styles.byline}>By {ARTICLE_AUTHOR}<br /><time dateTime="2026-11-06">6 November 2026</time> <span>· 5 min read</span><br />Updated <time dateTime="2026-11-07">7 November 2026</time></div>
            </div>
          </div>

          <figure className={styles.hero}>
            <div className={styles.heroImage}>
              <Image src="/images/curve/gallery/01-facade-dusk.webp" alt="Architectural visualisation of Curve’s curved commercial frontage and landscaped street edge" fill sizes="(max-width: 1200px) 100vw, 1280px" preload className={styles.cover} />
              <span className={styles.imageLabel}>CURVE / PINE AVENUE DOWNTOWN</span>
            </div>
            <figcaption>Project visualisation, courtesy of HF Developers’ Curve brochure. Architecture and signage are illustrative; depicted storefronts do not establish brand commitments.</figcaption>
          </figure>

          <div className={styles.logoStrip} aria-label="Brands in the supplied Curve MOU lineup">
            {CURVE_BRANDS.map((brand) => (
              <a key={brand.id} href={`#${brand.id}`} style={{ background: brand.background }} aria-label={`Read about ${brand.name}`}>
                <Image src={brand.logo} alt={`${brand.name} logo`} width={180} height={85} className={styles.stripLogo} unoptimized />
              </a>
            ))}
          </div>
          <div className={styles.opening}>
            <p className={styles.sectionLabel}>THE STORY SO FAR</p>
            <div>
              <h2>A destination starts with the people who choose it.</h2>
              <p>Long before a first coffee is poured or a family sits down to dinner, a commercial destination begins taking shape through its brand mix. For Curve, that story now includes Rina’s Kitchenette, Bagh Restaurant, BonBird, JS Bank and Contra Coffee, the five names in the MOU lineup shared with Clearstoreys.</p>
              <p>Across food, coffee and financial services, the mix suggests an ambition to become part of everyday life on Pine Avenue. A quick stop, a longer lunch, a familiar meeting place: each gives an address a different purpose.</p>
              <a href="#the-lineup" className={styles.textLink}>Meet the five brands <ArrowDown size={16} aria-hidden="true" /></a>
            </div>
          </div>

          <section className={styles.location} aria-labelledby="location-title">
            <div className={styles.locationText}>
              <p className={styles.sectionLabel}>01 / THE ADDRESS</p>
              <h2 id="location-title">Curve Project Location &amp; Pine Avenue Connectivity</h2>
              <p>A brand’s address becomes part of its identity. Being easy to find, visible from the street and close to customers helps set the scene for the experience inside.</p>
              <p><a href={CURVE_SOURCES.project}>HF Developers describes Curve</a> as occupying a prominent bend on Pine Avenue, with a layout planned around commercial frontage. Its <a href={CURVE_SOURCES.location}>Pine Avenue overview</a> places the corridor within reach of Ring Road and residential communities including Lake City, Valencia, DHA Rahbar and Khayaban-e-Amin.</p>
              <p>Because of its Pine Avenue location, Curve is positioned to serve residents looking for commercial facilities near Lake City Lahore, Valencia and DHA Rahbar, with Khayaban-e-Amin also part of the surrounding catchment.</p>
              <p>That combination is the heart of the appeal: an address where visibility, access and an established residential catchment can work together.</p>
            </div>
            <figure className={styles.diagram}>
              <p className={styles.diagramEyebrow}>THE LOCATION LOGIC</p>
              <svg viewBox="0 0 480 350" role="img" aria-labelledby="location-diagram-title location-diagram-desc">
                <title id="location-diagram-title">Three reasons an address matters</title>
                <desc id="location-diagram-desc">An illustrative curved line connects access, visibility and nearby communities to Curve on Pine Avenue. This is a conceptual diagram, not a geographic map.</desc>
                <defs><pattern id="curve-grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#d8dfd5" /></pattern></defs>
                <rect width="480" height="350" fill="url(#curve-grid)" />
                <path d="M-20 280 C100 280 95 90 230 105 S325 300 510 180" fill="none" stroke="#dde4d9" strokeWidth="48" />
                <path d="M-20 280 C100 280 95 90 230 105 S325 300 510 180" fill="none" stroke="#64795b" strokeWidth="2" strokeDasharray="7 7" />
                <g fill="#243c2e" stroke="#f5f5ed" strokeWidth="5"><circle cx="67" cy="232" r="10" /><circle cx="185" cy="111" r="10" /><circle cx="374" cy="229" r="10" /></g>
                <g fill="#243c2e" fontFamily="Arial, sans-serif"><text x="28" y="305" fontSize="14" fontWeight="700">01 / ACCESS</text><text x="28" y="325" fontSize="12">The journey to the destination</text><text x="157" y="57" fontSize="14" fontWeight="700">02 / VISIBILITY</text><text x="157" y="77" fontSize="12">An address people notice</text><text x="264" y="285" fontSize="14" fontWeight="700">03 / COMMUNITIES</text><text x="264" y="305" fontSize="12">People with reasons to return</text></g>
                <g transform="translate(215 155)"><rect width="113" height="52" rx="26" fill="#243c2e" /><text x="56" y="33" fill="#f5f5ed" fontFamily="Georgia, serif" fontSize="26" textAnchor="middle">Curve.</text></g>
              </svg>
              <figcaption>An editorial illustration of the location proposition. Not a map, route or measured footfall study.</figcaption>
            </figure>
          </section>

          <section id="the-lineup" className={styles.lineup} aria-labelledby="lineup-title">
            <div className={styles.sectionHeading}><div><p className={styles.sectionLabel}>02 / THE BRAND MIX</p><h2 id="lineup-title">Brand Lineup &amp; Food Outlets at Curve Lahore</h2></div><p>Five identities that could help shape<br />how people use Curve.</p></div>
            <div className={styles.brandGrid}>
              {CURVE_BRANDS.map((brand, index) => (
                <section key={brand.id} id={brand.id} className={styles.brandCard}>
                  <div className={styles.brandVisual} style={{ background: brand.background }}><span className={styles.brandNumber}>{String(index + 1).padStart(2, "0")}</span><Image src={brand.logo} alt={`${brand.name} logo`} width={230} height={140} unoptimized className={styles.brandLogo} /></div>
                  <div className={styles.brandBody}><p className={styles.category}>{brand.category}</p><h3>{brand.name}</h3><p className={styles.brandHook}>{brand.heading}</p><p>{brand.description}</p><a href={brand.website} className={styles.textLink}>Official website <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> for {brand.name}</span></a></div>
                </section>
              ))}
              <aside className={styles.mixCard}><span className={styles.sectionLabel}>THE BIGGER PICTURE</span><p>A coffee.<br />A meal.<br />An everyday errand.</p><div>Complementary experiences can give one destination several reasons to be visited.</div><span className={styles.mixNote}>An illustration of the potential mix, not an operating schedule.</span></aside>
            </div>
          </section>

          <section className={styles.interpretation} aria-labelledby="commitment-title">
            <figure><div className={styles.detailImage}><Image src="/images/curve/gallery/06-central-courtyard.webp" alt="Architectural visualisation of Curve’s landscaped central courtyard" fill sizes="(max-width: 760px) 100vw, 50vw" className={styles.cover} /></div><figcaption>Curve courtyard visualisation · HF Developers’ project brochure.</figcaption></figure>
            <div><p className={styles.sectionLabel}>03 / THE EARLY COMMITMENT</p><h2 id="commitment-title">Choosing an address is choosing a setting for your brand.</h2><p>Our reading of these early MOUs is straightforward: the participating brands see potential in Curve’s positioning on Pine Avenue. Choosing a location early can give a business time to plan how its identity and customer experience will belong there.</p><p>For customers, a recognisable name creates an expectation. Delivering on it will depend on the space, the team and the service when the outlet opens. For Curve, the opportunity is to bring those distinct experiences together in one considered commercial destination.</p><p className={styles.pullquote}>The first chapter of a place is often written by the brands that see its potential early.</p><p className={styles.interpretationNote}>This is Clearstoreys’ editorial interpretation, rather than a statement of the brands’ individual reasons for signing.</p></div>
          </section>

          <aside className={styles.statusNote}><h2>What an MOU tells us</h2><p>An MOU records an understanding between parties. It does not, by itself, confirm that an outlet is open or establish a launch date, final lease terms or the exact services to be offered. Those details should be checked with the developer and each brand as the project progresses.</p></aside>

          <div className={styles.cta}><div><p className={styles.sectionLabel}>EXPLORE THE ADDRESS</p><h2>Take a closer look at Curve.</h2><p>Discover the project, layouts and listed payment plans.</p></div><Link href={CURVE_PROJECT_PATH}>Explore Curve <ArrowUpRight size={19} aria-hidden="true" /></Link></div>

          <section className={styles.credits} aria-labelledby="credits-title"><p className={styles.sectionLabel}>THE SOURCE NOTES</p><h2 id="credits-title">References &amp; visual credits</h2><p>The five-brand MOU lineup was supplied to Clearstoreys for this article. HF Developers’ <a href={CURVE_SOURCES.tenants}>published Curve article</a> independently names Bagh and Contra as tenants. Separate public MOU announcements for Rina’s Kitchenette, BonBird and JS Bank were not located during the original research. No signing dates or outlet opening dates are asserted here.</p><p>{BRAND_LOGO_CREDIT}</p><ul>{CURVE_BRANDS.map((brand) => <li key={brand.id}><a href={brand.website}>{brand.name} — official website</a></li>)}</ul><p>Project and location information: <a href={CURVE_SOURCES.project}>HF Developers — Curve</a>, <a href={CURVE_SOURCES.location}>Pine Avenue</a> and <a href={CURVE_SOURCES.developer}>about the developer</a>. Architectural images: HF Developers’ Curve brochure, as held in the project gallery. Diagram and article design: Clearstoreys. Brand sources checked 6 November 2026; developer and project sources checked 7 November 2026.</p></section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
