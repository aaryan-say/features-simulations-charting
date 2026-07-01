import type { ReactNode } from "react";
import clsx from "clsx";

type BadgeTone = "green" | "blue" | "amber" | "red" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  green: "bg-signal-green/10 text-signal-green border-signal-green/30",
  blue: "bg-signal-blue/10 text-signal-blue border-signal-blue/30",
  amber: "bg-signal-amber/10 text-signal-amber border-signal-amber/30",
  red: "bg-signal-red/10 text-signal-red border-signal-red/30",
  neutral: "bg-base-700/60 text-base-200 border-base-500/50",
};

export function Badge({
  children,
  tone = "neutral",
  className,
  icon,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide",
        toneClasses[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function buzzTone(buzz: string): BadgeTone {
  if (buzz === "Very High") return "red";
  if (buzz === "High") return "amber";
  return "blue";
}

export function complexityTone(level: string): BadgeTone {
  if (level === "High") return "red";
  if (level === "Medium") return "amber";
  return "green";
}

export function marketingTone(level: string): BadgeTone {
  if (level === "Very High") return "green";
  if (level === "High") return "blue";
  return "neutral";
}
