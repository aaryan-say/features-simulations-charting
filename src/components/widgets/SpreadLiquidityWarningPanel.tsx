import { motion } from "framer-motion";
import { useTicker, makeRng } from "@/lib/hooks";
import clsx from "clsx";

export function SpreadLiquidityWarningPanel() {
  const tick = useTicker(1200);
  const rng = makeRng(191 + tick * 7);
  const cycle = tick % 8;
  const spreadPaise = 5 + cycle * 4 + Math.round(rng() * 3);
  const wide = spreadPaise >= 25;
  const liquidityScore = Math.max(4, Math.min(98, 96 - cycle * 11 + Math.round((rng() - 0.5) * 6)));
  const barWidth = Math.min(100, 8 + spreadPaise * 2.6);

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wide text-base-400">
          <span>Bid / Ask Spread</span>
          <span className="mono-tabular text-base-300">{spreadPaise}p</span>
        </div>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-base-800/60">
          <motion.div
            className={clsx("absolute inset-y-0 left-1/2 -translate-x-1/2 rounded-full", wide ? "bg-signal-red/60" : "bg-signal-blue/60")}
            animate={{ width: `${barWidth}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] mono-tabular text-base-400">
          <span>Bid 22,498.80</span>
          <span>Ask 22,499.{(30 + spreadPaise).toString().padStart(2, "0")}</span>
        </div>
      </div>

      <div className="rounded-lg border border-base-700/60 bg-base-800/40 px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wide text-base-400">Liquidity Score</span>
          <span
            className={clsx(
              "mono-tabular text-sm font-bold",
              liquidityScore < 35 ? "text-signal-red" : liquidityScore < 65 ? "text-signal-amber" : "text-signal-green",
            )}
          >
            {liquidityScore}
          </span>
        </div>
      </div>

      {wide ? (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-signal-red/40 bg-signal-red/10 px-3 py-2 text-center text-[11px] font-semibold text-signal-red"
        >
          Wide spread — execution risk
        </motion.div>
      ) : (
        <div className="rounded-lg border border-base-700/50 bg-base-800/30 px-3 py-2 text-center text-[11px] text-base-400">
          Spread within normal range
        </div>
      )}
    </div>
  );
}
