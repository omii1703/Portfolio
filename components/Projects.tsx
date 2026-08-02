"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";
import GlassCard from "./GlassCard";
import { GithubIcon } from "./BrandIcons";
import type { SiteContent } from "@/lib/content";

const ACCENTS = ["#7c6cf6", "#45d9c8", "#f7b267"];

export default function Projects({
  projects,
}: {
  projects: SiteContent["projects"];
}) {
  return (
    <section id="projects" className="relative py-24 px-6 overflow-hidden">
      <div className="pointer-events-none absolute top-10 right-0 w-72 h-72 rounded-full bg-teal/10 blur-[110px]" />

      <div className="relative mx-auto max-w-5xl">
        <Reveal variant="flipUp">
          <p className="font-mono-label text-xs uppercase text-teal mb-3">
            03 &mdash; Projects
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-12">
            Things I&apos;ve <span className="text-gradient">shipped</span>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            const repoUrl =
              project.link && project.link !== "#" ? project.link : null;
            // Alternate: even = flipLeft, odd = flipRight
            const flipDir = i % 2 === 0 ? "flipLeft" : "flipRight";

            return (
              <Reveal key={project.title} delay={i * 0.08} variant={flipDir as "flipLeft" | "flipRight"}>
                <GlassCard className="p-6 h-full flex flex-col relative overflow-hidden">
                  {/* corner glow */}
                  <div
                    className="pointer-events-none absolute -top-16 -left-16 w-40 h-40 rounded-full blur-[70px] opacity-20"
                    style={{ background: accent }}
                  />

                  <div className="relative flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg font-semibold leading-snug">
                      {project.title}
                    </h3>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 + 0.3, type: "spring", stiffness: 280 }}
                      className="font-mono-label text-[10px] uppercase px-2 py-1 rounded-full shrink-0"
                      style={{
                        color: accent,
                        background: `color-mix(in srgb, ${accent} 15%, transparent)`,
                      }}
                    >
                      {project.date}
                    </motion.span>
                  </div>

                  <p className="relative text-sm text-text-muted mt-3 leading-relaxed">
                    {project.description}
                  </p>

                  <ul className="relative mt-4 space-y-1.5 flex-1">
                    {project.points.slice(0, 3).map((point, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 + idx * 0.07 + 0.35, duration: 0.4 }}
                        className="text-xs text-text-muted/90 leading-relaxed flex gap-2"
                      >
                        <span style={{ color: accent }} className="mt-1 shrink-0">
                          &#8226;
                        </span>
                        <span>{point}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <div className="relative mt-5 pt-4 border-t hairline flex flex-wrap gap-1.5">
                    {project.tools.split(",").map((tool, ti) => (
                      <motion.span
                        key={tool}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06 + ti * 0.04 + 0.4, duration: 0.35 }}
                        className="font-mono-label text-[10px] text-text-faint uppercase glass rounded-full px-2.5 py-1"
                      >
                        {tool.trim()}
                      </motion.span>
                    ))}
                  </div>

                  <motion.a
                    href={repoUrl ?? "https://github.com/omii1703"}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative mt-5 flex items-center justify-center gap-2 rounded-lg text-sm font-medium py-2.5 text-void transition"
                    style={{
                      background: `linear-gradient(135deg, ${accent}, #edeef5)`,
                    }}
                  >
                    <GithubIcon size={15} />
                    {repoUrl ? "View on GitHub" : "View GitHub profile"}
                  </motion.a>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
