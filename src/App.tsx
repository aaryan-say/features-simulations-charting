import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { items } from "@/data/items";
import { VisualizationCard } from "@/components/VisualizationCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

function ScrollProgressBar() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      setPct(Math.min(1, Math.max(0, scrolled)) * 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-base-800">
      <motion.div className="h-full bg-signal-green" animate={{ width: `${pct}%` }} transition={{ duration: 0.1 }} />
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-base-950 text-base-100">
      <ScrollProgressBar />

      <header className="sticky top-0 z-40 border-b border-base-700/60 bg-base-950/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-signal-green/10 text-signal-green ring-1 ring-signal-green/30">
              <Activity size={14} strokeWidth={2.5} />
            </span>
            <span className="text-sm font-semibold tracking-wide text-base-50">Feature - simulations</span>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full border border-signal-green/30 bg-signal-green/10 px-3 py-1 text-[11px] font-medium text-signal-green sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-green" />
            {items.length} Patterns
          </span>
        </div>
      </header>

      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-radial-fade bg-grid-texture" />

        <section className="relative mx-auto max-w-[1100px] px-5 pb-24 pt-16 sm:pt-20">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Visualization Methods"
              title="Scroll through every pattern"
              description="Each card includes a live animated panel, pros/cons, and industry references."
              className="mb-8"
            />
          </ScrollReveal>

          <div className="flex flex-col gap-8">
            {items.map((item, i) => (
              <ScrollReveal key={item.id} delay={0.02}>
                <VisualizationCard item={item} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </section>

        <footer className="relative mx-auto max-w-[1100px] px-5 py-10 text-center text-xs text-base-500">
          Nubra Internal Research Build — mock data only, not a live trading platform.
        </footer>
      </div>
    </div>
  );
}
