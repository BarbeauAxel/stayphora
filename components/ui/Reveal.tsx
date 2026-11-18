"use client";

import * as m from "motion/react-m";
import type { Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "article";
}

/** Apparition au scroll : fondu + translation de 20 px vers le haut. */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const Component = m[as];
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={item}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}

/** Conteneur qui décale l'apparition de ses `RevealItem` (stagger). */
export function RevealGroup({
  children,
  className,
  as = "div",
  stagger = 0.1,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
  stagger?: number;
}) {
  const Component = m[as];
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Component = m[as];
  return (
    <Component className={className} variants={item}>
      {children}
    </Component>
  );
}
