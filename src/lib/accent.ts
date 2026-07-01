import type { Accent } from "@/types/feature";

interface AccentPalette {
  text: string;
  textDim: string;
  bg: string;
  bgSoft: string;
  border: string;
  glow: string;
  fill: string;
  ring: string;
  gradient: string;
}

const palettes: Record<Accent, AccentPalette> = {
  green: {
    text: "text-signal-green",
    textDim: "text-signal-green-dim",
    bg: "bg-signal-green",
    bgSoft: "bg-signal-green/10",
    border: "border-signal-green/30",
    glow: "glow-green",
    fill: "#2bffa8",
    ring: "ring-signal-green/40",
    gradient: "from-signal-green/20 to-transparent",
  },
  blue: {
    text: "text-signal-blue",
    textDim: "text-signal-blue-dim",
    bg: "bg-signal-blue",
    bgSoft: "bg-signal-blue/10",
    border: "border-signal-blue/30",
    glow: "glow-blue",
    fill: "#3ba6ff",
    ring: "ring-signal-blue/40",
    gradient: "from-signal-blue/20 to-transparent",
  },
  amber: {
    text: "text-signal-amber",
    textDim: "text-signal-amber-dim",
    bg: "bg-signal-amber",
    bgSoft: "bg-signal-amber/10",
    border: "border-signal-amber/30",
    glow: "glow-amber",
    fill: "#ffb23b",
    ring: "ring-signal-amber/40",
    gradient: "from-signal-amber/20 to-transparent",
  },
  red: {
    text: "text-signal-red",
    textDim: "text-signal-red-dim",
    bg: "bg-signal-red",
    bgSoft: "bg-signal-red/10",
    border: "border-signal-red/30",
    glow: "glow-red",
    fill: "#ff4d5e",
    ring: "ring-signal-red/40",
    gradient: "from-signal-red/20 to-transparent",
  },
};

export function accentPalette(accent: Accent): AccentPalette {
  return palettes[accent];
}

export const ACCENTS: Accent[] = ["green", "blue", "amber", "red"];
