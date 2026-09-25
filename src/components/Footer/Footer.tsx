import { SITE, buildWhatsAppLink } from "../../config/site";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__hairline" />
      <div className="container footer__inner">
        <div className="footer__grid">
          <div className="footer__col footer__brand">
            <div className="footer__brand-head">
              <img src="/logo.jpeg" alt="Mangai Jewelry logo" className="footer__logo" />
              <div className="footer__brand-text">
                <div className="wordmark footer__wordmark">MANGAI</div>
                <span className="footer__brand-sub">JEWELRY</span>
              </div>
            </div>
            <div className="footer__tagline">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="sparkle">
                <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" strokeLinejoin="round" />
              </svg>
              {SITE.tagline}
            </div>
            <p className="footer__copy">
              Shine every day without fading.
            </p>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Explore</h4>
            <ul className="footer__list">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/catalog">Catalog</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Connect</h4>
            <ul className="footer__list">
              <li>
                <a href={SITE.instagram.url} target="_blank" rel="noreferrer">
                  Instagram &middot; {SITE.instagram.handle}
                </a>
              </li>
              <li>
                <a href={buildWhatsAppLink()} target="_blank" rel="noreferrer">
                  WhatsApp / DM for orders
                </a>
              </li>
              <li>Resellers welcome</li>
              <li>Worldwide shipping</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {year} Mangai Jewelry. All rights reserved.</p>
          <p className="footer__legal">Handcrafted anti-tarnish pieces, made to last.</p>
        </div>
      </div>
    </footer>
  );
}
