"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Mail, ArrowDown, Download } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import type { SiteContent } from "@/lib/content";

const LatentSpace = dynamic(() => import("./LatentSpace"), { ssr: false });

export default function Hero({ hero }: { hero: SiteContent["hero"] }) {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex items-center overflow-hidden"
    >
      <LatentSpace labels={hero.nodes} />

      {/* colorful ambient glows */}
      <motion.div
        animate={{ opacity: [0.25, 0.4, 0.25], scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-violet/20 blur-[110px]"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.35, 0.2], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="pointer-events-none absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-teal/15 blur-[110px]"
      />

      {/* Vignette so text stays legible over the 3D field */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--void)_78%)]" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono-label text-xs uppercase text-teal mb-5"
        >
          {hero.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05]"
        >
          <span className="text-gradient">{hero.name}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22 }}
          className="mt-6 text-base sm:text-lg text-text-muted max-w-xl mx-auto leading-relaxed"
        >
          {hero.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.34 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#projects"
            className="rounded-full bg-amber text-void font-medium text-sm px-6 py-2.5 hover:brightness-110 transition"
          >
            View projects
          </a>
          <a
            href={hero.resumeUrl}
            download
            className="rounded-full bg-gradient-to-r from-violet to-teal text-void font-medium text-sm px-6 py-2.5 hover:brightness-110 transition flex items-center gap-2"
          >
            <Download size={15} /> Download resume
          </a>
          <a
            href={`mailto:${hero.email}`}
            className="glass rounded-full text-sm px-6 py-2.5 hover:border-violet-soft/50 transition flex items-center gap-2"
          >
            <Mail size={15} /> Get in touch
          </a>
          <a
            href={hero.github}
            target="_blank"
            rel="noreferrer"
            className="glass rounded-full p-2.5 hover:border-violet-soft/50 transition"
            aria-label="GitHub"
          >
            <GithubIcon size={16} />
          </a>
          <a
            href={hero.linkedin}
            target="_blank"
            rel="noreferrer"
            className="glass rounded-full p-2.5 hover:border-violet-soft/50 transition"
            aria-label="LinkedIn"
          >
            <LinkedinIcon size={16} />
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-4 font-mono-label text-[11px] text-text-faint uppercase"
        >
          {hero.location}
        </motion.p>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-faint"
      >
        <ArrowDown size={18} />
      </motion.div>
    </section>
  );
}
