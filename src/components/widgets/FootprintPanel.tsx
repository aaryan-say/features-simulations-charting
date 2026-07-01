import { useMemo } from "react";
import { motion } from "framer-motion";
import { makeRng } from "@/lib/hooks";
import { useTicker } from "@/lib/hooks";

interface FootprintCandle {
  priceTop: number;
  tick: number;
  rows: number;
  delta: number;
  up: boolean;
}

export function FootprintPanel({
  columns = 5,
  rows = 7,
  seed = 7,
}: {
  columns?: number;
  rows?: number;
  seed?: number;
}) {
  const tick = useTicker(1400);
  const candles: FootprintCandle[] = useMemo(() => {
    const rng = makeRng(seed);
    let base = 22480;
    return Array.from({ length: columns }, () => {
      const up = rng() > 0.45;
      base += up ? rng() * 6 : -rng() * 6;
      return { priceTop: Math.round(base), tick: 5, rows, delta: 0, up };
    });
  }, [columns, rows, seed]);

  const cellData = useMemo(() => {
    const rng = makeRng(seed * 13 + tick);
    return candles.map((c) => {
      let delta = 0;
      const cellRows = Array.from({ length: c.rows }, () => {
        const bid = Math.round(rng() * 340);
        const ask = Math.round(rng() * 340);
        delta += ask - bid;
        const imbalance = ask > bid * 1.8 ? "ask" : bid > ask * 1.8 ? "bid" : null;
        return { bid, ask, imbalance };
      });
      return { ...c, cellRows, delta };
    });
  }, [candles, seed, tick]);

  return (
    <div className="flex h-full gap-1.5">
      {cellData.map((c, ci) => (
        <div key={ci} className="flex flex-1 flex-col overflow-hidden rounded-md border border-base-700/60 bg-base-800/40">
          <div className="grid flex-1 grid-rows-7 divide-y divide-base-700/40">
            {c.cellRows.map((r, ri) => (
              <div key={ri} className="grid grid-cols-2 items-center text-[9px] leading-none">
                <motion.span
                  key={`b-${tick}-${ri}`}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  className={`px-1 text-right mono-tabular ${r.imbalance === "bid" ? "bg-signal-red/25 text-signal-red font-semibold" : "text-base-300"}`}
                >
                  {r.bid}
                </motion.span>
                <motion.span
                  key={`a-${tick}-${ri}`}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  className={`px-1 mono-tabular ${r.imbalance === "ask" ? "bg-signal-green/25 text-signal-green font-semibold" : "text-base-300"}`}
                >
                  {r.ask}
                </motion.span>
              </div>
            ))}
          </div>
          <div
            className={`px-1.5 py-1 text-center text-[10px] font-semibold mono-tabular ${
              c.delta >= 0 ? "bg-signal-green/10 text-signal-green" : "bg-signal-red/10 text-signal-red"
            }`}
          >
            Δ {c.delta >= 0 ? "+" : ""}
            {c.delta}
          </div>
        </div>
      ))}
    </div>
  );
}
