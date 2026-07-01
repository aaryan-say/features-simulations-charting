import type { ReactNode } from "react";
import clsx from "clsx";

export function Chip({
  children,
  active,
  className,
}: {
  children: ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors",
        active
          ? "border-signal-green/40 bg-signal-green/10 text-signal-green"
          : "border-base-600 bg-base-800/80 text-base-300",
        className,
      )}
    >
      {children}
    </span>
  );
}
