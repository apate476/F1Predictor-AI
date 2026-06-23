import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import { cn } from "../lib/utils";

const API = "http://localhost:8000";

const TEAM_COLORS = {
  Ferrari: "#E8002D",
  McLaren: "#FF8000",
  Mercedes: "#00D2BE",
  "Red Bull": "#3671C6",
  Williams: "#64C4FF",
  "Aston Martin": "#358C75",
  Alpine: "#0090FF",
  Haas: "#B6BABD",
  "Racing Bulls": "#6692FF",
  Audi: "#52E252",
  Cadillac: "#CC0000",
};

// ── VERIFIED 2026 GRID ─────────────────────────────────────────────────
// Source: formula1.com/en/latest/article/2026-line-ups-confirmed-in-full
const GRID_2026 = [
  {
    team: "McLaren",
    color: "#FF8000",
    drivers: [
      {
        code: "NOR",
        name: "Lando Norris",
        number: 4,
        country: "United Kingdom",
        flag: "🇬🇧",
        dob: "1999-11-13",
        stats: { wdc: 0, wins: 6, podiums: 33 },
      },
      {
        code: "PIA",
        name: "Oscar Piastri",
        number: 81,
        country: "Australia",
        flag: "🇦🇺",
        dob: "2001-04-06",
        stats: { wdc: 0, wins: 2, podiums: 13 },
      },
    ],
  },
  {
    team: "Ferrari",
    color: "#E8002D",
    drivers: [
      {
        code: "LEC",
        name: "Charles Leclerc",
        number: 16,
        country: "Monaco",
        flag: "🇲🇨",
        dob: "1997-10-16",
        stats: { wdc: 0, wins: 8, podiums: 42 },
      },
      {
        code: "HAM",
        name: "Lewis Hamilton",
        number: 44,
        country: "United Kingdom",
        flag: "🇬🇧",
        dob: "1985-01-07",
        stats: { wdc: 7, wins: 104, podiums: 197 },
      },
    ],
  },
  {
    team: "Mercedes",
    color: "#00D2BE",
    drivers: [
      {
        code: "RUS",
        name: "George Russell",
        number: 63,
        country: "United Kingdom",
        flag: "🇬🇧",
        dob: "1998-02-15",
        stats: { wdc: 0, wins: 2, podiums: 19 },
      },
      {
        code: "ANT",
        name: "Kimi Antonelli",
        number: 12,
        country: "Italy",
        flag: "🇮🇹",
        dob: "2006-08-25",
        stats: { wdc: 0, wins: 0, podiums: 0 },
      },
    ],
  },
  {
    team: "Red Bull",
    color: "#3671C6",
    drivers: [
      {
        code: "VER",
        name: "Max Verstappen",
        number: 1,
        country: "Netherlands",
        flag: "🇳🇱",
        dob: "1997-09-30",
        stats: { wdc: 4, wins: 63, podiums: 112 },
      },
      {
        code: "HAD",
        name: "Isack Hadjar",
        number: 22,
        country: "France",
        flag: "🇫🇷",
        dob: "2004-09-28",
        stats: { wdc: 0, wins: 0, podiums: 0 },
      },
    ],
  },
  {
    team: "Williams",
    color: "#64C4FF",
    drivers: [
      {
        code: "ALB",
        name: "Alex Albon",
        number: 23,
        country: "Thailand",
        flag: "🇹🇭",
        dob: "1996-03-23",
        stats: { wdc: 0, wins: 0, podiums: 2 },
      },
      {
        code: "SAI",
        name: "Carlos Sainz",
        number: 55,
        country: "Spain",
        flag: "🇪🇸",
        dob: "1994-09-01",
        stats: { wdc: 0, wins: 3, podiums: 29 },
      },
    ],
  },
  {
    team: "Aston Martin",
    color: "#358C75",
    drivers: [
      {
        code: "ALO",
        name: "Fernando Alonso",
        number: 14,
        country: "Spain",
        flag: "🇪🇸",
        dob: "1981-07-29",
        stats: { wdc: 2, wins: 32, podiums: 106 },
      },
      {
        code: "STR",
        name: "Lance Stroll",
        number: 18,
        country: "Canada",
        flag: "🇨🇦",
        dob: "1998-10-29",
        stats: { wdc: 0, wins: 0, podiums: 3 },
      },
    ],
  },
  {
    team: "Alpine",
    color: "#0090FF",
    drivers: [
      {
        code: "GAS",
        name: "Pierre Gasly",
        number: 10,
        country: "France",
        flag: "🇫🇷",
        dob: "1996-02-07",
        stats: { wdc: 0, wins: 1, podiums: 3 },
      },
      {
        code: "COL",
        name: "Franco Colapinto",
        number: 43,
        country: "Argentina",
        flag: "🇦🇷",
        dob: "2003-05-27",
        stats: { wdc: 0, wins: 0, podiums: 0 },
      },
    ],
  },
  {
    team: "Racing Bulls",
    color: "#6692FF",
    drivers: [
      {
        code: "LAW",
        name: "Liam Lawson",
        number: 30,
        country: "New Zealand",
        flag: "🇳🇿",
        dob: "2002-02-11",
        stats: { wdc: 0, wins: 0, podiums: 0 },
      },
      {
        code: "LIN",
        name: "Arvid Lindblad",
        number: 6,
        country: "United Kingdom",
        flag: "🇬🇧",
        dob: "2006-07-04",
        stats: { wdc: 0, wins: 0, podiums: 0 },
      },
    ],
  },
  {
    team: "Haas",
    color: "#B6BABD",
    drivers: [
      {
        code: "OCO",
        name: "Esteban Ocon",
        number: 31,
        country: "France",
        flag: "🇫🇷",
        dob: "1996-09-17",
        stats: { wdc: 0, wins: 1, podiums: 3 },
      },
      {
        code: "BEA",
        name: "Oliver Bearman",
        number: 87,
        country: "United Kingdom",
        flag: "🇬🇧",
        dob: "2005-05-08",
        stats: { wdc: 0, wins: 0, podiums: 0 },
      },
    ],
  },
  {
    team: "Audi",
    color: "#52E252",
    drivers: [
      {
        code: "HUL",
        name: "Nico Hülkenberg",
        number: 27,
        country: "Germany",
        flag: "🇩🇪",
        dob: "1987-08-19",
        stats: { wdc: 0, wins: 0, podiums: 0 },
      },
      {
        code: "BOR",
        name: "Gabriel Bortoleto",
        number: 5,
        country: "Brazil",
        flag: "🇧🇷",
        dob: "2004-10-14",
        stats: { wdc: 0, wins: 0, podiums: 0 },
      },
    ],
  },
  {
    team: "Cadillac",
    color: "#CC0000",
    drivers: [
      {
        code: "PER",
        name: "Sergio Pérez",
        number: 11,
        country: "Mexico",
        flag: "🇲🇽",
        dob: "1990-01-26",
        stats: { wdc: 0, wins: 6, podiums: 35 },
      },
      {
        code: "BOT",
        name: "Valtteri Bottas",
        number: 77,
        country: "Finland",
        flag: "🇫🇮",
        dob: "1989-08-28",
        stats: { wdc: 0, wins: 10, podiums: 67 },
      },
    ],
  },
];

