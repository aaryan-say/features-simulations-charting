import { motion } from "framer-motion";
import { useTicker, makeRng } from "@/lib/hooks";
import { useMemo } from "react";

const QUADRANTS = [
  { key: "long-buildup", label: "Long Buildup", tone: "green", desc: "Price ↑ / OI ↑" },
  { key: "short-buildup", label: "Short Buildup", tone: "red", desc: "Price ↓ / OI ↑" },
  { key: "long-unwinding", label: "Long Unwinding", tone: "amber", desc: "Price ↓ / OI ↓" },
  { key: "short-covering", label: "Short Covering", tone: "blue", desc: "Price ↑ / OI ↓" },
] as const;

const toneMap: Record<string, string> = {
  green: "border-signal-green/30 bg-signal-green/5 text-signal-green",
  red: "border-signal-red/30 bg-signal-red/5 text-signal-red",
  amber: "border-signal-amber/30 bg-signal-amber/5 text-signal-amber",
  blue: "border-signal-blue/30 bg-signal-blue/5 text-signal-blue",
};

const SYMBOLS = ["NIFTY", "BANKNIFTY", "RELIANCE", "HDFCBANK", "INFY"];

export function QuadrantMatrix() {
  const tick = useTicker(2200);
  const placements = useMemo(() => {
    const rng = makeRng(tick + 17);
    return SYMBOLS.map((s) => ({ symbol: s, quadrant: Math.floor(rng() * 4) }));
  }, [tick]);

  return (
    <div className="grid h-full grid-cols-2 grid-rows-2 gap-2">
      {QUADRANTS.map((q, qi) => (
        <div key={q.key} className={`relative rounded-lg border p-2 ${toneMap[q.tone]}`}>
          <div className="text-[10px] font-semibold">{q.label}</div>
          <div className="text-[9px] opacity-70">{q.desc}</div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {placements
              .filter((p) => p.quadrant === qi)
              .map((p) => (
                <motion.span
                  key={p.symbol}
                  layout
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-full bg-base-900/70 px-1.5 py-0.5 text-[9px] font-medium"
                >
                  {p.symbol}
                </motion.span>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
