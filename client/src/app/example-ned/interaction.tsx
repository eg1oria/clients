"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./page.module.css";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 28);
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!reduceMotion.matches) document.documentElement.style.scrollBehavior = "smooth";
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.headerScrolled : ""} ${menuOpen ? styles.headerMenuOpen : ""}`}
    >
      <div className={styles.headerInner}>
        <a className={styles.logo} href="#top" aria-label="ARCA home">
          ARCA<span>.</span>
        </a>

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          <a href="#properties">Properties</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#journal">Journal</a>
        </nav>

        <a className={styles.headerContact} href="mailto:hello@arca-estates.com">
          Contact us <Arrow />
        </a>

        <button
          className={styles.menuButton}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="arca-mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <i aria-hidden="true" />
        </button>
      </div>

      <div className={styles.mobilePanel} id="arca-mobile-menu" aria-hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          {[
            ["01", "Properties", "#properties"],
            ["02", "Services", "#services"],
            ["03", "About", "#about"],
            ["04", "Journal", "#journal"],
          ].map(([number, label, href]) => (
            <a key={label} href={href} onClick={closeMenu}>
              <small>{number}</small>
              <span>{label}</span>
              <Arrow />
            </a>
          ))}
        </nav>
        <div className={styles.mobilePanelFoot}>
          <span>Berlin · Hamburg · Munich</span>
          <a href="mailto:hello@arca-estates.com">hello@arca-estates.com</a>
        </div>
      </div>
    </header>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -9%", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.revealVisible : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      {diagonal ? (
        <path d="M5 19 19 5M9 5h10v10" />
      ) : (
        <path d="M4 12h16m-6-6 6 6-6 6" />
      )}
    </svg>
  );
}
