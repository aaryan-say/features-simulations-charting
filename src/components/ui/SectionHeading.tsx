import type { ReactNode } from "react";
import clsx from "clsx";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={clsx(align === "center" && "text-center", className)}>
      {eyebrow && (
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-signal-green/80">
          <span className="h-px w-6 bg-signal-green/50" />
          {eyebrow}
        </div>
      )}
      <h2 className="text-2xl font-semibold text-base-50 sm:text-3xl">{title}</h2>
      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-base-300 sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
