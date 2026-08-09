import Image, { type StaticImageData } from "next/image";
import heroImage from "../../../public/example-ned/hero-lake-house.jpg";
import villaImage from "../../../public/example-ned/villa-wannsee.jpg";
import interiorImage from "../../../public/example-ned/lake-house-interior.jpg";
import residenceImage from "../../../public/example-ned/residences-munich.jpg";
import penthouseImage from "../../../public/example-ned/penthouse-hamburg.jpg";
import detailImage from "../../../public/example-ned/stone-detail.jpg";
import { Arrow, Reveal, SiteHeader } from "./interaction";
import styles from "./page.module.css";

type Property = {
  index: string;
  city: string;
  name: string;
  type: string;
  area: string;
  price: string;
  image: StaticImageData;
  className: string;
};

const properties: Property[] = [
  {
    index: "01",
    city: "Berlin — Wannsee",
    name: "Villa No. 04",
    type: "Lakeside residence",
    area: "320 m²",
    price: "€2,850,000",
    image: villaImage,
    className: styles.propertyLarge,
  },
  {
    index: "02",
    city: "Hamburg — HafenCity",
    name: "The Elbe Penthouse",
    type: "Penthouse",
    area: "184 m²",
    price: "€1,940,000",
    image: penthouseImage,
    className: styles.propertyWide,
  },
  {
    index: "03",
    city: "Munich — Bogenhausen",
    name: "Lindenhof Residences",
    type: "Garden apartment",
    area: "142 m²",
    price: "€1,580,000",
    image: residenceImage,
    className: styles.propertyTall,
  },
];

const stats = [
  ["12+", "Years of expertise"],
  ["€480M", "Property volume"],
  ["320+", "Homes sold"],
  ["98%", "Client referrals"],
];

const services = [
  ["01", "Buy", "A considered search, on and off market.", villaImage],
  ["02", "Sell", "Positioning that reveals a home's true value.", penthouseImage],
  ["03", "Invest", "Clear thinking for long-term decisions.", residenceImage],
  ["04", "Property advisory", "Independent guidance from first idea to keys.", interiorImage],
] as const;

function PropertyCard({ property }: { property: Property }) {
  return (
    <article className={`${styles.propertyCard} ${property.className}`}>
      <a href="mailto:hello@arca-estates.com?subject=Property enquiry" aria-label={`Enquire about ${property.name}`}>
        <div className={styles.propertyImage}>
          <Image
            src={property.image}
            alt={`${property.name}, ${property.city}`}
            fill
            sizes="(max-width: 760px) calc(100vw - 36px), (max-width: 1100px) 55vw, 58vw"
            className={styles.cover}
          />
          <span className={styles.propertyIndex}>{property.index}</span>
          <span className={styles.propertyArrow}><Arrow diagonal /></span>
        </div>
        <div className={styles.propertyMeta}>
          <div>
            <p>{property.city}</p>
            <h3>{property.name}</h3>
          </div>
          <dl>
            <div><dt>{property.type}</dt><dd>{property.area}</dd></div>
            <div><dt>Guide price</dt><dd>{property.price}</dd></div>
          </dl>
        </div>
      </a>
    </article>
  );
}

function SectionLabel({ number, children }: { number: string; children: string }) {
  return (
    <div className={styles.sectionLabel}>
      <span>{number}</span>
      <span>{children}</span>
    </div>
  );
}

