"use client";

import { motion } from "framer-motion";
import { Award, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import GlassCard from "./GlassCard";

const ACCENTS = [
  { from: "#7c6cf6", to: "#a79bff" },
  { from: "#45d9c8", to: "#3fb6c9" },
  { from: "#f7b267", to: "#f5946e" },
];

export default function Achievements({
  achievements,
}: {
  achievements: string[];
}) {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-64 rounded-full bg-violet/10 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl">
        <Reveal variant="flipUp">
          <p className="font-mono-label text-xs uppercase text-teal mb-3">
            05 &mdash; Achievements
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-12">
            Certifications &amp; <span className="text-gradient">recognition</span>
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-5">
          {achievements.map((item, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <Reveal key={i} delay={i * 0.1} variant="zoomIn">
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <GlassCard className="p-6 h-full relative overflow-hidden" tilt={false}>
                    {/* corner glow */}
                    <div
                      className="pointer-events-none absolute -top-8 -right-8 w-28 h-28 rounded-full blur-[50px] opacity-60"
                      style={{ background: accent.from }}
                    />

                    {/* award icon — springs in */}
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: i * 0.1 + 0.2,
                        type: "spring",
                        stiffness: 260,
                        damping: 14,
                      }}
                      className="relative flex items-center justify-center w-11 h-11 rounded-xl mb-4"
                      style={{
                        background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
                      }}
                    >
                      <Award size={20} className="text-void" strokeWidth={2.2} />
                    </motion.div>

                    <p className="relative text-sm text-text-primary/90 leading-relaxed font-medium">
                      {item}
                    </p>

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.4, duration: 0.4 }}
                      className="relative flex items-center gap-1.5 mt-4 text-[10px] font-mono-label uppercase text-text-faint"
                    >
                      <Sparkles size={11} style={{ color: accent.from }} />
                      Verified
                    </motion.div>
                  </GlassCard>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
