"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const items = [
  { name: "Work", href: "#projects" },
  { name: "Expertise", href: "#skills" },
  { name: "Journey", href: "#experience" },
  { name: "Playground", href: "#playground" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    let frame = 0;
    const updateActiveSection = () => {
      frame = 0;
      const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 86;
      const marker = headerHeight + (window.innerHeight - headerHeight) * 0.25;
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) current = section;
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1];
      }
      setActive(current ? `#${current.id}` : "");
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };
    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    sections.forEach((section) => resizeObserver.observe(section));
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  return (
    <header className='site-header'>
      <nav className='nav-inner' aria-label='Main navigation'>
        <a href='#home' className='brand' onClick={() => setIsOpen(false)} aria-label='Ishrat Rintu, home'><span className='brand-mark'>ir<span>.</span></span><span>Ishrat Rintu<span className='brand-subtitle'>Software Engineer</span></span></a>
        <div className='desktop-links'>
          {items.map((item) => <a key={item.href} href={item.href} className={active === item.href ? "nav-active" : ""} aria-current={active === item.href ? "location" : undefined}>{item.name}</a>)}
        </div>
        <div className='nav-actions'>
          <ThemeToggle />
          <a href='#contact' className={`nav-contact${active === "#contact" ? " nav-active" : ""}`} aria-current={active === "#contact" ? "location" : undefined}>Let’s talk <ArrowUpRight size={15} /></a>
          <button id='menu-toggle' type='button' className='menu-toggle' aria-label={isOpen ? "Close navigation" : "Open navigation"} aria-expanded={isOpen} aria-controls='mobile-navigation' onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </nav>
      {isOpen && <div id='mobile-navigation' className='mobile-links'>
        {[...items, { name: "Education", href: "#education" }, { name: "Recognition", href: "#achievements" }, { name: "Leadership", href: "#leadership" }, { name: "Contact", href: "#contact" }].map((item) => <a key={item.href} href={item.href} className={active === item.href ? "nav-active" : ""} aria-current={active === item.href ? "location" : undefined} onClick={() => setIsOpen(false)}>{item.name}<ArrowUpRight size={15} /></a>)}
      </div>}
    </header>
  );
}
