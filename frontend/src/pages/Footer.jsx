import React from "react";
import styled from "styled-components";
import mLogo from "../assets/media/M-LOGO.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      <footer>
        {/* ── Main Content Row ── */}
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="brand-col">
            {/* Logo */}
            <div className="footer-logo">
              <div className="footer-logo-img">
                <img
                  src={mLogo}
                  alt="VGLUG Foundation"
                />
              </div>
              <div>
                <span className="logo-vglug">VGLUG</span>
                <span className="logo-portal">Job Portal</span>
              </div>
            </div>

            <p className="footer-desc">
              Empowering VGLUG Foundation members with exclusive career opportunities. Connect, collaborate, and grow within the open-source ecosystem.
            </p>

            {/* Contact */}
            <div className="contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>support@vglug.org</span>
            </div>
            <div className="contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <a href="https://vglug.org" target="_blank" rel="noreferrer" className="contact-link">
                vglug.org
              </a>
            </div>
          </div>

          {/* Resources */}
          <div className="footer-col">
            <h4 className="col-title">Resources</h4>
            <ul className="col-links">
              <FooterLink href="https://vglug.org/category/tutorials/" label="Tutorials" />
              <FooterLink href="https://vglug.org/category/free-ebooks/" label="Free E-Books" />
              <FooterLink href="https://vglug.org/blog/" label="Blog" />
              <FooterLink href="https://github.com/VGLUGFoundation" label="GitHub" />
            </ul>
          </div>

          {/* Platform */}
          <div className="footer-col">
            <h4 className="col-title">Platform</h4>
            <ul className="col-links">
              <FooterLink href="/" label="About Us" />
              <FooterLink href="/all-jobs" label="Internal Jobs" />
              <FooterLink href="/recruiter-apply" label="Hire with Us" />
              <FooterLink href="https://vglug.org/testimonial/contact/" label="Contact Support" />
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="col-title">Quick Links</h4>
            <ul className="col-links">
              <FooterLink href="/all-jobs" label="Browse Jobs" />
              <FooterLink href="/register" label="Member Signup" />
              <FooterLink href="/login" label="Member Login" />
              <FooterLink href="/recruiter-apply" label="Recruiter Apply" />
            </ul>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="footer-divider-wrap">
          <div className="footer-divider" />
        </div>

        {/* ── Bottom Bar ── */}
        <div className="footer-bottom">
          {/* Copyright */}
          <p className="copyright">
            © {currentYear}{" "}
            <a href="https://vglug.org" target="_blank" rel="noreferrer" className="copyright-link">
              VGLUG Foundation
            </a>
            . All rights reserved. Built with ❤️ for the FOSS community.
          </p>

          {/* Social Icons */}
          <div className="social-row">
            <span className="social-label">Follow</span>
            <SocialBtn href="https://github.com/VGLUGFoundation" title="GitHub">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58 0-.28-.01-1.03-.02-2.03-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.01 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </SocialBtn>
            <SocialBtn href="https://linkedin.com" title="LinkedIn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.66H9.37V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM3.56 20.45h3.56V9H3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z"/>
              </svg>
            </SocialBtn>
            <SocialBtn href="https://twitter.com" title="Twitter / X">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.9 1.2h3.6l-7.9 9L24 22.8h-7.3l-5.7-7.5-6.5 7.5H1l8.4-9.7L0 1.2h7.5l5.2 6.9 6.2-6.9zm-1.3 19.4h2L6.5 3.2H4.3L17.6 20.6z"/>
              </svg>
            </SocialBtn>
            <SocialBtn href="https://facebook.com" title="Facebook">
              <svg width="9" height="16" viewBox="0 0 9 16" fill="currentColor">
                <path d="M8.44 6.4H7.2H6.76V5.88V4.28V3.77H7.2H8.13c.24 0 .44-.2.44-.51V.52C8.57.23 8.39 0 8.13 0H6.51C4.76 0 3.55 1.45 3.55 3.59V5.83V6.35H3.1H1.6C1.29 6.35 1 6.63 1 7.05V8.9c0 .36.24.6.6.6H2.06H2.5v.52v5.19c0 .36.24.69.6.69H5.18c.13 0 .24-.08.33-.18.09-.1.16-.28.16-.44V10.14V9.63H6.13H7.13c.29 0 .51-.2.55-.51v-.03-.03L8 7.28C8.01 7.1 8 6.89 7.86 6.68 7.81 6.55 7.62 6.42 7.44 6.4z"/>
              </svg>
            </SocialBtn>
          </div>
        </div>
      </footer>
    </FooterWrapper>
  );
};

/* ── Sub-components ── */

