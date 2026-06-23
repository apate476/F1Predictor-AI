import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
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
  Renault: "#FFD700",
  Lotus: "#006400",
};

const RECENT_CHAMPIONS = [
  {
    year: 2016,
    driver: "ROSBERG",
    team: "Mercedes",
    flag: "🇩🇪",
    color: "#00D2BE",
  },
  {
    year: 2017,
    driver: "HAMILTON",
    team: "Mercedes",
    flag: "🇬🇧",
    color: "#00D2BE",
  },
  {
    year: 2018,
    driver: "HAMILTON",
    team: "Mercedes",
    flag: "🇬🇧",
    color: "#00D2BE",
  },
  {
    year: 2019,
    driver: "HAMILTON",
    team: "Mercedes",
    flag: "🇬🇧",
    color: "#00D2BE",
  },
  {
    year: 2020,
    driver: "HAMILTON",
    team: "Mercedes",
    flag: "🇬🇧",
    color: "#00D2BE",
  },
  {
    year: 2021,
    driver: "VERSTAPPEN",
    team: "Red Bull",
    flag: "🇳🇱",
    color: "#3671C6",
  },
  {
    year: 2022,
    driver: "VERSTAPPEN",
    team: "Red Bull",
    flag: "🇳🇱",
    color: "#3671C6",
  },
  {
    year: 2023,
    driver: "VERSTAPPEN",
    team: "Red Bull",
    flag: "🇳🇱",
    color: "#3671C6",
  },
  {
    year: 2024,
    driver: "VERSTAPPEN",
    team: "Red Bull",
    flag: "🇳🇱",
    color: "#3671C6",
  },
  {
    year: 2025,
    driver: "NORRIS",
    team: "McLaren",
    flag: "🇬🇧",
    color: "#FF8000",
  },
];

// ── ALL-TIME DRIVER RECORDS (verified post-2025 Abu Dhabi GP) ──────────
const ALL_TIME_RECORDS = [
  {
    icon: "🏆",
    label: "Championships",
    value: 7,
    holder: "Lewis Hamilton",
    detail: "Tied with M. Schumacher",
  },
  {
    icon: "🏁",
    label: "Race Wins",
    value: 105,
    holder: "Lewis Hamilton",
    detail: "2007 – 2024",
  },
  {
    icon: "🔵",
    label: "Pole Positions",
    value: 104,
    holder: "Lewis Hamilton",
    detail: "2007 – 2024",
  },
  {
    icon: "⚡",
    label: "Fastest Laps",
    value: 77,
    holder: "Michael Schumacher",
    detail: "Last: 2012 German GP",
  },
  {
    icon: "🥇",
    label: "Podiums",
    value: 202,
    holder: "Lewis Hamilton",
    detail: "2007 – 2024",
  },
  {
    icon: "🏎",
    label: "Race Starts",
    value: 349,
    holder: "Kimi Räikkönen",
    detail: "2001 – 2021",
  },
  {
    icon: "📍",
    label: "Youngest Champ",
    value: 23,
    holder: "Sebastian Vettel",
    detail: "2010, age 23 yrs 134 days",
  },
  {
    icon: "📅",
    label: "Oldest Champ",
    value: 46,
    holder: "Juan Manuel Fangio",
    detail: "1957, age 46 yrs 41 days",
  },
];

