import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, animate } from "framer-motion";
import { cn } from "../lib/utils";

// ── DATA (hardcoded until API connected) ─────────────────────
const CHAMPION = {
  driver: "LEC",
  name: "Charles Leclerc",
  team: "Ferrari",
  pct: 34.9,
};

const TOP_CONTENDERS = [
  {
    driver: "LEC",
    name: "Leclerc",
    team: "Ferrari",
    teamColor: "#E8002D",
    pct: 34.9,
    pts: 378.9,
    pos: 1,
  },
  {
    driver: "PIA",
    name: "Piastri",
    team: "McLaren",
    teamColor: "#FF8000",
    pct: 19.2,
    pts: 344.4,
    pos: 2,
  },
  {
    driver: "RUS",
    name: "Russell",
    team: "Mercedes",
    teamColor: "#00D2BE",
    pct: 16.2,
    pts: 311.7,
    pos: 3,
  },
  {
    driver: "VER",
    name: "Verstappen",
    team: "Red Bull",
    teamColor: "#3671C6",
    pct: 8.7,
    pts: 261.1,
    pos: 4,
  },
  {
    driver: "NOR",
    name: "Norris",
    team: "McLaren",
    teamColor: "#FF8000",
    pct: 8.1,
    pts: 268.0,
    pos: 5,
  },
  {
    driver: "HAM",
    name: "Hamilton",
    team: "Ferrari",
    teamColor: "#E8002D",
    pct: 7.9,
    pts: 264.8,
    pos: 6,
  },
];

const STATS = [
  { value: "10,000", label: "Simulations" },
  { value: "22", label: "Drivers" },
  { value: "24", label: "Races" },
  { value: "0.635", label: "Model MAE" },
];

// ── ANIMATED COUNTER ─────────────────────────────────────────
function Counter({ to, decimals = 1, duration = 2, delay = 0 }) {
  const [display, setDisplay] = useState("0.0");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const controls = animate(0, to, {
        duration,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => setDisplay(v.toFixed(decimals)),
      });
      return () => controls.stop();
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [to, duration, delay, decimals]);

  return <>{display}</>;
}