const FooterLink = ({ href, label }) => (
  <li>
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="footer-link"
    >
      {label}
    </a>
  </li>
);

const SocialBtn = ({ href, title, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    title={title}
    className="social-btn"
  >
    {children}
  </a>
);

const FooterWrapper = styled.div`
  footer {
    background: linear-gradient(135deg, #0a0f1e 0%, #0f172a 60%, #111827 100%);
    border-top: 1px solid rgba(165, 180, 252, 0.15);
    color: #e2e8f0;
    font-family: 'Inter', 'Segoe UI', sans-serif;
    padding: 60px 0 0 0;
  }

  /* ── Grid ── */
  .footer-grid {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 48px;
  }

  /* ── Brand ── */
  .footer-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }
  .footer-logo-img {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    padding: 2.5px;
    background: linear-gradient(135deg, #ffffff, #e8edf5);
    border: 1.5px solid rgba(255,255,255,0.2);
    box-shadow: 0 1px 6px rgba(99,102,241,0.15);
    flex-shrink: 0;
    overflow: hidden;
  }
  .footer-logo-img img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }
  .logo-vglug {
    font-size: 16px;
    font-weight: 800;
    background: linear-gradient(135deg, #f59e0b, #fbbf24);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .logo-portal {
    font-size: 16px;
    font-weight: 700;
    color: #f1f5f9;
    margin-left: 4px;
  }
  .footer-desc {
    font-size: 13.5px;
    color: rgba(255,255,255,0.5);
    line-height: 1.8;
    margin-bottom: 20px;
    max-width: 280px;
  }
  .contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: rgba(255,255,255,0.6);
    margin-bottom: 10px;
  }
  .contact-link {
    color: rgba(255,255,255,0.6);
    text-decoration: none;
    transition: color 0.2s;
  }
  .contact-link:hover {
    color: #f59e0b;
  }

  /* ── Columns ── */
  .col-title {
    font-size: 12px;
    font-weight: 700;
    color: #f59e0b;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 18px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(245,158,11,0.15);
  }
  .col-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .footer-link {
    font-size: 13.5px;
    color: rgba(255,255,255,0.5);
    text-decoration: none;
    transition: color 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .footer-link:hover {
    color: #f59e0b;
  }

  /* ── Divider ── */
  .footer-divider-wrap {
    max-width: 1200px;
    margin: 48px auto 0;
    padding: 0 32px;
  }
  .footer-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent);
  }

  /* ── Bottom Bar ── */
  .footer-bottom {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 32px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }
  .copyright {
    font-size: 12.5px;
    color: rgba(255,255,255,0.35);
    margin: 0;
  }
  .copyright-link {
    color: #f59e0b;
    font-weight: 600;
    text-decoration: none;
  }
  .copyright-link:hover {
    color: #fbbf24;
  }
  .social-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .social-label {
    font-size: 11px;
    color: rgba(255,255,255,0.3);
    margin-right: 4px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .social-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255,255,255,0.5);
    text-decoration: none;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .social-btn:hover {
    background: #f59e0b;
    border-color: #f59e0b;
    color: #fff;
    transform: translateY(-2px);
  }

  /* ══════════════════════════════════════════════════
     RESPONSIVE — Tablet
     ══════════════════════════════════════════════════ */
  @media (max-width: 900px) {
    .footer-grid {
      grid-template-columns: 1fr 1fr;
      gap: 36px 32px;
    }
    .brand-col {
      grid-column: 1 / -1;
    }
    .footer-desc {
      max-width: 100%;
    }
  }

  /* ══════════════════════════════════════════════════
     RESPONSIVE — Mobile
     ══════════════════════════════════════════════════ */
  @media (max-width: 580px) {
    footer {
      padding: 40px 0 0 0;
    }
    .footer-grid {
      grid-template-columns: 1fr;
      gap: 28px;
      padding: 0 20px;
    }
    .footer-desc {
      max-width: 100%;
      font-size: 13px;
    }

    .footer-divider-wrap {
      margin-top: 32px;
      padding: 0 20px;
    }

    .footer-bottom {
      flex-direction: column;
      text-align: center;
      padding: 20px 20px 24px;
      gap: 14px;
    }
    .copyright {
      font-size: 11.5px;
      line-height: 1.6;
    }
    .social-row {
      justify-content: center;
    }
    .social-label {
      display: none;
    }
    .social-btn {
      width: 36px;
      height: 36px;
    }

    /* Make footer columns more compact on mobile */
    .footer-col {
      padding-bottom: 4px;
    }
    .col-title {
      margin-bottom: 12px;
      padding-bottom: 8px;
    }
    .col-links {
      gap: 8px;
    }
  }
`;

export default Footer;
