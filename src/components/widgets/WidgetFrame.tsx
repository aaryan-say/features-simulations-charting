import type { ReactNode } from "react";
import clsx from "clsx";

export function WidgetFrame({
  title,
  badge,
  children,
  height = 260,
  className,
  footer,
}: {
  title: string;
  badge?: string;
  children: ReactNode;
  height?: number;
  className?: string;
  footer?: ReactNode;
}) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-xl border border-base-700/70 bg-base-900/70",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-base-700/60 px-3.5 py-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-base-300">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="rounded-full bg-base-800 px-2 py-0.5 text-[10px] font-medium text-base-300">
              {badge}
            </span>
          )}
          <span className="flex items-center gap-1 text-[10px] font-medium text-signal-green">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-green opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-green" />
            </span>
            LIVE
          </span>
        </div>
      </div>
      <div style={{ height }} className="relative px-3.5 py-3">
        {children}
      </div>
      {footer && (
        <div className="border-t border-base-700/60 px-3.5 py-2 text-[11px] text-base-400">
          {footer}
        </div>
      )}
    </div>
  );
}
