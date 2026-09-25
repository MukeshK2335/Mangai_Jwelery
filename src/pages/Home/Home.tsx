import { Link } from "react-router-dom";
import "./Home.css";

const TRUST_ITEMS = [
  {
    title: "Anti-tarnish",
    body: "Sealed with a multi-layer finish so pieces hold their gold tone through daily wear, water, and sweat.",
  },
  {
    title: "Worldwide shipping",
    body: "Dispatched from India with tracked international delivery. DM for a live quote to your country.",
  },
  {
    title: "Resellers welcome",
    body: "Wholesale pricing and tiered minimums for boutique partners, stylists, and small-business resellers.",
  },
];

const HERO_IMG =
  "../../home-cover.jpeg";

export default function Home() {
  return (
    <main className="home">
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content">
            <div className="hero__tag">
              <span className="section-label">Anti-tarnish jewelry</span>
            </div>
            <div className="hero__brand">
              <img src="/logo.jpeg" alt="Mangai Jewelry logo" className="hero__logo" />
              <div className="hero__brand-text">
                <h1 className="wordmark wordmark-lg hero__wordmark">MANGAI</h1>
                <span className="hero__wordmark-sub">JEWELRY</span>
              </div>
            </div>
            <div className="hero__divider gold-divider">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="sparkle">
                <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="hero__line">
              Shine every day without fading.
            </p>
            <p className="hero__lead">
              Everyday gold jewelry, crafted to stay bright through showers, workouts, and long days.
              No polishing rituals. No taking it off. Just quiet, consistent shine.
            </p>
            <div className="hero__ctas">
              <Link to="/catalog" className="btn-gold">
                View the catalog
              </Link>
              <a
                href="https://www.instagram.com/mangai_jewelry"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                Visit Instagram
              </a>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__frame">
              <div className="hero__frame-top" />
              <div className="hero__frame-bottom" />
              <div className="hero__frame-left" />
              <div className="hero__frame-right" />
              <img src={HERO_IMG} alt="Mangai anti-tarnish jewelry collection" className="hero__img" />
              <div className="hero__vignette" />
              <div className="hero__accent hero__accent--tl" />
              <div className="hero__accent hero__accent--br" />
            </div>
          </div>
        </div>
      </section>

      <section className="trust container">
        <div className="trust__hairline" />
        <ul className="trust__grid">
          {TRUST_ITEMS.map((t) => (
            <li key={t.title} className="trust__item">
              <div className="trust__mark">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="trust__title">{t.title}</h3>
              <p className="trust__body">{t.body}</p>
            </li>
          ))}
        </ul>
        <div className="trust__hairline" />
      </section>

      <section className="intro">
        <div className="container intro__inner">
          <div className="intro__col">
            <div className="gold-divider">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="sparkle">
                <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="intro__title">
              Pieces made to be worn, not stored away.
            </h2>
          </div>
          <div className="intro__col">
            <p className="intro__body">
              Most gold-plated jewelry loses its tone within weeks. Mangai pieces use a reinforced
              plating process paired with a scratch-resistant sealant, so every necklace, ring, and
              bangle looks the same on day three hundred as it did on day one.
            </p>
            <p className="intro__body">
              From the office to a wedding, the gym to a weekend away — wear it, stack it, forget about it.
            </p>
            <Link to="/about" className="btn-link intro__cta">
              Read our story
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
