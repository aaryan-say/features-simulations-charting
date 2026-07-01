import { makeRng } from "./hooks";

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function generateCandles(
  count: number,
  startPrice = 22450,
  volatility = 18,
  seed = 42,
): Candle[] {
  const rng = makeRng(seed);
  const candles: Candle[] = [];
  let price = startPrice;
  for (let i = 0; i < count; i++) {
    const open = price;
    const drift = (rng() - 0.5) * volatility;
    const close = open + drift;
    const high = Math.max(open, close) + rng() * volatility * 0.6;
    const low = Math.min(open, close) - rng() * volatility * 0.6;
    const volume = Math.round(400 + rng() * 1600);
    candles.push({ time: i, open, high, low, close, volume });
    price = close;
  }
  return candles;
}

export function ema(values: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const out: number[] = [];
  values.forEach((v, i) => {
    out.push(i === 0 ? v : v * k + out[i - 1] * (1 - k));
  });
  return out;
}

export function formatPrice(v: number): string {
  return v.toFixed(2);
}

export function formatCompact(v: number): string {
  if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return `${Math.round(v)}`;
}
