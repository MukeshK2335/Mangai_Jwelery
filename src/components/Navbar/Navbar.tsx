import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/catalog", label: "Catalog" },
  { to: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__inner container">
          <Link to="/" className="navbar__logo" aria-label="Mangai Jewelry home">
            <img src="/logo.jpeg" alt="Mangai Jewelry logo" className="navbar__logo-img" />
            <div className="navbar__logo-text">
              <span className="wordmark">MANGAI</span>
              <span className="navbar__logo-sub">JEWELRY</span>
            </div>
          </Link>

          <nav className="navbar__links" aria-label="Primary">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? "navbar__link--active" : ""}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className={`navbar__burger ${menuOpen ? "navbar__burger--open" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="navbar__burger-line" />
            <span className="navbar__burger-line" />
            <span className="navbar__burger-line" />
          </button>
        </div>
        <div className="navbar__hairline" />
      </header>

      <div className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}>
        <div className="mobile-menu__bg" onClick={() => setMenuOpen(false)} />
        <aside className="mobile-menu__panel" role="dialog" aria-label="Mobile navigation">
          <div className="mobile-menu__head">
            <img src="/logo.jpeg" alt="Mangai Jewelry logo" className="mobile-menu__logo" />
            <div className="mobile-menu__brand">
              <span className="wordmark">MANGAI</span>
              <span className="mobile-menu__brand-sub">JEWELRY</span>
            </div>
          </div>
          <nav className="mobile-menu__nav" aria-label="Mobile">
            {LINKS.map((l, i) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `mobile-menu__link ${isActive ? "mobile-menu__link--active" : ""}`
                }
                style={{ transitionDelay: menuOpen ? `${80 + i * 60}ms` : "0ms" }}
              >
                {l.label}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </NavLink>
            ))}
          </nav>
          <div className="mobile-menu__foot">
            <span className="section-label">DM for orders & details</span>
            <a href="https://www.instagram.com/mangai_jewelry" target="_blank" rel="noreferrer" className="btn-ghost mobile-menu__cta">
              Instagram
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