// Flat list for search/filter convenience
const ALL_DRIVERS = GRID_2026.flatMap((team) =>
  team.drivers.map((d) => ({ ...d, team: team.team, color: team.color })),
);

// ── COMPONENTS ─────────────────────────────────────────────────────────

function StatBox({ label, value, highlight }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 p-3 sm:p-4 rounded-sm border",
        highlight ? "bg-red/5 border-red/20" : "bg-surface border-border",
      )}
    >
      <span
        className={cn(
          "font-display text-xl sm:text-2xl leading-none",
          highlight ? "text-red" : "text-f1-text",
        )}
      >
        {value ?? "—"}
      </span>
      <span className="text-[9px] sm:text-[10px] tracking-[0.1em] uppercase text-f1-faint">
        {label}
      </span>
    </div>
  );
}

function CircuitBar({ name, pct, color }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="text-[10px] sm:text-[11px] text-f1-muted w-28 sm:w-36 truncate shrink-0">
        {name.replace(" Grand Prix", "").replace(" GP", "")}
      </span>
      <div className="flex-1 h-[2px] bg-surface-3 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct * 2.2, 100)}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className="text-[10px] sm:text-[11px] font-medium text-f1-muted w-8 sm:w-10 text-right shrink-0">
        {pct}%
      </span>
    </div>
  );
}

