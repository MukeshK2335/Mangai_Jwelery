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
                  src="../../about-us.png"
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
                  src="../../mangai-signature.png"
                  alt="Mangai founder"
                  className="about__img"
                />
                <div className="about__img-vignette" />
              </div>
            </div>
            <div className="about__founder-text">
              <span className="section-label">Founder's note</span>
              <blockquote className="about__quote">
                "இருந்தாலும் மறைந்தாலும் பேர் சொல்ல வேண்டும்,
இவர் போல யார் என்று ஊர் சொல்ல வேண்டும்..."
Ever since I was a little girl, my Appa’s favorite lines echoed in my heart: to leave a mark, to stand on my own feet, and to build something the world remembers.
 At 22, balancing my books and ambitions, Mangai Jewellery was born as my step toward financial independence.
I couldn't have taken this leap alone. My parents gave me the freedom to dream, my little sister surrounds me with endless warmth and understanding, and my partner stands beside me as my greatest guide, mentor, and rock through every step of building this brand.
Built on their belief, crafted with love for every Mangai. ✨"
              </blockquote>
              <p className="about__signature">— Mangai, founder</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
