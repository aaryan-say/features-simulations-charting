import { motion } from "framer-motion";
import { useTicker, makeRng } from "@/lib/hooks";
import { useMemo } from "react";

export function GaugeMeter({
  label = "Bid Pressure",
  seed = 3,
  base = 55,
  swing = 20,
}: {
  label?: string;
  seed?: number;
  base?: number;
  swing?: number;
}) {
  const tick = useTicker(1600);
  const value = useMemo(() => {
    const rng = makeRng(seed + tick * 9);
    return Math.min(92, Math.max(8, Math.round(base + (rng() - 0.5) * swing)));
  }, [tick, seed, base, swing]);

  const extreme = value > 72 || value < 28;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="relative h-28 w-56">
        <svg viewBox="0 0 200 110" className="h-full w-full">
          <path d="M 10 100 A 90 90 0 0 1 190 100" stroke="#1a1e25" strokeWidth={14} fill="none" strokeLinecap="round" />
          <motion.path
            d="M 10 100 A 90 90 0 0 1 190 100"
            stroke={extreme ? "#ffb23b" : "#3ba6ff"}
            strokeWidth={14}
            fill="none"
            strokeLinecap="round"
            strokeDasharray="283"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (value / 100) * 283 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-2xl font-bold mono-tabular text-base-50">{value}%</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs font-semibold text-base-200">{label}</div>
        {extreme && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1 text-[10px] font-medium text-signal-amber"
          >
            Extreme imbalance detected
          </motion.div>
        )}
      </div>
    </div>
  );
}