function DriverPanel({ driver, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const teamColor = TEAM_COLORS[driver.team] || "#888";

  useEffect(() => {
    setLoading(true);
    setData(null);
    fetch(`${API}/api/driver/${driver.code}/career`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [driver.code]);

  const career = data?.career;
  const pred = data?.prediction;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        className="relative w-full sm:max-w-xl lg:max-w-2xl bg-bg border-l border-border h-full overflow-y-auto"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="h-[3px] w-full" style={{ background: teamColor }} />

        {/* Header */}
        <div className="sticky top-0 z-10 bg-bg/95 backdrop-blur border-b border-border px-4 sm:px-7 py-4 sm:py-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <span className="font-display text-4xl sm:text-5xl leading-none text-f1-text shrink-0">
              {driver.code}
            </span>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="font-display text-base sm:text-lg tracking-wider text-f1-muted truncate">
                {driver.name}
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className="text-[9px] sm:text-[10px] tracking-widest uppercase px-1.5 sm:px-2 py-0.5 rounded-sm whitespace-nowrap"
                  style={{
                    color: teamColor,
                    background: `${teamColor}18`,
                    border: `1px solid ${teamColor}30`,
                  }}
                >
                  {driver.team}
                </span>
                <span className="text-[10px] sm:text-[11px] text-f1-faint whitespace-nowrap">
                  {driver.flag} {driver.country} · #{driver.number}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-2 text-f1-faint hover:text-f1-text transition-colors rounded-sm hover:bg-surface-2"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        {loading ? (
          <div className="p-4 sm:p-7 flex flex-col gap-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-11 rounded-sm bg-surface-2 animate-pulse"
                style={{ opacity: 1 - i * 0.15 }}
              />
            ))}
          </div>
        ) : !data ? (
          <div className="p-4 sm:p-7">
            <div className="p-4 rounded-sm border border-border bg-surface-2 text-f1-faint text-sm">
              Backend not running — start the FastAPI server to load career
              stats.
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-7 flex flex-col gap-7 sm:gap-9">
            {/* Career Stats */}
            <section>
              <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.15em] uppercase text-f1-faint">
                  Career Statistics
                </span>
                <div className="flex-1 h-[1px] bg-border" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                <StatBox
                  label="Championships"
                  value={career?.championships ?? "—"}
                />
                <StatBox label="Race Wins" value={career?.wins ?? "—"} />
                <StatBox label="Podiums" value={career?.podiums ?? "—"} />
                <StatBox label="Pole Positions" value={career?.poles ?? "—"} />
                <StatBox
                  label="Fastest Laps"
                  value={career?.fastest_laps ?? "—"}
                />
                <StatBox label="Career Points" value={career?.points ?? "—"} />
                <StatBox label="Race Starts" value={career?.starts ?? "—"} />
                <StatBox label="DNFs" value={career?.dnfs ?? "—"} />
              </div>
              {career?.debut && (
                <p className="mt-2.5 sm:mt-3 text-[9px] sm:text-[10px] text-f1-faint">
                  F1 debut {career.debut}
                  {driver.dob
                    ? ` · Born ${new Date(driver.dob).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`
                    : ""}
                  {" · " + driver.country}
                </p>
              )}
            </section>

            {/* 2026 Predictions */}
            {pred && (
              <section>
                <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.15em] uppercase text-red">
                    2026 Season Predictions
                  </span>
                  <div className="flex-1 h-[1px] bg-border" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                  <StatBox
                    label="Championship Prob"
                    value={`${pred.champ_pct}%`}
                    highlight
                  />
                  <StatBox label="Race Win Rate" value={`${pred.win_pct}%`} />
                  <StatBox label="Avg Points" value={pred.avg_points} />
                  <StatBox
                    label="Points Range"
                    value={`${pred.min_points}–${pred.max_points}`}
                  />
                </div>
                <p className="mt-2.5 sm:mt-3 text-[9px] sm:text-[10px] text-f1-faint">
                  Based on 10,000 Monte Carlo simulations · LightGBM model
                  trained on 2022–2024 data
                </p>
              </section>
            )}

            {/* Best Circuits */}
            {pred?.best_circuits?.length > 0 && (
              <section>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.15em] uppercase text-f1-faint">
                    Best Circuits
                  </span>
                  <div className="flex-1 h-[1px] bg-border" />
                </div>
                <div className="flex flex-col gap-2.5 sm:gap-3">
                  {pred.best_circuits.slice(0, 5).map((c) => (
                    <CircuitBar
                      key={c.race}
                      name={c.race}
                      pct={c.win_pct}
                      color={teamColor}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Worst Circuits */}
            {pred?.worst_circuits?.length > 0 && (
              <section>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.15em] uppercase text-f1-faint">
                    Hardest Circuits
                  </span>
                  <div className="flex-1 h-[1px] bg-border" />
                </div>
                <div className="flex flex-col gap-2.5 sm:gap-3">
                  {pred.worst_circuits.slice(0, 5).map((c) => (
                    <CircuitBar
                      key={c.race}
                      name={c.race}
                      pct={c.win_pct}
                      color="#444"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Ask AI */}
            <div className="p-4 sm:p-5 rounded-sm border border-border bg-surface-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[13px] sm:text-sm text-f1-text font-medium">
                  Want deeper analysis?
                </p>
                <p className="text-[10px] sm:text-[11px] text-f1-faint mt-0.5 leading-snug">
                  Ask the AI about {driver.code}'s chances, head-to-heads, and
                  circuit breakdowns.
                </p>
              </div>
              <a
                href="/chat"
                className="shrink-0 px-3 sm:px-4 py-2 bg-red text-white font-display text-[11px] sm:text-[12px] tracking-[0.08em] rounded-sm hover:brightness-110 transition-all whitespace-nowrap"
              >
                Ask AI →
              </a>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function DriverCard({ driver, index, onClick }) {
  return (
    <motion.div
      onClick={() => onClick(driver)}
      className="relative flex flex-col rounded-sm border border-border bg-surface cursor-pointer group overflow-hidden hover:border-border-2 hover:shadow-card transition-all duration-200"
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.4) }}
    >
      <div
        className="h-[3px] w-full opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: driver.color }}
      />

      <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
        {/* Number + flag */}
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl sm:text-3xl leading-none text-border-2 group-hover:text-border transition-colors">
            {driver.number}
          </span>
          <span className="text-base sm:text-lg" title={driver.country}>
            {driver.flag}
          </span>
        </div>

        {/* Code */}
        <div>
          <div className="font-display text-[28px] sm:text-[34px] leading-none text-f1-text tracking-wider">
            {driver.code}
          </div>
          <div className="text-[10px] sm:text-[11px] text-f1-muted mt-0.5 truncate leading-tight">
            {driver.name}
          </div>
          <div className="text-[9px] sm:text-[10px] text-f1-faint/70 mt-0.5 truncate">
            {driver.country}
          </div>
        </div>

        {/* Career stats */}
        {driver.stats && (
          <div className="flex mt-auto pt-2 border-t border-border/50 gap-px">
            <div className="flex-1 text-center">
              <div
                className="font-display text-base sm:text-lg leading-none"
                style={driver.stats.wdc > 0 ? { color: driver.color } : {}}
              >
                <span className={driver.stats.wdc === 0 ? "text-f1-faint/50" : ""}>
                  {driver.stats.wdc}
                </span>
              </div>
              <div className="text-[7px] sm:text-[8px] tracking-widest uppercase text-f1-faint mt-0.5">
                WDC
              </div>
            </div>
            <div className="w-px bg-border/40 mx-0.5" />
            <div className="flex-1 text-center">
              <div
                className={cn(
                  "font-display text-base sm:text-lg leading-none",
                  driver.stats.wins > 0 ? "text-f1-text" : "text-f1-faint/50",
                )}
              >
                {driver.stats.wins}
              </div>
              <div className="text-[7px] sm:text-[8px] tracking-widest uppercase text-f1-faint mt-0.5">
                Wins
              </div>
            </div>
            <div className="w-px bg-border/40 mx-0.5" />
            <div className="flex-1 text-center">
              <div
                className={cn(
                  "font-display text-base sm:text-lg leading-none",
                  driver.stats.podiums > 0 ? "text-f1-text" : "text-f1-faint/50",
                )}
              >
                {driver.stats.podiums}
              </div>
              <div className="text-[7px] sm:text-[8px] tracking-widest uppercase text-f1-faint mt-0.5">
                Pods
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── PAGE ───────────────────────────────────────────────────────────────
export default function Drivers() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useState("team"); // 'team' | 'grid'

  // Filter logic
  const q = search.toLowerCase();
  const matchesSearch = (d) =>
    !q ||
    d.name.toLowerCase().includes(q) ||
    d.code.toLowerCase().includes(q) ||
    d.country.toLowerCase().includes(q);

  const filteredTeams = GRID_2026.map((t) => ({
    ...t,
    drivers: t.drivers.filter(matchesSearch),
  })).filter((t) => t.drivers.length > 0);

  const flatFiltered = ALL_DRIVERS.filter(matchesSearch);

  return (
    <div className="min-h-screen bg-bg">
      <div className="fixed inset-0 speed-lines-bg pointer-events-none opacity-40" />

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        {/* Header */}
        <div className="mb-7 sm:mb-10">
          <motion.div
            className="flex items-center gap-2.5 mb-3"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-5 h-[2px] bg-red" />
            <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase text-red">
              2026 Grid · 11 Teams · 22 Drivers
            </span>
          </motion.div>
          <motion.h1
            className="font-display leading-none tracking-wider text-f1-text"
            style={{ fontSize: "clamp(48px, 10vw, 96px)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            DRIVERS
          </motion.h1>
          <motion.p
            className="text-f1-muted text-[12px] sm:text-sm mt-2 sm:mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            Click any driver for career stats and 2026 AI predictions
          </motion.p>
        </div>

        {/* Controls */}
        <motion.div
          className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 sm:mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Search */}
          <div className="relative">
            <Search
              size={11}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-f1-faint"
            />
            <input
              type="text"
              placeholder="Search driver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface border border-border rounded-sm pl-7 pr-3 py-2 text-[12px] sm:text-[13px] text-f1-text placeholder:text-f1-faint outline-none focus:border-border-2 transition-colors w-36 sm:w-48"
            />
          </div>

          {/* View toggle */}
          <div className="flex gap-px border border-border rounded-sm overflow-hidden ml-auto">
            {[
              { id: "team", label: "By Team" },
              { id: "grid", label: "All Drivers" },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setViewMode(v.id)}
                className={cn(
                  "px-3 py-2 text-[11px] sm:text-[12px] font-medium tracking-wide transition-colors",
                  viewMode === v.id
                    ? "bg-red text-white"
                    : "bg-surface text-f1-faint hover:text-f1-text hover:bg-surface-2",
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── TEAM-GROUPED VIEW (default) ── */}
        {viewMode === "team" && (
          <div className="flex flex-col gap-6 sm:gap-8">
            {filteredTeams.map((team, ti) => (
              <motion.div
                key={team.team}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: ti * 0.06 }}
              >
                {/* Team header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: team.color }}
                  />
                  <span className="font-display text-lg sm:text-xl tracking-wider text-f1-text">
                    {team.team}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Two driver cards side by side */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                  {team.drivers.map((driver, di) => (
                    <DriverCard
                      key={driver.code}
                      driver={driver}
                      index={ti * 2 + di}
                      onClick={setSelected}
                    />
                  ))}
                  {/* Filler placeholder for spacing on wider grids */}
                  {team.drivers.length === 2 && (
                    <>
                      <div className="hidden md:block" />
                      <div className="hidden md:block" />
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── ALL DRIVERS FLAT GRID ── */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
            {flatFiltered.map((driver, i) => (
              <DriverCard
                key={driver.code}
                driver={driver}
                index={i}
                onClick={setSelected}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {(viewMode === "team" ? filteredTeams : flatFiltered).length === 0 && (
          <div className="text-center py-16">
            <p className="text-f1-faint text-sm">No drivers match "{search}"</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <DriverPanel driver={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
