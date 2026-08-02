"use client";

import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type TargetAndTransition,
  type Transition,
} from "framer-motion";
import { ReactNode, useRef } from "react";

// ─── Easing presets ───────────────────────────────────────────────────────────
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as [number, number, number, number];
const EASE_OUT_BACK = [0.34, 1.56, 0.64, 1] as [number, number, number, number];

// ─── Animation variant map ────────────────────────────────────────────────────
export type RevealVariant =
  | "fadeUp"
  | "flipUp"
  | "flipLeft"
  | "flipRight"
  | "zoomIn"
  | "slideLeft"
  | "slideRight"
  | "spinIn";

interface AnimDef {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  transition?: Transition;
}

const variants: Record<RevealVariant, AnimDef> = {
  fadeUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
  },
  flipUp: {
    initial: { opacity: 0, y: 60, rotateX: 30 },
    animate: { opacity: 1, y: 0, rotateX: 0 },
  },
  flipLeft: {
    initial: { opacity: 0, x: -40, rotateY: -25 },
    animate: { opacity: 1, x: 0, rotateY: 0 },
  },
  flipRight: {
    initial: { opacity: 0, x: 40, rotateY: 25 },
    animate: { opacity: 1, x: 0, rotateY: 0 },
  },
  zoomIn: {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
  },
  spinIn: {
    initial: { opacity: 0, scale: 0.7, rotate: -10 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

// ─── Reveal ───────────────────────────────────────────────────────────────────
export default function Reveal({
  children,
  delay = 0,
  duration = 0.7,
  variant = "fadeUp",
  className = "",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  variant?: RevealVariant;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-80px" });
  const v = variants[variant];

  const defaultTransition: Transition = {
    duration,
    delay,
    ease:
      variant === "zoomIn" || variant === "spinIn"
        ? EASE_OUT_BACK
        : EASE_OUT_EXPO,
  };

  // For rotateX / rotateY to work we need perspective on the wrapper
  const needsPerspective =
    variant === "flipUp" || variant === "flipLeft" || variant === "flipRight";

  return (
    <motion.div
      ref={ref}
      initial={v.initial}
      animate={inView ? v.animate : v.initial}
      transition={v.transition ?? defaultTransition}
      className={className}
      style={
        needsPerspective
          ? { willChange: "transform, opacity", perspective: 900 }
          : { willChange: "transform, opacity" }
      }
    >
      {children}
    </motion.div>
  );
}

// ─── StaggerReveal — animates children one by one ─────────────────────────────
export function StaggerReveal({
  children,
  className = "",
  staggerDelay = 0.1,
  variant = "flipUp",
  containerDelay = 0,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  variant?: RevealVariant;
  containerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const v = variants[variant];

  const itemTransition: Transition = v.transition ?? {
    duration: 0.65,
    ease: EASE_OUT_EXPO,
  };

  const container = {
    hidden: {},
    show: {
      transition: {
        delayChildren: containerDelay,
        staggerChildren: staggerDelay,
      },
    },
  };

  const item = {
    hidden: v.initial,
    show: {
      ...v.animate,
      transition: itemTransition,
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={className}
    >
      {Array.isArray(children)
        ? (children as ReactNode[]).map((child, i) => (
            <motion.div
              key={i}
              variants={item}
              style={{ willChange: "transform, opacity" }}
            >
              {child}
            </motion.div>
          ))
        : <motion.div variants={item}>{children}</motion.div>}
    </motion.div>
  );
}

// ─── ParallaxReveal — parallax + fade on scroll ───────────────────────────────
export function ParallaxReveal({
  children,
  className = "",
  speed = 0.25,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${speed * 80}px`, `-${speed * 80}px`]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  return (
    <motion.div ref={ref} style={{ y, opacity }} className={className}>
      {children}
    </motion.div>
  );
}