// ── ALL CONSTRUCTOR CHAMPIONS + NOTABLE CURRENT TEAMS ──────────────────
// Source: Wikipedia "List of Formula One World Constructors' Champions"
// 15 constructors have ever won the title (since 1958)
const CONSTRUCTOR_LEGACY = [
  // Championship winners, sorted by titles desc
  {
    team: "Ferrari",
    titles: 16,
    last: 2008,
    active: true,
    color: "#E8002D",
    country: "🇮🇹",
  },
  {
    team: "McLaren",
    titles: 10,
    last: 2025,
    active: true,
    color: "#FF8000",
    country: "🇬🇧",
  },
  {
    team: "Williams",
    titles: 9,
    last: 1997,
    active: true,
    color: "#64C4FF",
    country: "🇬🇧",
  },
  {
    team: "Mercedes",
    titles: 8,
    last: 2021,
    active: true,
    color: "#00D2BE",
    country: "🇩🇪",
  },
  {
    team: "Lotus",
    titles: 7,
    last: 1978,
    active: false,
    color: "#006400",
    country: "🇬🇧",
  },
  {
    team: "Red Bull",
    titles: 6,
    last: 2023,
    active: true,
    color: "#3671C6",
    country: "🇦🇹",
  },
  {
    team: "Brabham",
    titles: 2,
    last: 1967,
    active: false,
    color: "#888",
    country: "🇬🇧",
  },
  {
    team: "Cooper",
    titles: 2,
    last: 1960,
    active: false,
    color: "#999",
    country: "🇬🇧",
  },
  {
    team: "Renault",
    titles: 2,
    last: 2006,
    active: false,
    color: "#FFD700",
    country: "🇫🇷",
  },
  {
    team: "Vanwall",
    titles: 1,
    last: 1958,
    active: false,
    color: "#2ecc71",
    country: "🇬🇧",
  },
  {
    team: "BRM",
    titles: 1,
    last: 1962,
    active: false,
    color: "#aaa",
    country: "🇬🇧",
  },
  {
    team: "Matra",
    titles: 1,
    last: 1969,
    active: false,
    color: "#3498db",
    country: "🇫🇷",
  },
  {
    team: "Tyrrell",
    titles: 1,
    last: 1971,
    active: false,
    color: "#666",
    country: "🇬🇧",
  },
  {
    team: "Benetton",
    titles: 1,
    last: 1995,
    active: false,
    color: "#00ff88",
    country: "🇬🇧",
  },
  {
    team: "Brawn GP",
    titles: 1,
    last: 2009,
    active: false,
    color: "#ddd",
    country: "🇬🇧",
  },
  // Current 2026 teams with 0 titles
  {
    team: "Aston Martin",
    titles: 0,
    last: null,
    active: true,
    color: "#358C75",
    country: "🇬🇧",
  },
  {
    team: "Alpine",
    titles: 0,
    last: null,
    active: true,
    color: "#0090FF",
    country: "🇫🇷",
    note: "Renault era: 2 titles",
  },
  {
    team: "Haas",
    titles: 0,
    last: null,
    active: true,
    color: "#B6BABD",
    country: "🇺🇸",
  },
  {
    team: "Racing Bulls",
    titles: 0,
    last: null,
    active: true,
    color: "#6692FF",
    country: "🇦🇹",
    note: "ex-Toro Rosso",
  },
  {
    team: "Audi",
    titles: 0,
    last: null,
    active: true,
    color: "#52E252",
    country: "🇩🇪",
    note: "ex-Sauber/Alfa Romeo",
  },
  {
    team: "Cadillac",
    titles: 0,
    last: null,
    active: true,
    color: "#CC0000",
    country: "🇺🇸",
    note: "Joined F1 2026",
  },
];

// ── INTERESTING DID YOU KNOW (verified) ───────────────────────────────
const DID_YOU_KNOW = [
  {
    stat: "15/16",
    label: "Races won by McLaren in 1988",
    sub: "Senna & Prost dominated so completely that McLaren won every race except the Italian GP — the most dominant season in constructors history",
  },
  {
    stat: "0.001s",
    label: "Closest finish in F1 history",
    sub: "Ayrton Senna beat Nigel Mansell by just 0.014 seconds at the 1986 Spanish GP — equivalent to 25 centimetres at racing speed",
  },
  {
    stat: "1950",
    label: "First F1 World Championship season",
    sub: "Giuseppe Farina won the inaugural title, driving for Alfa Romeo at the age of 44 — and Ferrari has entered every single championship since",
  },
];

const FEATURES = [
  {
    icon: "⚙",
    title: "LightGBM Regression",
    desc: "Trained on 3 seasons of race data — qualifying pace, grid position, circuit type, pit strategy, and historical DNF rates per driver.",
  },
  {
    icon: "🎲",
    title: "10,000 Monte Carlo Simulations",
    desc: "Each season simulated 10,000 times across all 24 races, producing a full championship probability distribution for every driver.",
  },
  {
    icon: "🧠",
    title: "Multi-Agent AI Orchestration",
    desc: "Ask anything in plain English. Specialist agents handle championship, driver, and circuit queries — returning data-backed answers instantly.",
  },
];

