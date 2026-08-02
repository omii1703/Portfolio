"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import GlassCard from "./GlassCard";
import type { SiteContent } from "@/lib/content";

export default function About({ about }: { about: SiteContent["about"] }) {
  return (
    <section id="about" className="relative py-28 px-6 overflow-hidden">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-teal/15 blur-[100px]" />

      <div className="relative mx-auto max-w-5xl">
        <Reveal variant="flipUp">
          <p className="font-mono-label text-xs uppercase text-teal mb-3">
            01 &mdash; About
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight max-w-xl">
            <span className="text-gradient">{about.heading}</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid md:grid-cols-5 gap-10 items-start">
          {/* Photo — flips in from the left */}
          <Reveal delay={0.05} variant="flipLeft" className="md:col-span-2">
            <PhotoCard src={about.photoUrl} />
          </Reveal>

          <div className="md:col-span-3 space-y-8">
            {/* Body text — slides in from the right */}
            <Reveal delay={0.15} variant="slideRight">
              <p className="text-text-muted leading-relaxed text-base">
                {about.body}
              </p>
            </Reveal>

            {/* Stats — zoom in */}
            <Reveal delay={0.25} variant="zoomIn">
              <GlassCard className="p-6 grid grid-cols-2 gap-6" tilt={false}>
                {about.stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.7, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1 + 0.3,
                      type: "spring",
                      stiffness: 200,
                      damping: 14,
                    }}
                  >
                    <p className="font-display text-3xl font-bold text-gradient">
                      {stat.value}
                    </p>
                    <p className="text-xs text-text-faint mt-1 leading-snug">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhotoCard({ src }: { src: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateY: -18, transformPerspective: 1000 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* animated gradient ring */}
      <motion.div
        animate={{
          background: [
            "linear-gradient(135deg, #7c6cf6, #45d9c8)",
            "linear-gradient(135deg, #45d9c8, #f7b267)",
            "linear-gradient(135deg, #f7b267, #7c6cf6)",
            "linear-gradient(135deg, #7c6cf6, #45d9c8)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-1.5 rounded-[1.75rem] opacity-60 blur-md"
      />

      <GlassCard className="relative p-3 rounded-[1.5rem]">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
          <Image
            src={src}
            alt="Om Jadhav"
            fill
            sizes="(max-width: 768px) 90vw, 400px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-violet/10 mix-blend-overlay" />
        </div>

        {/* floating status badge */}
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-4 -right-4 glass-card rounded-xl px-3.5 py-2"
        >
          <p className="font-mono-label text-[10px] text-teal uppercase">Status</p>
          <p className="text-xs font-medium mt-0.5">Building &amp; shipping</p>
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}
