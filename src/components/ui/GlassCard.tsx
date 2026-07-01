import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export function GlassCard({
  children,
  className,
  glow,
  solid,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  glow?: string;
  solid?: boolean;
}) {
  return (
    <div
      className={clsx(
        solid ? "glass-panel-solid" : "glass-panel",
        "rounded-2xl",
        glow,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
