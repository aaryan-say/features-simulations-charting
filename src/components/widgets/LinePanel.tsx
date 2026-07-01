import { useMemo } from "react";
import { motion } from "framer-motion";

export interface LineSeries {
  values: number[];
  color: string;
  area?: boolean;
  label?: string;
}

export function LinePanel({
  rows,
  width = 560,
  rowHeight = 90,
  gap = 10,
  divergenceZones = [],
  annotations = [],
}: {
  rows: LineSeries[][];
  width?: number;
  rowHeight?: number;
  gap?: number;
  divergenceZones?: { from: number; to: number }[];
  annotations?: { row: number; index: number; label: string; color: string }[];
}) {
  const height = rows.length * rowHeight + (rows.length - 1) * gap;

  const scales = useMemo(
    () =>
      rows.map((seriesGroup) => {
        const all = seriesGroup.flatMap((s) => s.values);
        const lo = Math.min(...all);
        const hi = Math.max(...all);
        const pad = (hi - lo) * 0.15 || 1;
        return { min: lo - pad, max: hi + pad };
      }),
    [rows],
  );

  const n = Math.max(...rows.flatMap((g) => g.map((s) => s.values.length)));
  const x = (i: number) => (i / (n - 1)) * width;

  let offsetY = 0;
  const rowBlocks = rows.map((seriesGroup, ri) => {
    const { min, max } = scales[ri];
    const y = (v: number) => rowHeight - ((v - min) / (max - min)) * rowHeight;
    const top = offsetY;
    offsetY += rowHeight + gap;
    return { seriesGroup, y, top, ri };
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-full w-full">
      {divergenceZones.map((z, i) => (
        <rect
          key={i}
          x={x(z.from)}
          width={x(z.to) - x(z.from)}
          y={0}
          height={height}
          fill="#ffb23b"
          opacity={0.08}
        />
      ))}
      {rowBlocks.map(({ seriesGroup, y, top, ri }) => (
        <g key={ri} transform={`translate(0, ${top})`}>
          <line x1={0} x2={width} y1={rowHeight} y2={rowHeight} stroke="#1a1e25" strokeWidth={1} />
          {seriesGroup.map((s, si) => {
            const path = s.values.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
            const areaPath = s.area
              ? `${path} L ${x(s.values.length - 1)} ${rowHeight} L ${x(0)} ${rowHeight} Z`
              : null;
            return (
              <g key={si}>
                {areaPath && <path d={areaPath} fill={s.color} opacity={0.12} />}
                <motion.path
                  d={path}
                  stroke={s.color}
                  strokeWidth={1.6}
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0.5 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </g>
            );
          })}
          {annotations
            .filter((a) => a.row === ri)
            .map((a, ai) => (
              <g key={ai}>
                <circle cx={x(a.index)} cy={y(seriesGroup[0].values[a.index])} r={3.5} fill={a.color} />
                <text
                  x={x(a.index)}
                  y={y(seriesGroup[0].values[a.index]) - 8}
                  fontSize={9}
                  textAnchor="middle"
                  fill={a.color}
                >
                  {a.label}
                </text>
              </g>
            ))}
        </g>
      ))}
    </svg>
  );
}