const FALLBACK = [
  { driver: "LEC", name: "Leclerc", team: "Ferrari", champ_pct: 66.6 },
  { driver: "PIA", name: "Piastri", team: "McLaren", champ_pct: 19.2 },
  { driver: "RUS", name: "Russell", team: "Mercedes", champ_pct: 9.8 },
  { driver: "VER", name: "Verstappen", team: "Red Bull", champ_pct: 2.1 },
  { driver: "NOR", name: "Norris", team: "McLaren", champ_pct: 1.6 },
  { driver: "HAM", name: "Hamilton", team: "Ferrari", champ_pct: 1.4 },
];

const TICKER_1 = [
  "Ferrari",
  "· 16 Constructor Titles ·",
  "McLaren",
  "· 10 Constructor Titles ·",
  "Williams",
  "· 9 Constructor Titles ·",
  "Mercedes",
  "· 8 Consecutive Titles 2014–2021 ·",
  "Red Bull",
  "· Verstappen 4× World Champion ·",
  "Lando Norris",
  "· 2025 World Champion ·",
];
const TICKER_2 = [
  "Australia · Rd 1",
  "China · Rd 2",
  "Japan · Rd 3",
  "Bahrain · Rd 4",
  "Saudi Arabia · Rd 5",
  "Miami · Rd 6",
  "Canada · Rd 7",
  "Monaco · Rd 8",
  "Spain · Rd 9",
  "Austria · Rd 10",
  "Britain · Rd 11",
  "Belgium · Rd 12",
  "Hungary · Rd 13",
  "Netherlands · Rd 14",
  "Italy · Rd 15",
  "Madrid · Rd 16",
  "Azerbaijan · Rd 17",
  "Singapore · Rd 18",
  "Austin · Rd 19",
  "Mexico · Rd 20",
  "São Paulo · Rd 21",
  "Las Vegas · Rd 22",
  "Qatar · Rd 23",
  "Abu Dhabi · Rd 24",
];

// ── COMPONENTS ────────────────────────────────────────────────

function AnimatedCounter({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 1400, bounce: 0 });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (isInView) motionVal.set(value);
  }, [isInView, value, motionVal]);
  useEffect(
    () => spring.on("change", (v) => setDisplay(Math.round(v))),
    [spring],
  );
  return <span ref={ref}>{display}</span>;
}

