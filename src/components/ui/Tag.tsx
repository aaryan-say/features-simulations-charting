import type { ReactNode } from "react";
import clsx from "clsx";

type TagKind = "pattern" | "mvp" | "advanced" | "marketing";

const kindClasses: Record<TagKind, string> = {
  pattern: "bg-signal-blue/10 text-signal-blue border-signal-blue/30",
  mvp: "bg-signal-green/10 text-signal-green border-signal-green/30",
  advanced: "bg-signal-amber/10 text-signal-amber border-signal-amber/30",
  marketing: "bg-signal-red/10 text-signal-red border-signal-red/30",
};

const kindLabel: Record<TagKind, string> = {
  pattern: "Industry Pattern",
  mvp: "MVP",
  advanced: "Advanced",
  marketing: "Marketing Angle",
};

export function Tag({ kind, children }: { kind: TagKind; children?: ReactNode }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        kindClasses[kind],
      )}
    >
      {children ?? kindLabel[kind]}
    </span>
  );
}
