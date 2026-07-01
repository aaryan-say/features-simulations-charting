import type { ReactNode } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { GlassCard } from "./ui/GlassCard";
import { Chip } from "./ui/Chip";
import { Tag } from "./ui/Tag";
import { accentPalette } from "@/lib/accent";
import type { Accent } from "@/types/feature";

export interface VisualizationItem {
  id: string;
  accent: Accent;
  title: string;
  sourceCluster: string;
  panel: ReactNode;
  explanation: string;
  inspiredBy: string[];
  pros: string[];
  cons: string[];
  mvp: string;
  advanced: string;
}

export function VisualizationCard({ item, index }: { item: VisualizationItem; index: number }) {
  const palette = accentPalette(item.accent);

  return (
    <GlassCard className="overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[1fr_1fr]">
        <div className="border-b border-base-700/60 p-5 lg:border-b-0 lg:border-r">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${palette.bgSoft} ${palette.text}`}
              >
                {index + 1}
              </span>
              <Tag kind="pattern" />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wide text-base-500">{item.sourceCluster}</span>
          </div>
          {item.panel}
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div>
            <h3 className="text-base font-semibold text-base-50">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-base-400">{item.explanation}</p>
          </div>

          <div>
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-base-500">Inspired by</div>
            <div className="flex flex-wrap gap-1.5">
              {item.inspiredBy.map((p) => (
                <Chip key={p}>{p}</Chip>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-signal-green">
                <CheckCircle2 size={12} /> Pros
              </div>
              <ul className="space-y-1 text-xs leading-relaxed text-base-400">
                {item.pros.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-signal-red">
                <XCircle size={12} /> Cons
              </div>
              <ul className="space-y-1 text-xs leading-relaxed text-base-400">
                {item.cons.map((c) => (
                  <li key={c}>• {c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