// ── DRIVER CARD ───────────────────────────────────────────────
function DriverCard({ driver, index }) {
  const isFirst = driver.pos === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: 1.2 + index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "relative flex flex-col gap-3 p-5 rounded-sm border cursor-pointer transition-all duration-300",
        isFirst
          ? "bg-surface-2 border-red/40 shadow-[0_0_40px_rgba(232,0,45,0.12)]"
          : "bg-surface border-border hover:border-border-2 hover:shadow-card",
      )}
    >
      {/* Team color top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-sm"
        style={{ background: driver.teamColor, opacity: isFirst ? 1 : 0.45 }}
      />

      {/* Position + team */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-f1-faint">
          P{driver.pos}
        </span>
        <span
          className="text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded-sm"
          style={{
            color: driver.teamColor,
            background: `${driver.teamColor}18`,
            border: `1px solid ${driver.teamColor}30`,
          }}
        >
          {driver.team}
        </span>
      </div>

      {/* Driver code */}
      <div>
        <div
          className={cn(
            "font-display tracking-wider leading-none",
            isFirst ? "text-5xl text-f1-text" : "text-4xl text-f1-text",
          )}
        >
          {driver.driver}
        </div>
        <div className="text-[12px] text-f1-muted mt-1">{driver.name}</div>
      </div>

      {/* Championship % */}
      <div className="mt-auto">
        <div
          className={cn(
            "font-display leading-none",
            isFirst ? "text-3xl text-red" : "text-2xl text-f1-text",
          )}
        >
          {isFirst ? (
            <>
              <Counter to={driver.pct} delay={0.9} />%
            </>
          ) : (
            `${driver.pct}%`
          )}
        </div>
        <div className="text-[10px] text-f1-faint mt-0.5 tracking-wide">
          championship probability
        </div>
      </div>

      {/* Avg pts */}
      <div className="pt-3 border-t border-border flex items-center justify-between">
        <span className="text-[10px] text-f1-faint tracking-wide">Avg pts</span>
        <span className="text-[13px] font-medium text-f1-muted">
          {driver.pts}
        </span>
      </div>
    </motion.div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="relative min-h-screen bg-bg overflow-hidden">
      {/* Speed lines background */}
      <div className="absolute inset-0 pointer-events-none speed-lines-bg" />

      {/* Red radial glow */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5, delay: 0.3 }}
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(232,0,45,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Top-left corner accent */}
      <div className="absolute top-0 left-0 pointer-events-none">
        <div className="absolute top-[60px] left-0 w-48 h-[1px] bg-gradient-to-r from-red/40 to-transparent" />
        <div className="absolute top-[60px] left-0 w-[1px] h-48 bg-gradient-to-b from-red/40 to-transparent" />
      </div>

      {/* Top-right corner accent */}
      <div className="absolute top-0 right-0 pointer-events-none">
        <div className="absolute top-[60px] right-0 w-48 h-[1px] bg-gradient-to-l from-red/20 to-transparent" />
        <div className="absolute top-[60px] right-0 w-[1px] h-48 bg-gradient-to-b from-red/20 to-transparent" />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative max-w-[1280px] mx-auto px-8 pt-24 pb-20">
        {/* Eyebrow */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="w-8 h-[2px] bg-red rounded" />
          <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-red">
            2026 Season Preview · Monte Carlo Analysis
          </span>
        </motion.div>

        {/* Main title */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            className="font-display leading-none tracking-wider text-f1-text"
            style={{ fontSize: "clamp(56px, 10vw, 136px)" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            POLE<span className="text-red">POSITION</span>
          </motion.h1>
        </div>

        <div className="overflow-hidden mb-14">
          <motion.div
            className="flex items-baseline gap-5"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.75,
              delay: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span
              className="font-display leading-none tracking-wider text-border-2"
              style={{ fontSize: "clamp(56px, 10vw, 136px)" }}
            >
              AI
            </span>
            <span
              className="font-display tracking-[0.15em] text-f1-muted self-end mb-3"
              style={{ fontSize: "clamp(12px, 1.6vw, 20px)" }}
            >
              F1 CHAMPIONSHIP PREDICTIONS
            </span>
          </motion.div>
        </div>

        {/* ── CHAMPION REVEAL BOX ── */}
        <motion.div
          className="relative mb-14 p-8 rounded-sm border border-border bg-surface overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Subtle red tint */}
          <div className="absolute inset-0 bg-gradient-to-r from-red/[0.04] via-transparent to-transparent pointer-events-none" />
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-red/70 via-red/20 to-transparent" />

          <div className="relative flex flex-col md:flex-row md:items-center gap-8">
            {/* Label */}
            <div className="flex flex-col gap-2 md:w-40 shrink-0">
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-f1-faint">
                Predicted 2026 World Champion
              </span>
              <div className="w-6 h-[1px] bg-red" />
            </div>

            {/* Driver name */}
            <div className="flex items-baseline gap-5 flex-1">
              <motion.span
                className="font-display leading-none text-f1-text"
                style={{ fontSize: "clamp(48px, 7vw, 88px)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                {CHAMPION.driver}
              </motion.span>
              <div className="flex flex-col gap-1">
                <motion.span
                  className="font-display text-xl tracking-wider text-f1-muted"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.0 }}
                >
                  {CHAMPION.name}
                </motion.span>
                <motion.span
                  className="text-[11px] tracking-[0.15em] uppercase text-red"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.1 }}
                >
                  {CHAMPION.team}
                </motion.span>
              </div>
            </div>

            {/* Big % */}
            <motion.div
              className="flex flex-col md:items-end shrink-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div
                className="font-display leading-none text-red"
                style={{ fontSize: "clamp(48px, 6vw, 80px)" }}
              >
                <Counter to={CHAMPION.pct} delay={0.9} duration={1.8} />
                <span className="text-[0.45em] text-red/60">%</span>
              </div>
              <span className="text-[10px] tracking-[0.15em] uppercase text-f1-faint mt-1">
                Win Probability
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* ── CONTENDER CARDS ── */}
        <div className="mb-14">
          <motion.div
            className="flex items-center gap-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.0 }}
          >
            <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-f1-faint whitespace-nowrap">
              Championship Contenders
            </span>
            <div className="flex-1 h-[1px] bg-border" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {TOP_CONTENDERS.map((driver, i) => (
              <DriverCard key={driver.driver} driver={driver} index={i} />
            ))}
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <motion.div
          className="flex flex-wrap mb-14 border border-border rounded-sm overflow-hidden"
          style={{ gap: "1px", background: "#242424" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.7 }}
        >
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="flex-1 min-w-[120px] flex flex-col items-center justify-center gap-1.5 py-5 px-4 bg-surface"
            >
              <span className="font-display text-2xl tracking-wider text-f1-text">
                {value}
              </span>
              <span className="text-[10px] tracking-[0.12em] uppercase text-f1-faint">
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── CTA BUTTONS ── */}
        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.9 }}
        >
          <Link
            to="/drivers"
            className="inline-flex items-center gap-3 px-8 py-4 bg-red text-white font-display text-lg tracking-[0.08em] rounded-sm transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_32px_rgba(232,0,45,0.45)] hover:-translate-y-0.5"
          >
            Explore Predictions
            <span className="text-base opacity-60">→</span>
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-f1-text font-display text-lg tracking-[0.08em] rounded-sm border border-border-2 transition-all duration-200 hover:border-f1-muted hover:bg-surface-2 hover:-translate-y-0.5"
          >
            Ask PolePosition AI
            <span className="text-base opacity-60">🏎</span>
          </Link>
        </motion.div>

        {/* Footnote */}
        <motion.p
          className="mt-8 text-[11px] text-f1-faint tracking-wide max-w-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 2.1 }}
        >
          LightGBM regression trained on 2023–2025 race data · 10,000 Monte
          Carlo simulations · CV MAE: 0.635 positions
        </motion.p>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
    </div>
  );
}
