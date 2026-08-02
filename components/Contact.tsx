"use client";

import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import Reveal from "./Reveal";
import type { SiteContent } from "@/lib/content";

export default function Contact({
  contact,
}: {
  contact: SiteContent["contact"];
}) {
  return (
    <section id="contact" className="relative py-28 px-6 overflow-hidden">
      {/* breathing glow */}
      <motion.div
        animate={{ opacity: [0.2, 0.38, 0.2], scale: [1, 1.12, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet/10 blur-[130px]"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        {/* heading flips up */}
        <Reveal variant="flipUp">
          <p className="font-mono-label text-xs uppercase text-teal mb-3">
            06 &mdash; Contact
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            <span className="text-gradient">{contact.heading}</span>
          </h2>
          <p className="mt-4 text-text-muted">{contact.body}</p>
        </Reveal>

        {/* CTA buttons slide up with stagger */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Reveal delay={0.15} variant="slideLeft">
            <motion.a
              href={`mailto:${contact.email}`}
              whileHover={{ y: -3, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="rounded-full bg-amber text-void font-medium text-sm px-6 py-2.5 hover:brightness-110 transition flex items-center gap-2"
            >
              <Mail size={15} /> {contact.email}
            </motion.a>
          </Reveal>
          <Reveal delay={0.22} variant="slideRight">
            <motion.a
              href={`tel:${contact.phone}`}
              whileHover={{ y: -3, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="glass rounded-full text-sm px-6 py-2.5 hover:border-violet-soft/50 transition flex items-center gap-2"
            >
              <Phone size={15} /> {contact.phone}
            </motion.a>
          </Reveal>
        </div>

        {/* social icons zoom in */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {[
            { href: contact.github, label: "GitHub", Icon: GithubIcon },
            { href: contact.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
          ].map(({ href, label, Icon }, i) => (
            <Reveal key={label} delay={0.3 + i * 0.1} variant="zoomIn">
              <motion.a
                href={href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -4, scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 350 }}
                className="glass rounded-full p-2.5 hover:border-violet-soft/50 transition"
                aria-label={label}
              >
                <Icon size={16} />
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>

      <footer className="mt-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-mono-label text-[11px] text-text-faint uppercase"
        >
          Built with Next.js &middot; Three.js &middot; Framer Motion
        </motion.p>
      </footer>
    </section>
  );
}