function Marquee({ items, direction = 1, speed = 35 }) {
  const all = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y border-border bg-surface py-3">
      <motion.div
        className="flex gap-6 sm:gap-10 whitespace-nowrap"
        animate={{ x: direction > 0 ? ["0%", "-33.33%"] : ["-33.33%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {all.map((item, i) => (
          <span
            key={i}
            className="text-[10px] sm:text-[11px] font-medium tracking-[0.12em] sm:tracking-[0.15em] uppercase text-f1-faint shrink-0"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function StandingsRow({ s, index, max }) {
  const color = TEAM_COLORS[s.team] || "#888";
  const barW = Math.round((s.champ_pct / max) * 100);
  return (
    <motion.div
      className="flex items-center gap-2 sm:gap-4 py-3 border-b border-border last:border-0 px-3 -mx-3 sm:px-4 sm:-mx-4 rounded-sm hover:bg-surface-2 transition-colors cursor-default"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.6 + index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <span className="text-[10px] text-f1-faint w-5 shrink-0">
        P{index + 1}
      </span>
      <div
        className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0"
        style={{ background: color }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 sm:gap-2">
          <span className="font-display text-base sm:text-lg leading-none text-f1-text tracking-wider">
            {s.driver}
          </span>
          <span className="text-[10px] sm:text-[11px] text-f1-faint truncate">
            {s.name}
          </span>
        </div>
        <div className="mt-1.5 h-[2px] bg-surface-3 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${barW}%` }}
            transition={{
              duration: 0.8,
              delay: 0.8 + index * 0.07,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </div>
      </div>
      <div className="text-right shrink-0">
        <div
          className={cn(
            "font-display text-base sm:text-lg leading-none",
            index === 0 ? "text-red" : "text-f1-muted",
          )}
        >
          {s.champ_pct}%
        </div>
        <div className="text-[8px] sm:text-[9px] text-f1-faint mt-0.5">
          to win title
        </div>
      </div>
    </motion.div>
  );
}

function SectionHeader({ eyebrow, title }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [12, -12]);
  return (
    <motion.div
      ref={ref}
      className="mb-6 sm:mb-8"
      style={{ y }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-5 h-[2px] bg-red" />
        <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase text-red">
          {eyebrow}
        </span>
      </div>
      <h2 className="font-display text-4xl sm:text-5xl tracking-wider text-f1-text">
        {title}
      </h2>
    </motion.div>
  );
}

function Divider() {
  return (
    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
  );
}

// ── PAGE ──────────────────────────────────────────────────────
export default function Home() {
  const [standings, setStandings] = useState(FALLBACK);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    fetch(`${API}/api/championship`)
      .then((r) => r.json())
      .then((d) => {
        if (d.standings?.length) {
          setStandings(
            d.standings.slice(0, 6).map((s) => ({
              driver: s.driver,
              name: s.full_name?.split(" ").pop() || s.driver,
              team: s.team || "",
              champ_pct: s.champ_pct,
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  const max = standings[0]?.champ_pct || 1;

  return (
    <div className="relative bg-bg overflow-x-hidden">
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-red z-50 origin-left"
        style={{ scaleX }}
      />
      <div className="absolute inset-0 speed-lines-bg pointer-events-none" />
      <motion.div
        className="absolute top-0 left-0 w-[400px] sm:w-[700px] h-[400px] sm:h-[600px] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(232,0,45,0.07) 0%, transparent 65%)",
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── HERO ── */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start pt-10 sm:pt-16 pb-10 sm:pb-16 lg:min-h-[90vh]">
          <div className="flex flex-col justify-center">
            <motion.div
              className="flex items-center gap-2.5 mb-5 sm:mb-7"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-5 h-[2px] bg-red" />
              <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase text-red">
                2026 F1 Championship · AI Prediction Engine
              </span>
            </motion.div>

            <div className="overflow-hidden">
              <motion.h1
                className="font-display leading-[0.9] tracking-wider text-f1-text"
                style={{ fontSize: "clamp(44px, 8vw, 88px)" }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                PREDICT.
                <br />
                <span className="text-red">EXPLORE.</span>
                <br />
                DOMINATE.
              </motion.h1>
            </div>

            <motion.p
              className="text-f1-muted text-sm sm:text-[15px] leading-relaxed max-w-md mt-4 sm:mt-5 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              A machine learning system trained on 3 seasons of Formula 1 data.
              10,000 Monte Carlo simulations per season. Ask anything — get
              data-backed answers on every driver, team, and circuit.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-2.5 sm:gap-3 mb-7 sm:mb-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-red text-white font-display text-sm sm:text-[15px] tracking-[0.06em] rounded-sm hover:brightness-110 hover:shadow-[0_0_24px_rgba(232,0,45,0.4)] hover:-translate-y-0.5 transition-all duration-200"
              >
                Ask the AI <span className="opacity-60">→</span>
              </Link>
              <Link
                to="/drivers"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-transparent text-f1-text font-display text-sm sm:text-[15px] tracking-[0.06em] rounded-sm border border-border-2 hover:border-f1-muted hover:bg-surface-2 hover:-translate-y-0.5 transition-all duration-200"
              >
                Explore Drivers
              </Link>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-px border border-border rounded-sm overflow-hidden"
              style={{ background: "#242424" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.55 }}
            >
              {[
                { v: "10,000", l: "Simulations" },
                { v: "3", l: "Seasons Data" },
                { v: "22", l: "Drivers" },
                { v: "0.635", l: "CV MAE" },
              ].map(({ v, l }) => (
                <div
                  key={l}
                  className="flex flex-col items-center gap-1 py-3 sm:py-3.5 bg-surface"
                >
                  <span className="font-display text-lg sm:text-xl text-f1-text tracking-wider">
                    {v}
                  </span>
                  <span className="text-[8px] sm:text-[9px] tracking-[0.1em] uppercase text-f1-faint">
                    {l}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-1.5 mt-3 sm:mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.65 }}
            >
              {[
                "LightGBM",
                "FastAPI",
                "React",
                "Monte Carlo",
                "Jolpica API",
                "AWS Strands",
              ].map((s) => (
                <span
                  key={s}
                  className="text-[9px] sm:text-[10px] tracking-wide px-2 sm:px-2.5 py-1 rounded-sm border border-border bg-surface text-f1-faint"
                >
                  {s}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Standings panel */}
          <motion.div
            className="relative lg:sticky lg:top-24"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative rounded-sm border border-border bg-surface overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red via-red/40 to-transparent" />
              <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
                  <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.12em] uppercase text-f1-muted">
                    2026 Championship Probability
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-f1-faint">
                  10k simulations
                </span>
              </div>
              <div className="px-3 sm:px-4 py-1">
                {standings.slice(0, 6).map((s, i) => (
                  <StandingsRow key={s.driver} s={s} index={i} max={max} />
                ))}
              </div>
              <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-t border-border flex items-center justify-between gap-2">
                <span className="text-[9px] sm:text-[10px] text-f1-faint leading-tight">
                  Probability of winning the 2026 drivers' title
                </span>
                <Link
                  to="/chat"
                  className="text-[10px] sm:text-[11px] text-red hover:text-red/80 transition-colors shrink-0"
                >
                  Ask why →
                </Link>
              </div>
            </div>
            <div className="hidden sm:block absolute -top-3 -right-3 w-12 h-12 pointer-events-none">
              <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-red/30 to-transparent" />
              <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-red/30 to-transparent" />
            </div>
            <p className="mt-2.5 sm:mt-3 text-[9px] sm:text-[10px] text-f1-faint text-center">
              Not affiliated with FIA or Formula 1 Group
            </p>
          </motion.div>
        </div>
      </div>

      <Marquee items={TICKER_1} direction={1} speed={35} />

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── CHAMPIONS STRIP ── */}
        <div className="py-10 sm:py-14">
          <SectionHeader eyebrow="History" title="CHAMPIONS" />
          <div
            className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-2 -mx-1 px-1"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {RECENT_CHAMPIONS.map((c, i) => (
              <motion.div
                key={c.year}
                className="shrink-0 w-[110px] sm:w-[130px] rounded-sm border border-border bg-surface p-3 sm:p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-border-2 transition-colors cursor-default"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity"
                  style={{ background: c.color }}
                />
                <span className="font-display text-xl sm:text-2xl leading-none text-f1-faint">
                  {c.year}
                </span>
                <div>
                  <div className="text-sm sm:text-base leading-none mb-1">
                    {c.flag}
                  </div>
                  <div className="font-display text-[11px] sm:text-[12px] leading-tight tracking-wider text-f1-text">
                    {c.driver}
                  </div>
                  <div
                    className="text-[9px] mt-1 tracking-widest uppercase"
                    style={{ color: c.color }}
                  >
                    {c.team}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ── RECORDS ── */}
        <div className="py-10 sm:py-14">
          <SectionHeader eyebrow="All Time" title="RECORDS" />
          <p className="text-[10px] sm:text-[11px] text-f1-faint mb-4 -mt-4">
            Stats verified as of end of 2025 Abu Dhabi Grand Prix
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-sm overflow-hidden">
            {ALL_TIME_RECORDS.map((r, i) => (
              <motion.div
                key={r.label}
                className="bg-surface p-4 sm:p-5 flex flex-col gap-2 sm:gap-2.5 hover:bg-surface-2 transition-colors cursor-default"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <span className="text-base sm:text-lg">{r.icon}</span>
                <div>
                  <div className="font-display text-3xl sm:text-4xl leading-none text-f1-text tracking-wider mb-1">
                    <AnimatedCounter value={r.value} />
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-medium text-f1-muted mb-0.5">
                    {r.label}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-f1-faint">
                    {r.holder}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-f1-faint/50 mt-0.5">
                    {r.detail}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Marquee items={TICKER_2} direction={-1} speed={40} />

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── CONSTRUCTOR LEGACY — ALL 15 CHAMPIONS + CURRENT NON-WINNERS ── */}
        <div className="py-10 sm:py-14">
          <SectionHeader eyebrow="Every Constructor" title="LEGACY" />

          {/* Champions section */}
          <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.15em] uppercase text-f1-faint mb-3">
            15 Constructor Champions (since 1958)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5 mb-6">
            {CONSTRUCTOR_LEGACY.filter((c) => c.titles > 0).map((c, i) => (
              <motion.div
                key={c.team}
                className="relative rounded-sm border border-border bg-surface p-3 sm:p-4 overflow-hidden group hover:border-border-2 transition-colors cursor-default"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ background: c.color }}
                />
                <div className="flex items-start justify-between mb-1.5">
                  <div
                    className="font-display text-3xl sm:text-4xl leading-none"
                    style={{ color: c.color }}
                  >
                    {c.titles}
                  </div>
                  <span className="text-sm sm:text-base">{c.country}</span>
                </div>
                <div className="text-[11px] sm:text-[12px] font-medium text-f1-text mb-0.5">
                  {c.team}
                </div>
                <div className="text-[9px] sm:text-[10px] text-f1-faint">
                  {c.active ? `Last: ${c.last}` : `${c.last} · Defunct`}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Current teams with 0 titles */}
          <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.15em] uppercase text-f1-faint mb-3">
            Active 2026 Teams · No Constructor Title
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2.5">
            {CONSTRUCTOR_LEGACY.filter((c) => c.titles === 0).map((c, i) => (
              <motion.div
                key={c.team}
                className="relative rounded-sm border border-border bg-surface p-3 sm:p-4 overflow-hidden group hover:border-border-2 transition-colors cursor-default"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-30 group-hover:opacity-70 transition-opacity"
                  style={{ background: c.color }}
                />
                <div className="flex items-start justify-between mb-1.5">
                  <div className="font-display text-3xl leading-none text-surface-3">
                    0
                  </div>
                  <span className="text-sm">{c.country}</span>
                </div>
                <div className="text-[11px] sm:text-[12px] font-medium text-f1-text mb-0.5">
                  {c.team}
                </div>
                {c.note && (
                  <div className="text-[9px] text-f1-faint/60 mt-0.5">
                    {c.note}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ── DID YOU KNOW ── */}
        <div className="py-10 sm:py-14">
          <SectionHeader eyebrow="F1 Facts" title="DID YOU KNOW?" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border rounded-sm overflow-hidden">
            {DID_YOU_KNOW.map((f, i) => (
              <motion.div
                key={i}
                className="bg-surface p-5 sm:p-7 flex flex-col gap-2 sm:gap-3"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <div className="font-display text-4xl sm:text-5xl leading-none text-red tracking-wider">
                  {f.stat}
                </div>
                <div>
                  <div className="text-[13px] sm:text-[14px] text-f1-text font-medium leading-snug">
                    {f.label}
                  </div>
                  <div className="text-[11px] sm:text-[12px] text-f1-faint mt-1 sm:mt-1.5 leading-relaxed">
                    {f.sub}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <Divider />

        {/* ── HOW IT WORKS ── */}
        <div className="py-10 sm:py-14">
          <SectionHeader eyebrow="Under the Hood" title="HOW IT WORKS" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border rounded-sm overflow-hidden">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className="bg-surface p-5 sm:p-7 flex flex-col gap-2.5 sm:gap-3"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.1 }}
              >
                <span className="text-xl sm:text-2xl">{f.icon}</span>
                <div>
                  <h3 className="font-display text-lg sm:text-xl tracking-wider text-f1-text mb-1 sm:mb-1.5">
                    {f.title}
                  </h3>
                  <p className="text-[12px] sm:text-[13px] text-f1-muted leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM CTA ── */}
        <motion.div
          className="mb-12 sm:mb-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5 p-5 sm:p-7 rounded-sm border border-border bg-surface relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-red/50 via-red/20 to-transparent" />
          <div>
            <h3 className="font-display text-2xl sm:text-3xl tracking-wider text-f1-text">
              READY TO EXPLORE?
            </h3>
            <p className="text-f1-muted text-[12px] sm:text-sm mt-1">
              Browse every driver, every circuit, or just ask the AI.
            </p>
          </div>
          <div className="flex gap-2 sm:gap-2.5 w-full sm:w-auto">
            <Link
              to="/drivers"
              className="flex-1 sm:flex-none text-center px-4 sm:px-5 py-2.5 font-display text-[12px] sm:text-[13px] tracking-[0.08em] rounded-sm border border-border-2 text-f1-text hover:bg-surface-2 transition-all"
            >
              Drivers
            </Link>
            <Link
              to="/races"
              className="flex-1 sm:flex-none text-center px-4 sm:px-5 py-2.5 font-display text-[12px] sm:text-[13px] tracking-[0.08em] rounded-sm border border-border-2 text-f1-text hover:bg-surface-2 transition-all"
            >
              Races
            </Link>
            <Link
              to="/chat"
              className="flex-1 sm:flex-none text-center px-4 sm:px-5 py-2.5 font-display text-[12px] sm:text-[13px] tracking-[0.08em] rounded-sm bg-red text-white hover:brightness-110 transition-all"
            >
              Ask AI
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
