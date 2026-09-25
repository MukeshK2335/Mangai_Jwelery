import { useState, type FormEvent } from "react";
import {
  SITE,
  WHATSAPP_DISPLAY,
  buildWhatsAppLink,
} from "../../config/site";
import "./Contact.css";

interface FormState {
  name: string;
  email: string;
  message: string;
}

const initial: FormState = { name: "", email: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState<FormState>(initial);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all three fields before sending.");
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (!emailOk) {
      setError("Please enter a valid email address so we can reply.");
      return;
    }

    const subject = encodeURIComponent(`Mangai Jewelry inquiry — ${form.name.trim()}`);
    const body = encodeURIComponent(
      `Name: ${form.name.trim()}\nEmail: ${form.email.trim()}\n\n${form.message.trim()}`,
    );
    window.location.href = `mailto:${SITE.email.address}?subject=${subject}&body=${body}`;

    setSubmitted(true);
    setForm(initial);
  }

  const whatsAppGeneral = buildWhatsAppLink();

  return (
    <main className="page contact">
      <div className="container">
        <header className="page-header">
          <span className="section-label">Contact Mangai Jewelry</span>
          <h1 className="page-title">Say hello, or place an order.</h1>
          <div className="gold-divider">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="sparkle">
              <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="page-lead">
            The quickest way to reach us is direct message on Instagram or WhatsApp — orders, stock checks,
            custom sizing, reseller inquiries, and international shipping quotes all get answered there within a day.
          </p>
        </header>

        <div className="contact__grid">
          <section className="contact__info">
            <ul className="contact__channels">
              <li className="contact__channel">
                <div className="contact__channel-mark">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <path d="M7 10.5c0-1 1-2 2.5-2s2 .8 2.5 2c.5 1.3 1.3 2.5 3.5 2.5s2-.8 2-2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="contact__channel-title">Instagram</h3>
                  <a
                    href={SITE.instagram.url}
                    target="_blank"
                    rel="noreferrer"
                    className="contact__channel-link"
                  >
                    {SITE.instagram.handle}
                  </a>
                  <p className="contact__channel-body">
                    Drop a DM for orders, product details, sizing help, or custom requests.
                  </p>
                </div>
              </li>

              <li className="contact__channel">
                <div className="contact__channel-mark">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="contact__channel-title">WhatsApp / DM for orders</h3>
                  <a
                    href={whatsAppGeneral}
                    target="_blank"
                    rel="noreferrer"
                    className="contact__channel-link"
                  >
                    Message on WhatsApp &middot; {WHATSAPP_DISPLAY}
                  </a>
                  <p className="contact__channel-body">
                    Orders, reseller pricing, and worldwide shipping quotes. Replies within a working day.
                  </p>
                </div>
              </li>

              <li className="contact__channel">
                <div className="contact__channel-mark">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="contact__channel-title">Email</h3>
                  <a href={`mailto:${SITE.email.address}`} className="contact__channel-link">
                    {SITE.email.address}
                  </a>
                  <p className="contact__channel-body">
                    Press, partnership enquiries, and wholesale/reseller decks on request.
                  </p>
                </div>
              </li>
            </ul>

            <div className="contact__aside">
              <hr className="hairline-rule" />
              <div className="contact__aside-inner">
                <span className="section-label">Resellers welcome</span>
                <p>
                  If you'd like to stock Mangai in your boutique, style shoots with our pieces, or run a
                  small reseller account, reach out with your location, account type, and projected volume.
                  We reply with wholesale tier pricing and minimums.
                </p>
              </div>
            </div>
          </section>

          <section className="contact__form-wrap" aria-labelledby="form-heading">
            <div className="contact__form-frame">
              <div className="contact__form-frame-line contact__form-frame-line--t" />
              <div className="contact__form-frame-line contact__form-frame-line--b" />
              <div className="contact__form-frame-line contact__form-frame-line--l" />
              <div className="contact__form-frame-line contact__form-frame-line--r" />

              <div className="contact__form-head">
                <h2 id="form-heading" className="contact__form-title">Send us a message</h2>
                <p className="contact__form-sub">
                  Prefer email or a written enquiry? Fill out the form below and we'll get back to you.
                </p>
              </div>

              <form className="contact__form" onSubmit={onSubmit} noValidate>
                <div className="contact__field">
                  <label htmlFor="name" className="contact__label">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => onChange("name", e.target.value)}
                    className="contact__input"
                    placeholder="Your full name"
                  />
                </div>

                <div className="contact__field">
                  <label htmlFor="email" className="contact__label">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    className="contact__input"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="contact__field">
                  <label htmlFor="message" className="contact__label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={form.message}
                    onChange={(e) => onChange("message", e.target.value)}
                    className="contact__input contact__input--area"
                    placeholder="Tell us what you're looking for — a specific piece, sizing, order details, reseller inquiry, etc."
                  />
                </div>

                {error && (
                  <div className="contact__error" role="alert">
                    {error}
                  </div>
                )}

                {submitted && !error && (
                  <div className="contact__success" role="status">
                    Opening your mail client. If nothing happens, email us directly at{" "}
                    <a href={`mailto:${SITE.email.address}`}>{SITE.email.address}</a>.
                  </div>
                )}

                <div className="contact__actions">
                  <button type="submit" className="btn-gold contact__submit">
                    Send message
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
