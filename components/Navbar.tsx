"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar({
  name,
  resumeUrl,
}: {
  name: string;
  resumeUrl: string;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`glass flex items-center gap-6 rounded-full px-5 py-2.5 transition-shadow duration-300 ${
          scrolled ? "shadow-[0_8px_30px_rgba(0,0,0,0.35)]" : ""
        }`}
      >
        <a
          href="#top"
          className="font-display text-sm font-semibold tracking-tight text-text-primary"
        >
          {name.split(" ")[0]}
          <span className="text-teal">.</span>
        </a>
        <div className="hidden sm:flex items-center gap-5">
          {LINKS.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              whileHover={{ y: -1 }}
              className="text-xs font-mono-label uppercase text-text-muted hover:text-violet-soft transition-colors"
            >
              {link.label}
            </motion.a>
          ))}
        </div>
        <a
          href={resumeUrl}
          download
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium rounded-full glass px-3.5 py-1.5 hover:border-teal/50 transition-colors"
        >
          <Download size={12} /> Resume
        </a>
        <a
          href="#contact"
          className="text-xs font-medium rounded-full bg-gradient-to-r from-violet to-teal px-4 py-1.5 text-void transition-transform hover:scale-105"
        >
          Hire me
        </a>
      </nav>
    </motion.header>
  );
}
