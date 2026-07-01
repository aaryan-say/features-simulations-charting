import { motion } from "framer-motion";
import { useTicker, makeRng } from "@/lib/hooks";
import { useMemo } from "react";
import clsx from "clsx";

export interface HeatRow {
  label: string;
  cells: number[];
}

export function HeatGrid({
  rows,
  colLabels,
  colorScale = "green",
  highlightMax,
  live = true,
}: {
  rows: HeatRow[];
  colLabels?: string[];
  colorScale?: "green" | "dual";
  highlightMax?: boolean;
  live?: boolean;
}) {
  const tick = useTicker(1500);
  const jitteredRows = useMemo(() => {
    if (!live) return rows;
    const rng = makeRng(tick + 3);
    return rows.map((r) => ({
      ...r,
      cells: r.cells.map((c) => Math.max(0, c + (rng() - 0.5) * c * 0.3)),
    }));
  }, [rows, tick, live]);

  const max = Math.max(...jitteredRows.flatMap((r) => r.cells), 1);

  return (
    <div className="flex h-full flex-col text-[10px]">
      {colLabels && (
        <div className="mb-1 grid gap-1" style={{ gridTemplateColumns: `56px repeat(${colLabels.length}, 1fr)` }}>
          <span />
          {colLabels.map((l) => (
            <span key={l} className="text-center text-base-400">
              {l}
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1">
        {jitteredRows.map((r, ri) => (
          <div
            key={ri}
            className="grid flex-1 gap-1"
            style={{ gridTemplateColumns: `56px repeat(${r.cells.length}, 1fr)` }}
          >
            <span className="flex items-center text-base-300 mono-tabular">{r.label}</span>
            {r.cells.map((c, ci) => {
              const intensity = c / max;
              const isMax = highlightMax && c === Math.max(...r.cells);
              return (
                <motion.div
                  key={ci}
                  className={clsx(
                    "flex items-center justify-center rounded-sm mono-tabular",
                    isMax && "ring-1 ring-signal-amber",
                  )}
                  animate={{
                    backgroundColor:
                      colorScale === "dual"
                        ? ci % 2 === 0
                          ? `rgba(43,255,168,${0.08 + intensity * 0.55})`
                          : `rgba(255,77,94,${0.08 + intensity * 0.55})`
                        : `rgba(59,166,255,${0.08 + intensity * 0.6})`,
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {Math.round(c)}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
