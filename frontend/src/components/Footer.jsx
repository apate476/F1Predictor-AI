import { NavLink } from "react-router-dom";

const links = [
  { to: "/drivers", label: "Drivers" },
  { to: "/races", label: "Races" },
  { to: "/chat", label: "AI Chat" },
  { to: "/about", label: "About" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="max-w-[1280px] mx-auto px-8 py-7 grid grid-cols-1 md:grid-cols-3 items-center gap-6">
        {/* Left */}
        <div className="flex flex-col gap-1">
          <span className="font-display text-sm tracking-[0.1em] text-f1-text">
            POLEPOSITION AI
          </span>
          <p className="text-[11px] text-f1-faint tracking-wide">
            2026 F1 Championship Predictions · 10,000 Monte Carlo simulations
          </p>
        </div>

        {/* Center links */}
        <nav className="flex items-center justify-center gap-6 flex-wrap">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className="text-[11px] font-medium tracking-[0.08em] uppercase text-f1-faint hover:text-f1-muted transition-colors duration-100"
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right */}
        <div className="md:text-right">
          <span className="text-[10px] text-f1-faint tracking-wide">
            Not affiliated with FIA or Formula 1
          </span>
        </div>
      </div>

      {/* Racing stripe */}
      <div className="flex h-[3px]">
        <div className="flex-[2] bg-red" />
        <div className="flex-[1] bg-white/10" />
        <div className="flex-[3] bg-surface-2" />
      </div>
    </footer>
  );
}
