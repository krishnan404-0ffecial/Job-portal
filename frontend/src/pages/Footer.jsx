import React from "react";
import mLogo from "../assets/media/M-LOGO.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #0a0f1e 0%, #0f172a 60%, #111827 100%)",
        borderTop: "1px solid rgba(165,180,252,0.15)",
        color: "#e2e8f0",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        padding: "60px 0 0 0",
      }}
    >
      {/* ── Main Content Row ── */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "48px",
        }}
      >
        {/* Brand Column */}
        <div>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              padding: "2.5px",
              background: "linear-gradient(135deg, #ffffff, #e8edf5)",
              border: "1.5px solid rgba(255,255,255,0.2)",
              boxShadow: "0 1px 6px rgba(99,102,241,0.15)",
              flexShrink: 0,
            }}>
              <img
                src={mLogo}
                alt="VGLUG Foundation"
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }}
              />
            </div>
            <div>
              <span style={{ fontSize: "16px", fontWeight: "800", background: "linear-gradient(135deg,#f59e0b,#fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                VGLUG
              </span>
              <span style={{ fontSize: "16px", fontWeight: "700", color: "#f1f5f9", marginLeft: "4px" }}>
                Job Portal
              </span>
            </div>
          </div>

          <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.5)", lineHeight: "1.8", marginBottom: "20px", maxWidth: "280px" }}>
            Empowering VGLUG Foundation members with exclusive career opportunities. Connect, collaborate, and grow within the open-source ecosystem.
          </p>

          {/* Contact */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "10px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span>support@vglug.org</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <a href="https://vglug.org" target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
              vglug.org
            </a>
          </div>
        </div>

        {/* Resources */}
        <FooterCol title="Resources">
          <FooterLink href="https://vglug.org/category/tutorials/" label="Tutorials" />
          <FooterLink href="https://vglug.org/category/free-ebooks/" label="Free E-Books" />
          <FooterLink href="https://vglug.org/blog/" label="Blog" />
          <FooterLink href="https://github.com/VGLUGFoundation" label="GitHub" />
        </FooterCol>

        {/* Platform */}
        <FooterCol title="Platform">
          <FooterLink href="/" label="About Us" />
          <FooterLink href="/all-jobs" label="Internal Jobs" />
          <FooterLink href="/recruiter-apply" label="Hire with Us" />
          <FooterLink href="https://vglug.org/testimonial/contact/" label="Contact Support" />
        </FooterCol>

        {/* Quick Links */}
        <FooterCol title="Quick Links">
          <FooterLink href="/all-jobs" label="Browse Jobs" />
          <FooterLink href="/register" label="Member Signup" />
          <FooterLink href="/login" label="Member Login" />
          <FooterLink href="/recruiter-apply" label="Recruiter Apply" />
        </FooterCol>
      </div>

      {/* ── Divider ── */}
      <div style={{ maxWidth: "1200px", margin: "48px auto 0", padding: "0 32px" }}>
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent)" }} />
      </div>

      {/* ── Bottom Bar ── */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px 32px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {/* Copyright */}
        <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
          © {currentYear}{" "}
          <a href="https://vglug.org" target="_blank" rel="noreferrer" style={{ color: "#f59e0b", fontWeight: "600", textDecoration: "none" }}>
            VGLUG Foundation
          </a>
          . All rights reserved. Built with ❤️ for the FOSS community.
        </p>

        {/* Social Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginRight: "4px", fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Follow
          </span>
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

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 580px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            text-align: center !important;
          }
        }
      `}</style>
    </footer>
  );
};

/* ── Sub-components ── */

const FooterCol = ({ title, children }) => (
  <div>
    <h4
      style={{
        fontSize: "12px",
        fontWeight: "700",
        color: "#f59e0b",
        letterSpacing: "1px",
        textTransform: "uppercase",
        marginBottom: "18px",
        paddingBottom: "10px",
        borderBottom: "1px solid rgba(245,158,11,0.15)",
      }}
    >
      {title}
    </h4>
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
      {children}
    </ul>
  </div>
);

const FooterLink = ({ href, label }) => (
  <li>
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      style={{
        fontSize: "13.5px",
        color: "rgba(255,255,255,0.5)",
        textDecoration: "none",
        transition: "color 0.2s",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
      }}
      onMouseEnter={e => { e.currentTarget.style.color = "#f59e0b"; }}
      onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
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
    style={{
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      border: "1px solid rgba(255,255,255,0.12)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "rgba(255,255,255,0.5)",
      textDecoration: "none",
      transition: "all 0.2s",
      flexShrink: 0,
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = "#f59e0b";
      e.currentTarget.style.borderColor = "#f59e0b";
      e.currentTarget.style.color = "#fff";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
      e.currentTarget.style.color = "rgba(255,255,255,0.5)";
    }}
  >
    {children}
  </a>
);

export default Footer;
