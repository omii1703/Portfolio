"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";
import GlassCard from "./GlassCard";
import type { SiteContent } from "@/lib/content";

export default function Experience({
  experience,
}: {
  experience: SiteContent["experience"];
}) {
  return (
    <section id="experience" className="relative py-24 px-6 overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-0 w-64 h-64 rounded-full bg-violet/10 blur-[100px]" />
      <div className="relative mx-auto max-w-4xl">
        <Reveal variant="flipUp">
          <p className="font-mono-label text-xs uppercase text-teal mb-3">
            02 &mdash; Experience
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-12">
            Where I&apos;ve <span className="text-gradient">built</span>
          </h2>
        </Reveal>

        <div className="relative border-l hairline pl-8 space-y-10">
          {experience.map((job, i) => (
            <Reveal
              key={job.company + i}
              delay={i * 0.1}
              variant={i % 2 === 0 ? "flipLeft" : "flipRight"}
              className="relative"
            >
              {/* timeline dot */}
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.25, type: "spring", stiffness: 300 }}
                className="absolute -left-[calc(2rem+5px)] top-1.5 w-2.5 h-2.5 rounded-full bg-violet shadow-[0_0_0_4px_rgba(124,108,246,0.15)]"
              />
              <GlassCard className="p-6" tilt>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-lg font-semibold">
                    {job.role}
                  </h3>
                  <span className="font-mono-label text-[11px] text-text-faint uppercase">
                    {job.period}
                  </span>
                </div>
                <p className="text-sm text-violet-soft mt-1">
                  {job.company} &middot; {job.location}
                </p>
                <ul className="mt-4 space-y-2">
                  {job.points.map((point, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + idx * 0.06 + 0.3, duration: 0.4 }}
                      className="text-sm text-text-muted leading-relaxed flex gap-2"
                    >
                      <span className="text-teal mt-1.5 shrink-0">&#9670;</span>
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
