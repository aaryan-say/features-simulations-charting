import { motion } from "framer-motion";

export function DeltaHistogram({
  values,
  width = 560,
  height = 56,
  highlightDivergence = [],
}: {
  values: number[];
  width?: number;
  height?: number;
  highlightDivergence?: number[];
}) {
  const n = values.length;
  const slot = width / n;
  const barW = Math.max(3, slot * 0.55);
  const max = Math.max(...values.map((v) => Math.abs(v)), 1);
  const mid = height / 2;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="mt-1">
      <line x1={0} x2={width} y1={mid} y2={mid} stroke="#262b34" strokeWidth={1} />
      {values.map((v, i) => {
        const h = (Math.abs(v) / max) * (height / 2 - 4);
        const isDiv = highlightDivergence.includes(i);
        const color = v >= 0 ? "#2bffa8" : "#ff4d5e";
        return (
          <g key={i}>
            <motion.rect
              x={i * slot + slot / 2 - barW / 2}
              width={barW}
              y={v >= 0 ? mid - h : mid}
              height={h}
              fill={isDiv ? "#ffb23b" : color}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
            {isDiv && (
              <text x={i * slot + slot / 2} y={height - 2} fontSize={7} textAnchor="middle" fill="#ffb23b">
                ⚠
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
