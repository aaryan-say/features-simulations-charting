import { useState } from "react";
import { motion } from "framer-motion";
import { useTicker, makeRng } from "@/lib/hooks";
import clsx from "clsx";

interface PendingOrder {
  id: string;
  label: string;
}

export function ExitAllCancelAllPanel() {
  const tick = useTicker(1400);
  const [pending, setPending] = useState<PendingOrder[]>([
    { id: "p1", label: "NIFTY 22550 CE — BUY 50 @ MKT" },
    { id: "p2", label: "BANKNIFTY 48300 PE — SELL 25 @ LIMIT" },
    { id: "p3", label: "NIFTY 22500 CE — BUY 75 @ SL" },
  ]);
  const [exited, setExited] = useState(false);

  const rng = makeRng(77 + tick * 3);
  const positions = [
    { label: "NIFTY 22500 CE", qty: 50, pnl: 4280 + Math.round((rng() - 0.5) * 600) },
    { label: "BANKNIFTY 48200 PE", qty: 25, pnl: -1120 + Math.round((rng() - 0.5) * 400) },
  ];

  return (
    <div className="flex h-full flex-col gap-2.5">
      <div>
        <div className="mb-1.5 text-[10px] uppercase tracking-wide text-base-400">Open Positions</div>
        <div className="space-y-1">
          {positions.map((p) => (
            <div
              key={p.label}
              className="flex items-center justify-between rounded-md border border-base-700/60 bg-base-800/40 px-2.5 py-1.5"
            >
              <span className="text-[11px] text-base-200">
                {p.label} <span className="text-base-400">×{p.qty}</span>
              </span>
              <span
                className={clsx(
                  "mono-tabular text-[11px] font-semibold",
                  p.pnl >= 0 ? "text-signal-green" : "text-signal-red",
                )}
              >
                {p.pnl >= 0 ? "+" : ""}
                {"₹"}
                {p.pnl.toLocaleString("en-IN")}
              </span>
            </div>
          ))}
          {exited && (
            <div className="rounded-md border border-base-700/40 bg-base-800/20 px-2.5 py-1.5 text-center text-[10px] text-base-500">
              All positions flattened
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wide text-base-400">Pending Orders</span>
          <span className="text-[10px] text-base-500">{pending.length} open</span>
        </div>
        <div className="space-y-1">
          {pending.length === 0 ? (
            <div className="rounded-md border border-base-700/40 bg-base-800/20 px-2.5 py-1.5 text-center text-[10px] text-base-500">
              No pending orders
            </div>
          ) : (
            pending.map((o) => (
              <div key={o.id} className="rounded-md border border-base-700/60 bg-base-800/40 px-2.5 py-1.5 text-[10.5px] text-base-300">
                {o.label}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-auto flex gap-2 pt-1">
        <motion.button
          onClick={() => setExited(true)}
          animate={{ boxShadow: ["0 0 0px rgba(255,77,94,0)", "0 0 14px rgba(255,77,94,0.45)", "0 0 0px rgba(255,77,94,0)"] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex-1 rounded-lg bg-signal-red/15 py-2 text-xs font-bold text-signal-red ring-1 ring-signal-red/50 transition-transform active:scale-95"
        >
          EXIT ALL
        </motion.button>
        <button
          onClick={() => setPending([])}
          className="flex-1 rounded-lg border border-base-600 py-2 text-xs font-bold text-base-300 transition-transform active:scale-95"
        >
          CANCEL ALL
        </button>
      </div>
    </div>
  );
}
