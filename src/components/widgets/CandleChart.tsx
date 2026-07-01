import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Candle } from "@/lib/marketData";

export interface CandleChartProps {
  candles: Candle[];
  width?: number;
  height?: number;
  lines?: { values: number[]; color: string; dashed?: boolean }[];
  bands?: { upper: number[]; lower: number[]; color: string }[];
  markers?: { index: number; type: "buy" | "sell"; label?: string }[];
  bubbles?: { index: number; price: number; size: number; side: "buy" | "sell" }[];
  orderLines?: { price: number; color: string; label: string; dashed?: boolean }[];
  className?: string;
}

export function CandleChart({
  candles,
  width = 560,
  height = 180,
  lines = [],
  bands = [],
  markers = [],
  bubbles = [],
  orderLines = [],
  className,
}: CandleChartProps) {
  const { min, max } = useMemo(() => {
    let lo = Infinity;
    let hi = -Infinity;
    candles.forEach((c) => {
      lo = Math.min(lo, c.low);
      hi = Math.max(hi, c.high);
    });
    bands.forEach((b) => {
      b.upper.forEach((v) => (hi = Math.max(hi, v)));
      b.lower.forEach((v) => (lo = Math.min(lo, v)));
    });
    orderLines.forEach((o) => {
      lo = Math.min(lo, o.price);
      hi = Math.max(hi, o.price);
    });
    const pad = (hi - lo) * 0.12 || 1;
    return { min: lo - pad, max: hi + pad };
  }, [candles, bands, orderLines]);

  const n = candles.length;
  const slot = width / n;
  const candleW = Math.max(3, slot * 0.55);
  const y = (v: number) => height - ((v - min) / (max - min)) * height;
  const x = (i: number) => i * slot + slot / 2;

  const linePath = (values: number[]) =>
    values.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");

  const bandPath = (upper: number[], lower: number[]) => {
    const top = upper.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
    const bottom = lower
      .map((v, i) => `L ${x(lower.length - 1 - i)} ${y(lower[lower.length - 1 - i])}`)
      .join(" ");
    return `${top} ${bottom} Z`;
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} preserveAspectRatio="none">
      {bands.map((b, bi) => (
        <path key={bi} d={bandPath(b.upper, b.lower)} fill={b.color} opacity={0.12} />
      ))}
      {bands.map((b, bi) => (
        <g key={`band-lines-${bi}`}>
          <path d={linePath(b.upper)} stroke={b.color} strokeWidth={1} fill="none" opacity={0.5} strokeDasharray="4 3" />
          <path d={linePath(b.lower)} stroke={b.color} strokeWidth={1} fill="none" opacity={0.5} strokeDasharray="4 3" />
        </g>
      ))}
      {orderLines.map((o, i) => (
        <g key={i}>
          <line
            x1={0}
            x2={width}
            y1={y(o.price)}
            y2={y(o.price)}
            stroke={o.color}
            strokeWidth={1.2}
            strokeDasharray={o.dashed ? "5 4" : undefined}
            opacity={0.75}
          />
          <text x={width - 4} y={y(o.price) - 4} fontSize={9} textAnchor="end" fill={o.color}>
            {o.label}
          </text>
        </g>
      ))}
      {candles.map((c, i) => {
        const up = c.close >= c.open;
        const color = up ? "#2bffa8" : "#ff4d5e";
        return (
          <g key={i}>
            <line x1={x(i)} x2={x(i)} y1={y(c.high)} y2={y(c.low)} stroke={color} strokeWidth={1} opacity={0.9} />
            <motion.rect
              x={x(i) - candleW / 2}
              width={candleW}
              y={y(Math.max(c.open, c.close))}
              height={Math.max(1.5, Math.abs(y(c.open) - y(c.close)))}
              fill={color}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
          </g>
        );
      })}
      {lines.map((l, li) => (
        <path
          key={li}
          d={linePath(l.values)}
          stroke={l.color}
          strokeWidth={1.4}
          fill="none"
          strokeDasharray={l.dashed ? "4 3" : undefined}
        />
      ))}
      {markers.map((m, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, y: m.type === "buy" ? 6 : -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
        >
          <text
            x={x(m.index)}
            y={m.type === "buy" ? height - 4 : 12}
            fontSize={11}
            textAnchor="middle"
            fill={m.type === "buy" ? "#2bffa8" : "#ff4d5e"}
          >
            {m.type === "buy" ? "▲" : "▼"}
          </text>
        </motion.g>
      ))}
      {bubbles.map((b, i) => (
        <motion.circle
          key={i}
          cx={x(b.index)}
          cy={y(b.price)}
          r={b.size}
          fill={b.side === "buy" ? "#2bffa8" : "#ff4d5e"}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.55, scale: 1 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        />
      ))}
    </svg>
  );
}
