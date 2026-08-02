"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Network,
  Bot,
  Database,
  Wrench,
  Cloud,
  type LucideIcon,
} from "lucide-react";
import Reveal from "./Reveal";
import GlassCard from "./GlassCard";
import type { SiteContent } from "@/lib/content";

const CATEGORY_META: Record<
  string,
  { icon: LucideIcon; from: string; to: string; glow: string }
> = {
  Programming: { icon: Code2, from: "#7c6cf6", to: "#a79bff", glow: "rgba(124,108,246,0.25)" },
  "RAG & Vector Systems": { icon: Network, from: "#45d9c8", to: "#7c6cf6", glow: "rgba(69,217,200,0.25)" },
  "Agentic AI & LLMs": { icon: Bot, from: "#f7b267", to: "#f5946e", glow: "rgba(247,178,103,0.25)" },
  "Backend & Data": { icon: Database, from: "#45d9c8", to: "#3fb6c9", glow: "rgba(69,217,200,0.2)" },
  "Engineering Practices": { icon: Wrench, from: "#a79bff", to: "#7c6cf6", glow: "rgba(167,155,255,0.22)" },
  "Cloud & Deployment": { icon: Cloud, from: "#f7b267", to: "#a79bff", glow: "rgba(247,178,103,0.2)" },
};

const FALLBACK_META = { icon: Code2, from: "#7c6cf6", to: "#45d9c8", glow: "rgba(124,108,246,0.2)" };

// 3D tilt + zoom variant cycles for each category card
const CARD_VARIANTS = ["zoomIn", "flipUp", "flipLeft", "zoomIn", "flipRight", "flipUp"] as const;

export default function Skills({ skills }: { skills: SiteContent["skills"] }) {
  return (
    <section id="skills" className="relative py-24 px-6 overflow-hidden">
      <div className="pointer-events-none absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-violet/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 -right-20 w-72 h-72 rounded-full bg-amber/10 blur-[100px]" />

      <div className="relative mx-auto max-w-5xl">
        <Reveal variant="flipUp">
          <p className="font-mono-label text-xs uppercase text-teal mb-3">
            04 &mdash; Skills
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-12">
            The <span className="text-gradient">stack</span>
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.groups.map((group, gi) => {
            const meta = CATEGORY_META[group.category] || FALLBACK_META;
            const Icon = meta.icon;
            const cardVariant = CARD_VARIANTS[gi % CARD_VARIANTS.length];

            return (
              <Reveal key={group.category} delay={gi * 0.07} variant={cardVariant}>
                <GlassCard className="p-5 h-full relative overflow-hidden group">
                  {/* hover-brightened glow */}
                  <div
                    className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-70 transition-opacity group-hover:opacity-100"
                    style={{ background: meta.glow }}
                  />

                  {/* icon + category header */}
                  <div className="relative flex items-center gap-2.5 mb-4">
                    <motion.span
                      initial={{ scale: 0, rotate: -20 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: gi * 0.07 + 0.2, type: "spring", stiffness: 280, damping: 15 }}
                      className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${meta.from}, ${meta.to})`,
                      }}
                    >
                      <Icon size={15} className="text-void" strokeWidth={2.4} />
                    </motion.span>
                    <h3 className="font-mono-label text-[11px] uppercase text-text-primary/90">
                      {group.category}
                    </h3>
                  </div>

                  {/* skill chips */}
                  <div className="relative flex flex-wrap gap-1.5">
                    {group.items.map((item, ii) => (
                      <motion.span
                        key={item}
                        initial={{ opacity: 0, scale: 0.75, y: 8 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.35,
                          delay: gi * 0.07 + ii * 0.04 + 0.25,
                          type: "spring",
                          stiffness: 200,
                        }}
                        whileHover={{ y: -3, scale: 1.06 }}
                        className="rounded-md px-2.5 py-1 text-[11px] text-text-muted bg-white/[0.04] border border-white/[0.06] hover:text-text-primary transition-colors cursor-default"
                        style={{
                          borderColor: `color-mix(in srgb, ${meta.from} 25%, transparent)`,
                        }}
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
