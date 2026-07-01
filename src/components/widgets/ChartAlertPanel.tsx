import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { CandleChart } from "./CandleChart";
import { generateCandles } from "@/lib/marketData";
import { useTicker } from "@/lib/hooks";

interface ChartAlert {
  id: string;
  price: number;
  y: number;
  status: "armed" | "triggered";
}

const WIDTH = 560;
const HEIGHT = 220;

export function ChartAlertPanel({ seed = 61 }: { seed?: number }) {
  const candles = useRef(generateCandles(16, 22470, 16, seed)).current;
  const [alerts, setAlerts] = useState<ChartAlert[]>([
    { id: "seed-1", price: Math.round(candles[0].high + 60), y: 0, status: "armed" },
  ]);
  const [hint, setHint] = useState(true);
  const tick = useTicker(2000);

  const min = Math.min(...candles.map((c) => c.low));
  const max = Math.max(...candles.map((c) => c.high));
  const pad = (max - min) * 0.12 || 1;
  const lo = min - pad;
  const hi = max + pad;
  const priceAt = (y: number) => hi - (y / HEIGHT) * (hi - lo);
  const yAt = (price: number) => ((hi - price) / (hi - lo)) * HEIGHT;

  // Simulate the last candle's close drifting toward armed alerts, "triggering" one occasionally.
  const liveClose = candles[candles.length - 1].close + Math.sin(tick / 2) * 14;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * HEIGHT;
    const price = Math.round(priceAt(y));
    setAlerts((prev) => [...prev, { id: `a-${Date.now()}-${prev.length}`, price, y, status: "armed" }]);
    setHint(false);
  };

  const removeAlert = (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="flex h-full flex-col gap-2">
      <div
        className="relative flex-1 cursor-crosshair overflow-hidden rounded-lg border border-base-700/50"
        onClick={handleClick}
      >
        <CandleChart candles={candles} width={WIDTH} height={HEIGHT} className="h-full w-full" />

        {alerts.map((a) => {
          const y = yAt(a.price);
          const triggered = Math.abs(liveClose - a.price) < 6;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pointer-events-none absolute inset-x-0"
              style={{ top: `${(y / HEIGHT) * 100}%` }}
            >
              <div
                className={`h-px w-full ${triggered ? "bg-signal-red" : "bg-signal-amber/70"}`}
                style={{ borderTop: triggered ? undefined : "1px dashed rgba(255,178,59,0.7)" }}
              />
              <div
                className={`pointer-events-auto absolute right-1 -translate-y-1/2 flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold mono-tabular ${
                  triggered
                    ? "border-signal-red/50 bg-signal-red/15 text-signal-red"
                    : "border-signal-amber/50 bg-signal-amber/15 text-signal-amber"
                }`}
              >
                <Bell size={9} />
                {a.price.toLocaleString("en-IN")}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAlert(a.id);
                  }}
                  className="ml-0.5 opacity-70 hover:opacity-100"
                >
                  <X size={9} />
                </button>
              </div>
            </motion.div>
          );
        })}

        <AnimatePresence>
          {hint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center bg-base-950/30"
            >
              <span className="rounded-full border border-base-600 bg-base-900/90 px-3 py-1.5 text-[11px] font-medium text-base-200">
                Click anywhere on the chart to set a price alert
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between text-[10px] text-base-500">
        <span>{alerts.length} alert{alerts.length === 1 ? "" : "s"} armed on this chart</span>
        <span className="mono-tabular text-base-400">LTP {liveClose.toFixed(2)}</span>
      </div>
    </div>
  );
}
