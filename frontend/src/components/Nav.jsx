import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

const links = [
  { to: "/drivers", label: "Drivers" },
  { to: "/races", label: "Races" },
  { to: "/chat", label: "AI Chat" },
  { to: "/about", label: "About" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-[60px] transition-all duration-200",
        scrolled
          ? "bg-bg/90 backdrop-blur-xl border-b border-border"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="max-w-[1280px] mx-auto px-8 flex items-center gap-10 h-full">
        {/* Logo */}
        <NavLink to="/" className="flex items-baseline shrink-0 group">
          <span className="font-display text-xl tracking-wider text-f1-text">
            POLE
          </span>
          <span className="font-display text-xl tracking-wider text-f1-muted">
            POSITION
          </span>
          <span className="font-display text-[12px] tracking-widest text-red ml-1.5 px-1.5 py-0.5 border border-red rounded-sm transition-colors group-hover:bg-red group-hover:text-white">
            AI
          </span>
        </NavLink>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1 flex-1 list-none m-0 p-0">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to}>
                {({ isActive }) => (
                  <span
                    className={cn(
                      "relative inline-block px-3 py-1.5 text-[12px] font-medium tracking-[0.08em] uppercase transition-colors duration-100",
                      isActive
                        ? "text-f1-text"
                        : "text-f1-muted hover:text-f1-text",
                    )}
                  >
                    {label}
                    <span
                      className={cn(
                        "absolute bottom-0 left-3 right-3 h-[2px] bg-red rounded-full transition-transform duration-200 origin-left",
                        isActive ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <NavLink
          to="/chat"
          className="hidden md:inline-flex items-center gap-2 ml-auto px-5 py-2 bg-red text-white font-display text-[13px] tracking-[0.08em] rounded-sm transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_24px_rgba(232,0,45,0.4)]"
        >
          Ask AI
        </NavLink>

        {/* Mobile burger */}
        <button
          className="md:hidden ml-auto flex flex-col gap-[5px] p-2 bg-transparent border-none cursor-pointer"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className={cn(
              "block w-[22px] h-[2px] bg-f1-text rounded transition-all duration-200 origin-center",
              menuOpen && "translate-y-[7px] rotate-45",
            )}
          />
          <span
            className={cn(
              "block w-[22px] h-[2px] bg-f1-text rounded transition-all duration-200",
              menuOpen && "opacity-0",
            )}
          />
          <span
            className={cn(
              "block w-[22px] h-[2px] bg-f1-text rounded transition-all duration-200 origin-center",
              menuOpen && "-translate-y-[7px] -rotate-45",
            )}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden flex flex-col bg-surface border-b border-border overflow-hidden transition-all duration-300",
          menuOpen ? "max-h-80" : "max-h-0",
        )}
      >
        {links.map(({ to, label }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <span
                className={cn(
                  "block px-6 py-4 text-[12px] font-medium tracking-[0.08em] uppercase border-b border-border transition-all duration-100",
                  isActive
                    ? "text-red bg-surface-2"
                    : "text-f1-muted hover:text-f1-text hover:bg-surface-2",
                )}
              >
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
