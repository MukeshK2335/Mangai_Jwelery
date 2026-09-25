import "./About.css";

const VALUES = [
  {
    title: "Built for daily wear",
    body:
      "We design Mangai pieces to be the ones you reach for every morning. Not just for special occasions — for commutes, coffee runs, and late evenings.",
  },
  {
    title: "Transparent on materials",
    body:
      "Every piece is brass or copper core with thick 18k gold plating, sealed with an anti-tarnish, hypoallergenic nano-coating. No mystery alloys, no nickel surprises.",
  },
  {
    title: "Made with care, priced fairly",
    body:
      "Small-batch crafted in India with a small team of artisans. We price for longevity and craftsmanship, not markup and trend cycles.",
  },
];

export default function About() {
  return (
    <main className="page about">
      <div className="container">
        <header className="page-header">
          <span className="section-label">About Mangai Jewelry</span>
          <h1 className="page-title">Jewelry you can keep on.</h1>
          <div className="gold-divider">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="sparkle">
              <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="page-lead">
            Mangai is a small anti-tarnish jewelry studio based in India. We make pieces for people who love
            gold tone, but don't love the upkeep of costume jewelry — or the price tag of solid gold.
          </p>
        </header>

        <section className="about__story">
          <div className="about__story-grid">
            <div className="about__story-text">
              <h2 className="about__heading">What "anti-tarnish" actually means.</h2>
              <p className="about__body">
                Most plated jewelry starts to dull after a few showers, a sweaty day, or a trip to the beach.
                The thin gold layer rubs, oxidizes, and eventually peels, leaving a brassy or greenish cast behind.
              </p>
              <p className="about__body">
                Mangai pieces use a much thicker plating deposit on a high-density core, then pass through two
                extra sealing baths — one to close the plating pores, one to add a clear, UV-stable nano-coating.
                The result: the same warm gold tone after months of daily wear, not just the first week.
              </p>
              <p className="about__body">
                Anti-tarnish doesn't mean indestructible. It means you can live your life without a jewelry
                removal checklist before the gym, before washing dishes, before stepping out in the rain.
              </p>
            </div>
            <div className="about__story-visual">
              <div className="about__frame">
                <div className="about__frame-top" />
                <div className="about__frame-bottom" />
                <div className="about__frame-left" />
                <div className="about__frame-right" />
                <img
                  src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=artisan%20hands%20crafting%20gold%20jewelry%20in%20workshop%20close%20up%20soft%20lighting%20moody%20dark%20background&image_size=portrait_4_3"
                  alt="Jewelry craftsmanship"
                  className="about__img"
                />
                <div className="about__img-vignette" />
              </div>
              <p className="about__caption">
                Small-batch finished and inspected by hand before it leaves our studio.
              </p>
            </div>
          </div>
        </section>

        <hr className="hairline-rule about__rule" />

        <section className="about__values">
          <div className="about__values-head">
            <span className="section-label">How we work</span>
            <h2 className="about__heading">Quiet, considered, unhurried.</h2>
          </div>
          <ul className="about__values-grid">
            {VALUES.map((v) => (
              <li key={v.title} className="about__value">
                <div className="about__value-num">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                    <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="about__value-title">{v.title}</h3>
                <p className="about__value-body">{v.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <hr className="hairline-rule about__rule" />

        <section className="about__founder">
          <div className="about__founder-grid">
            <div className="about__founder-visual">
              <div className="about__frame about__frame--portrait">
                <div className="about__frame-top" />
                <div className="about__frame-bottom" />
                <div className="about__frame-left" />
                <div className="about__frame-right" />
                <img
                  src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=portrait%20of%20elegant%20indian%20woman%20jewelry%20designer%20in%20studio%20warm%20moody%20lighting%20dark%20background%20editorial&image_size=portrait_4_3"
                  alt="Mangai founder"
                  className="about__img"
                />
                <div className="about__img-vignette" />
              </div>
            </div>
            <div className="about__founder-text">
              <span className="section-label">Founder's note</span>
              <blockquote className="about__quote">
                "I started Mangai because I kept buying 'everyday gold jewelry' only to have it discolor
                within a month. I wanted pieces I could forget about — the kind your grandmother would have
                owned, minus the gold rate sticker shock. Every design we release is something I've tested
                on myself for at least three months before it goes live. If it doesn't hold up, it doesn't ship."
              </blockquote>
              <p className="about__signature">— Mangai, founder</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