export function ArcaLanding() {
  return (
    <main className={styles.page} id="top" lang="en">
      <a className={styles.skipLink} href="#content">Skip to content</a>
      <SiteHeader />

      <div id="content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <Image
            src={heroImage}
            alt="Contemporary pale-stone villa beside a quiet lake"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className={styles.heroImage}
          />
          <div className={styles.heroVeil} />
          <div className={styles.heroGrid}>
            <p className={styles.heroKicker}>Private real estate advisory · Germany</p>
            <h1 id="hero-title">
              <span>Exceptional homes.</span>
              <em>Enduring places.</em>
            </h1>
            <p className={styles.heroLead}>
              Curated properties for people who value architecture, location and quality.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.lightButton} href="#properties">Explore properties <Arrow /></a>
              <a className={styles.ghostButton} href="mailto:hello@arca-estates.com?subject=Selling with ARCA">Sell with us <Arrow diagonal /></a>
            </div>
            <div className={styles.heroFoot}>
              <span>Berlin · Hamburg · Munich</span>
              <a href="#properties">Scroll to discover <i aria-hidden="true" /></a>
              <span>52.5200° N · 13.4050° E</span>
            </div>
          </div>
        </section>

        <section className={styles.properties} id="properties" aria-labelledby="properties-title">
          <Reveal className={styles.sectionTopline}>
            <SectionLabel number="01">Selected properties</SectionLabel>
            <p>Homes chosen for the quality of their architecture, setting and enduring value.</p>
          </Reveal>
          <Reveal className={styles.propertiesHeading}>
            <h2 id="properties-title">A more considered<br /><em>way of living.</em></h2>
            <a className={styles.textLink} href="mailto:hello@arca-estates.com?subject=Private property list">View all properties <Arrow /></a>
          </Reveal>
          <div className={styles.propertyGrid}>
            {properties.map((property, index) => (
              <Reveal key={property.name} delay={index * 90} className={property.className}>
                <PropertyCard property={{ ...property, className: "" }} />
              </Reveal>
            ))}
          </div>
        </section>

        <section className={styles.statement} aria-label="Our point of view">
          <Reveal>
            <p>We don&apos;t sell square metres.</p>
            <h2>We find places<br />worth <em>living in.</em></h2>
          </Reveal>
          <span className={styles.statementNote}>Thoughtful homes · Personal representation</span>
        </section>

        <section className={styles.about} id="about" aria-labelledby="about-title">
          <div className={styles.aboutMedia}>
            <Image src={detailImage} alt="Travertine stair and bronze handrail detail" fill sizes="(max-width: 760px) 100vw, 43vw" className={styles.cover} />
            <span>Material, light, proportion.</span>
          </div>
          <div className={styles.aboutCopy}>
            <Reveal><SectionLabel number="02">About ARCA</SectionLabel></Reveal>
            <Reveal delay={80}>
              <h2 id="about-title">Real estate,<br /><em>done differently.</em></h2>
            </Reveal>
            <Reveal delay={140}>
              <p className={styles.aboutLead}>
                ARCA is an independent property advisory for exceptional homes across Germany. We combine local intelligence, architectural understanding and discreet representation — from first conversation to final signature.
              </p>
            </Reveal>
            <div className={styles.stats}>
              {stats.map(([value, label], index) => (
                <Reveal key={label} delay={index * 70}>
                  <strong>{value}</strong><span>{label}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.services} id="services" aria-labelledby="services-title">
          <Reveal className={styles.servicesIntro}>
            <SectionLabel number="03">Our expertise</SectionLabel>
            <h2 id="services-title">One trusted partner.<br /><em>Every considered move.</em></h2>
          </Reveal>
          <div className={styles.serviceList}>
            {services.map(([number, title, copy, image]) => (
              <a key={title} href="mailto:hello@arca-estates.com?subject=Advisory enquiry" className={styles.serviceRow}>
                <span className={styles.serviceNumber}>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <span className={styles.serviceArrow}><Arrow diagonal /></span>
                <span className={styles.servicePreview} aria-hidden="true">
                  <Image src={image} alt="" fill sizes="260px" className={styles.cover} />
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className={styles.story} aria-labelledby="story-title">
          <div className={styles.storyImage}>
            <Image src={interiorImage} alt="Minimal dining room overlooking Lake Wannsee" fill sizes="(max-width: 900px) 100vw, 66vw" className={styles.cover} />
            <div className={styles.storyImageTop}><span>Residence 01 / 03</span><span>Exclusive</span></div>
          </div>
          <Reveal className={styles.storyPanel}>
            <SectionLabel number="04">Private residence</SectionLabel>
            <div>
              <p className={styles.storyLocation}>Berlin · Wannsee</p>
              <h2 id="story-title">Villa<br /><em>am See</em></h2>
              <p className={styles.storyLead}>A quiet composition of stone, water and filtered light. Designed around the changing moods of the lake, this private residence makes every room feel connected to the landscape.</p>
              <dl className={styles.storyFacts}>
                <div><dt>Living area</dt><dd>320 m²</dd></div>
                <div><dt>Plot</dt><dd>1,840 m²</dd></div>
                <div><dt>Bedrooms</dt><dd>4</dd></div>
                <div><dt>Completed</dt><dd>2023</dd></div>
              </dl>
              <a className={styles.darkButton} href="mailto:hello@arca-estates.com?subject=Villa am See">View residence <Arrow /></a>
            </div>
          </Reveal>
        </section>

        <section className={styles.philosophy} aria-labelledby="philosophy-title">
          <div className={styles.philosophyTop}>
            <SectionLabel number="05">What guides us</SectionLabel>
            <p>We look beyond the listing — to how a place is made, how it feels, and how it will age.</p>
          </div>
          <h2 id="philosophy-title">
            <Reveal><span>Architecture.</span></Reveal>
            <Reveal delay={80}><span>Location.</span></Reveal>
            <Reveal delay={160}><em>Longevity.</em></Reveal>
          </h2>
        </section>

        <section className={styles.testimonial} aria-labelledby="testimonial-title">
          <SectionLabel number="06">Client perspective</SectionLabel>
          <Reveal>
            <blockquote id="testimonial-title">“ARCA understood that we were not simply looking for more space. They found a home with the restraint, light and permanence we had struggled to describe.”</blockquote>
            <div className={styles.quoteFoot}>
              <cite>Clara &amp; Jonas M.</cite>
              <span>Berlin · Private acquisition</span>
            </div>
          </Reveal>
        </section>

        <section className={styles.journal} id="journal" aria-labelledby="journal-title">
          <div className={styles.journalHeading}>
            <SectionLabel number="07">ARCA Journal</SectionLabel>
            <Reveal>
              <h2 id="journal-title">Notes on how<br />we <em>choose to live.</em></h2>
            </Reveal>
          </div>
          <div className={styles.journalList}>
            <article><span>Design notes</span><h3>What makes a home age well?</h3><time dateTime="2026-08-04">04.08.26</time></article>
            <article><span>Market letter</span><h3>Berlin&apos;s quieter addresses</h3><time dateTime="2026-07-17">17.07.26</time></article>
            <article><span>Conversation</span><h3>On materials, memory and place</h3><time dateTime="2026-06-28">28.06.26</time></article>
          </div>
          <a className={styles.textLink} href="mailto:hello@arca-estates.com?subject=ARCA Journal">Receive the journal <Arrow /></a>
        </section>

        <section className={styles.finalCta} aria-labelledby="cta-title">
          <Image src={heroImage} alt="Quiet lakeside residence at dawn" fill sizes="100vw" className={styles.cover} />
          <div className={styles.ctaShade} />
          <Reveal className={styles.ctaContent}>
            <p>Begin a private conversation</p>
            <h2 id="cta-title">Find a place<br />worth <em>calling home.</em></h2>
            <div>
              <a className={styles.lightButton} href="#properties">Explore properties <Arrow /></a>
              <a className={styles.ctaTextLink} href="mailto:hello@arca-estates.com">Talk to an advisor <Arrow diagonal /></a>
            </div>
          </Reveal>
        </section>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <a className={styles.footerLogo} href="#top">ARCA<span>.</span></a>
          <div><p>Offices</p><a href="mailto:berlin@arca-estates.com">Berlin</a><a href="mailto:hamburg@arca-estates.com">Hamburg</a><a href="mailto:munich@arca-estates.com">Munich</a></div>
          <div><p>Social</p><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a></div>
          <div className={styles.footerContact}><p>New business</p><a href="mailto:hello@arca-estates.com">hello@arca-estates.com <Arrow diagonal /></a><span>+49 30 890 44 120</span></div>
        </div>
        <div className={styles.footerLegal}><span>© ARCA Estates 2026</span><div><span>Privacy</span><span>Imprint</span></div><a href="#top">Back to top ↑</a></div>
        <div className={styles.footerWordmark} aria-hidden="true">ARCA</div>
      </footer>
    </main>
  );
}
