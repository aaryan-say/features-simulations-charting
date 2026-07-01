import { WidgetFrame } from "@/components/widgets/WidgetFrame";
import { FootprintPanel } from "@/components/widgets/FootprintPanel";
import { CandleChart } from "@/components/widgets/CandleChart";
import { DeltaHistogram } from "@/components/widgets/DeltaHistogram";
import { LinePanel } from "@/components/widgets/LinePanel";
import { HeatGrid } from "@/components/widgets/HeatGrid";
import { GaugeMeter } from "@/components/widgets/GaugeMeter";
import { QuadrantMatrix } from "@/components/widgets/QuadrantMatrix";
import { ChartAlertPanel } from "@/components/widgets/ChartAlertPanel";
import { ExitAllCancelAllPanel } from "@/components/widgets/ExitAllCancelAllPanel";
import { SpreadLiquidityWarningPanel } from "@/components/widgets/SpreadLiquidityWarningPanel";
import { generateCandles } from "@/lib/marketData";
import type { VisualizationItem } from "@/components/VisualizationCard";

const deltaCandles = generateCandles(9, 22470, 15, 101);
const bubbleCandles = generateCandles(10, 22510, 13, 202);
const signalCandles = generateCandles(11, 22400, 17, 502);

export const items: VisualizationItem[] = [
  {
    id: "footprint-candle",
    accent: "green",
    sourceCluster: "Order Flow · available on Dhan DEXT T3",
    title: "Footprint Candle / Cluster Chart",
    panel: (
      <WidgetFrame title="Footprint / Cluster Chart" badge="Bid × Ask">
        <FootprintPanel />
      </WidgetFrame>
    ),
    explanation: "This shows how much volume traded at bid and ask inside the candle, price level by price level.",
    inspiredBy: ["Dhan DEXT", "GoCharting", "NinjaTrader", "Order-flow platforms"],
    pros: ["Very information rich", "Attractive to pro traders", "Great for marketing advanced trading tools"],
    cons: ["Can overwhelm beginners", "Needs reliable tick/order-flow data", "Requires careful visual design"],
    mvp: "Show candle-level bid/ask volume split and total delta.",
    advanced: "Show full price-level footprint with imbalance highlights, absorption markers, and CVD overlay.",
  },
  {
    id: "candle-delta-strip",
    accent: "green",
    sourceCluster: "Order Flow",
    title: "Candle Delta Strip",
    panel: (
      <WidgetFrame title="Candle Delta Strip" badge="Δ per candle">
        <CandleChart candles={deltaCandles} width={560} height={150} className="h-[150px] w-full" />
        <DeltaHistogram
          values={deltaCandles.map((c) => Math.round((c.close - c.open) * 40 + (c.volume - 1000) / 4))}
          highlightDivergence={[4]}
        />
      </WidgetFrame>
    ),
    explanation: "Delta shows net aggressive buying minus aggressive selling for each candle, plotted as a histogram beneath price.",
    inspiredBy: ["GoCharting", "Order-flow charting suites"],
    pros: ["Easy to scan at a glance", "Pairs well with any existing candlestick chart", "Cheaper to compute than full footprint"],
    cons: ["Loses price-level detail", "Can mislead without context", "Still needs tick-level data"],
    mvp: "Add delta bars below the price chart.",
    advanced: "Add divergence markers and 'possible trap' annotations.",
  },
  {
    id: "cumulative-delta",
    accent: "green",
    sourceCluster: "Order Flow",
    title: "Cumulative Delta Line",
    panel: (
      <WidgetFrame title="Cumulative Volume Delta" badge="CVD">
        <LinePanel
          rows={[
            [{ values: [10, 14, 12, 18, 22, 20, 26, 30, 28, 34], color: "#3ba6ff", area: true }],
            [{ values: [4, 8, 14, 10, 6, -2, -8, -14, -22, -30], color: "#ffb23b" }],
          ]}
          divergenceZones={[{ from: 5, to: 9 }]}
          annotations={[{ row: 1, index: 8, label: "Divergence", color: "#ffb23b" }]}
        />
      </WidgetFrame>
    ),
    explanation: "CVD tracks cumulative net buying/selling pressure across the session — price rising while CVD falls signals hidden distribution.",
    inspiredBy: ["Bookmap", "Order-flow analytics dashboards"],
    pros: ["Great early-warning signal", "Simple single line, easy to overlay", "Works well in marketing screenshots"],
    cons: ["Can whipsaw on choppy sessions", "Session reset logic must be well designed", "Easy to over-interpret"],
    mvp: "CVD indicator line with session reset.",
    advanced: "Auto-detect price-vs-CVD divergence.",
  },
  {
    id: "large-trade-bubbles",
    accent: "green",
    sourceCluster: "Order Flow",
    title: "Large Trade Bubbles",
    panel: (
      <WidgetFrame title="Large Trade Bubbles" badge="Size = trade size">
        <CandleChart
          candles={bubbleCandles}
          width={560}
          height={230}
          className="h-[230px] w-full"
          bubbles={[
            { index: 1, price: bubbleCandles[1].high, size: 6, side: "buy" },
            { index: 3, price: bubbleCandles[3].low, size: 10, side: "sell" },
            { index: 5, price: bubbleCandles[5].close, size: 14, side: "buy" },
            { index: 7, price: bubbleCandles[7].high, size: 8, side: "sell" },
            { index: 8, price: bubbleCandles[8].close, size: 12, side: "buy" },
          ]}
        />
      </WidgetFrame>
    ),
    explanation: "Shows large executed trades visually as bubbles — bigger bubble means bigger trade, colored by aggressor side.",
    inspiredBy: ["Bookmap large-print visualizations", "Futures order-flow tools"],
    pros: ["Immediately intuitive to non-technical viewers", "Great in marketing videos and screen recordings", "Surfaces institutional activity"],
    cons: ["Needs large-trade / block detection logic", "Can clutter the chart if not filtered", "Threshold tuning varies by instrument"],
    mvp: "Show large trade markers above a size threshold.",
    advanced: "Filter by instrument, size, aggressor side, and time.",
  },
  {
    id: "dom-imbalance-meter",
    accent: "blue",
    sourceCluster: "DOM / Market Depth",
    title: "DOM Imbalance Meter",
    panel: (
      <WidgetFrame title="Order Book Imbalance" badge="Live">
        <GaugeMeter label="Bid Pressure" />
      </WidgetFrame>
    ),
    explanation: "Expresses total bid liquidity versus total ask liquidity as a single gauge, flagging extreme one-sided pressure before it shows up in price.",
    inspiredBy: ["order-flow/DOM analytics tools"],
    pros: ["Very compact — one glance tells the whole story", "Cheap to compute from existing depth data", "Pairs well as a sidebar widget next to any chart"],
    cons: ["Raw bid/ask ratio can be noisy on thin instruments", "Doesn't say anything about where the imbalance sits relative to price", "Can trigger false urgency if thresholds aren't tuned per instrument"],
    mvp: "Bid/ask depth ratio.",
    advanced: "Weighted imbalance by distance from LTP.",
  },
  {
    id: "dom-heatmap",
    accent: "blue",
    sourceCluster: "DOM / Market Depth",
    title: "DOM Heatmap — Liquidity",
    panel: (
      <WidgetFrame title="Liquidity Heatmap" badge="Bookmap-style">
        <HeatGrid
          colLabels={["T-4", "T-3", "T-2", "T-1", "T0"]}
          rows={[
            { label: "22,520", cells: [180, 240, 260, 300, 340] },
            { label: "22,500", cells: [520, 610, 480, 590, 640] },
            { label: "22,480", cells: [340, 300, 380, 260, 220] },
            { label: "22,460", cells: [150, 190, 170, 210, 180] },
            { label: "22,440", cells: [90, 110, 130, 100, 95] },
          ]}
          highlightMax
        />
      </WidgetFrame>
    ),
    explanation: "Heat intensity represents how much liquidity sat at each price level across recent snapshots, so the current price can be seen moving through thicker and thinner liquidity zones.",
    inspiredBy: ["Bookmap-style liquidity visualization"],
    pros: ["Reveals liquidity walls and gaps at a glance", "Strong visual for demos and marketing screenshots", "Extends naturally into liquidity-based alerts"],
    cons: ["Needs a genuine L2 depth history feed, not just current snapshot", "Easy to fake convincingly but misleading if the data isn't real", "Heavy to render smoothly on mobile"],
    mvp: "Heat intensity based on 20-depth snapshots.",
    advanced: "Historical liquidity trail and replay.",
  },
  {
    id: "buy-sell-signal-markers",
    accent: "blue",
    sourceCluster: "Advanced Charting · Zerodha has it",
    title: "Buy/Sell Signal Markers",
    panel: (
      <WidgetFrame title="Buy/Sell Signal Markers" badge="Confidence: Medium" height={260}>
        <CandleChart
          candles={signalCandles}
          width={560}
          height={220}
          className="h-[220px] w-full"
          markers={[
            { index: 2, type: "buy" },
            { index: 4, type: "sell" },
            { index: 7, type: "buy" },
            { index: 9, type: "sell" },
          ]}
        />
      </WidgetFrame>
    ),
    explanation: "Buy arrows appear below candles and sell arrows above them the moment a rule condition triggers, without the trader watching every tick.",
    inspiredBy: ["TradingView strategy alerts", "GoCharting signal overlays"],
    pros: ["Turns passive chart-watching into an actionable feed", "Low visual overhead compared to full indicator panels", "Naturally extends into push alerts and webhooks"],
    cons: ["Traders may follow markers without understanding the underlying rule", "Repainting or lagging signals can quietly erode trust", "Needs clear disclaimers that markers are not guaranteed entries"],
    mvp: "Signal marker overlays.",
    advanced: "Strategy-based alerts and webhook trigger.",
  },
  {
    id: "chart-alerts",
    accent: "amber",
    sourceCluster: "New Concept",
    title: "Add Alerts on Charts",
    panel: (
      <WidgetFrame title="Chart Alerts" badge="Click to set" height={280}>
        <ChartAlertPanel />
      </WidgetFrame>
    ),
    explanation: "Click anywhere on the price chart to drop a price alert right where you're looking, instead of opening a separate condition-builder screen.",
    inspiredBy: ["TradingView price-line alerts", "Chart-native alert placement patterns"],
    pros: ["Zero context-switching — the alert is set exactly where the trader is already looking", "Faster than a form-based condition builder for simple price alerts", "Visually reinforces which levels are being watched, right on the chart"],
    cons: ["Needs a clear undo/remove affordance so charts don't get cluttered with stale alerts", "Harder to express multi-condition logic than a dedicated builder", "Precision on mobile touch targets is a real design challenge"],
    mvp: "Click-to-place single price alert lines on any chart.",
    advanced: "Drag to adjust, snap to support/resistance, and multi-channel delivery on trigger.",
  },
  {
    id: "buildup-unwinding-matrix",
    accent: "amber",
    sourceCluster: "Options Command Center",
    title: "Buildup / Unwinding Matrix",
    panel: (
      <WidgetFrame title="Buildup / Unwinding Matrix" badge="Price × OI">
        <QuadrantMatrix />
      </WidgetFrame>
    ),
    explanation: "A four-quadrant classification of long buildup, short buildup, long unwinding, and short covering, with instruments animating between quadrants as price and OI shift.",
    inspiredBy: ["F&O buildup/unwinding scanners"],
    pros: ["Fast scanning across many instruments at once", "Simple visual language traders already recognize", "Works well as a lightweight market-wide scanner surface"],
    cons: ["Oversimplifies nuanced OI shifts within a single quadrant", "Doesn't distinguish strength of buildup, only direction", "Needs a per-instrument drill-down to be actionable rather than just decorative"],
    mvp: "Basic OI + price change classification.",
    advanced: "Real-time scanner and alerts.",
  },
  {
    id: "exit-all-cancel-all",
    accent: "red",
    sourceCluster: "Scalper Terminal",
    title: "Exit All / Cancel All Controls",
    panel: (
      <WidgetFrame title="Exit All / Cancel All" badge="Risk Control" height={340}>
        <ExitAllCancelAllPanel />
      </WidgetFrame>
    ),
    explanation: "One-tap global risk controls let a scalper flatten every open position or clear every pending order in a single action.",
    inspiredBy: ["Dhan active trading surfaces", "scalper risk-control patterns"],
    pros: ["Crucial safety net when a market moves violently", "Removes the need to close positions one by one under pressure", "Pending-order clear prevents stale orders from filling unexpectedly"],
    cons: ["Must avoid accidental triggers given how consequential the action is", "Can be ambiguous about which segment or account it affects", "Needs a confirmation step that still doesn't cost precious seconds"],
    mvp: "Global risk action buttons.",
    advanced: "Segment-wise and strategy-wise exit controls.",
  },
  {
    id: "spread-liquidity-warning",
    accent: "red",
    sourceCluster: "Scalper Terminal",
    title: "Spread & Liquidity Warning",
    panel: (
      <WidgetFrame title="Spread & Liquidity Warning" badge="Execution Risk" height={300}>
        <SpreadLiquidityWarningPanel />
      </WidgetFrame>
    ),
    explanation: "Live bid/ask spread monitoring flags widening spreads and low liquidity before a scalper's order gets a bad fill.",
    inspiredBy: ["DOM/liquidity-aware execution tools"],
    pros: ["Protects against slippage on thin instruments", "Gives an objective signal instead of relying on gut feel", "Pairs naturally with the order pad for pre-trade checks"],
    cons: ["Poorly tuned thresholds create alert fatigue", "Requires reliable real-time depth data to be trustworthy", "Adds a visual element competing for attention on an already dense screen"],
    mvp: "Spread warning.",
    advanced: "Depth-based liquidity score.",
  },
];
