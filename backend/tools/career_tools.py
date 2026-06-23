"""
career_tools.py
Fetches career stats from the Jolpica F1 API (free, no auth required).
Aggregates: wins, podiums, poles, fastest laps, points, starts, DNFs, championships.
Results are cached in memory — career stats don't change mid-session.
"""

import httpx
import asyncio
from functools import lru_cache
from typing import Optional

# ── JOLPICA BASE URL ──────────────────────────────────────────
BASE = "https://api.jolpi.ca/ergast/f1"

# ── DRIVER CODE → JOLPICA ID MAP ─────────────────────────────
# Jolpica uses full surname slugs, not 3-letter codes
DRIVER_ID_MAP = {
    "LEC": "leclerc",
    "HAM": "hamilton",
    "NOR": "norris",
    "PIA": "piastri",
    "RUS": "russell",
    "VER": "verstappen",
    "ANT": "antonelli",
    "HAD": "hadjar",
    "ALO": "alonso",
    "STR": "stroll",
    "GAS": "gasly",
    "COL": "colapinto",
    "ALB": "albon",
    "SAI": "sainz",
    "HUL": "hulkenberg",
    "BOR": "bortoleto",
    "OCO": "ocon",
    "BEA": "bearman",
    "LAW": "lawson",
    "BOT": "bottas",
    "PER": "perez",
    "LIN": "lindblad",
}

# ── DRIVER METADATA (DOB, nationality, number, debut year) ────
# Sourced from f1.com / Wikipedia — hardcoded as it rarely changes
DRIVER_META = {
    "LEC": {"number": 16, "nationality": "Monégasque", "dob": "1997-10-16", "debut": 2018, "name": "Charles Leclerc"},
    "HAM": {"number": 44, "nationality": "British",    "dob": "1985-01-07", "debut": 2007, "name": "Lewis Hamilton"},
    "NOR": {"number": 4,  "nationality": "British",    "dob": "1999-11-13", "debut": 2019, "name": "Lando Norris"},
    "PIA": {"number": 81, "nationality": "Australian", "dob": "2001-04-06", "debut": 2023, "name": "Oscar Piastri"},
    "RUS": {"number": 63, "nationality": "British",    "dob": "1998-02-15", "debut": 2019, "name": "George Russell"},
    "VER": {"number": 1,  "nationality": "Dutch",      "dob": "1997-09-30", "debut": 2015, "name": "Max Verstappen"},
    "ANT": {"number": 12, "nationality": "Italian",    "dob": "2006-08-25", "debut": 2025, "name": "Kimi Antonelli"},
    "HAD": {"number": 22, "nationality": "French",     "dob": "2004-09-28", "debut": 2025, "name": "Isack Hadjar"},
    "ALO": {"number": 14, "nationality": "Spanish",    "dob": "1981-07-29", "debut": 2001, "name": "Fernando Alonso"},
    "STR": {"number": 18, "nationality": "Canadian",   "dob": "1998-10-29", "debut": 2017, "name": "Lance Stroll"},
    "GAS": {"number": 10, "nationality": "French",     "dob": "1996-02-07", "debut": 2017, "name": "Pierre Gasly"},
    "COL": {"number": 43, "nationality": "Argentine",  "dob": "2003-09-27", "debut": 2024, "name": "Franco Colapinto"},
    "ALB": {"number": 23, "nationality": "Thai",       "dob": "1996-03-23", "debut": 2019, "name": "Alexander Albon"},
    "SAI": {"number": 55, "nationality": "Spanish",    "dob": "1994-09-01", "debut": 2015, "name": "Carlos Sainz"},
    "HUL": {"number": 27, "nationality": "German",     "dob": "1987-08-19", "debut": 2010, "name": "Nico Hülkenberg"},
    "BOR": {"number": 5,  "nationality": "Brazilian",  "dob": "2004-10-14", "debut": 2025, "name": "Gabriel Bortoleto"},
    "OCO": {"number": 31, "nationality": "French",     "dob": "1996-09-17", "debut": 2016, "name": "Esteban Ocon"},
    "BEA": {"number": 87, "nationality": "British",    "dob": "2005-05-08", "debut": 2024, "name": "Oliver Bearman"},
    "LAW": {"number": 30, "nationality": "New Zealander","dob": "2002-02-11","debut": 2023, "name": "Liam Lawson"},
    "BOT": {"number": 77, "nationality": "Finnish",    "dob": "1989-08-28", "debut": 2013, "name": "Valtteri Bottas"},
    "PER": {"number": 11, "nationality": "Mexican",    "dob": "1990-01-26", "debut": 2011, "name": "Sergio Perez"},
    "LIN": {"number": 6,  "nationality": "British",    "dob": "2007-05-06", "debut": 2026, "name": "Arvid Lindblad"},
}

# ── IN-MEMORY CACHE ───────────────────────────────────────────
_career_cache: dict = {}

async def fetch_json(client: httpx.AsyncClient, url: str) -> dict:
    """Fetch JSON from Jolpica with timeout and error handling."""
    try:
        r = await client.get(url, timeout=10.0)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        print(f"[career_tools] fetch error: {url} → {e}")
        return {}

async def get_career_stats(driver_code: str) -> Optional[dict]:
    """
    Fetch and aggregate career stats for a driver from Jolpica.
    Returns cached result if available.
    """
    code = driver_code.upper()

    # Return cached if available
    if code in _career_cache:
        return _career_cache[code]

    jolpica_id = DRIVER_ID_MAP.get(code)
    meta = DRIVER_META.get(code, {})

    # Rookies with no Jolpica data yet
    if not jolpica_id or meta.get("debut", 2026) >= 2026:
        result = _rookie_stats(code, meta)
        _career_cache[code] = result
        return result

    async with httpx.AsyncClient() as client:
        # Fetch race results (up to 1000) and qualifying results in parallel
        results_url = f"{BASE}/drivers/{jolpica_id}/results.json?limit=1000"
        quali_url   = f"{BASE}/drivers/{jolpica_id}/qualifying.json?limit=1000"
        champ_url   = f"{BASE}/drivers/{jolpica_id}/driverStandings/1.json"  # seasons they finished P1

        results_data, quali_data, champ_data = await asyncio.gather(
            fetch_json(client, results_url),
            fetch_json(client, quali_url),
            fetch_json(client, champ_url),
        )

    # ── Aggregate race results ────────────────────────────────
    races      = _extract_races(results_data)
    wins       = sum(1 for r in races if r.get("position") == "1")
    podiums    = sum(1 for r in races if r.get("position") in ("1", "2", "3"))
    points_sum = sum(float(r.get("points", 0)) for r in races)
    starts     = len(races)
    dnfs       = sum(
        1 for r in races
        if r.get("status", "").lower() not in ("finished",)
        and not r.get("status", "").startswith("+")
    )
    fastest_laps = sum(
        1 for r in races
        if r.get("FastestLap", {}).get("rank") == "1"
    )

    # ── Aggregate qualifying (pole = P1) ──────────────────────
    quali_races = _extract_quali(quali_data)
    poles = sum(1 for q in quali_races if q.get("position") == "1")

    # ── Championships ─────────────────────────────────────────
    seasons_p1 = _extract_seasons(champ_data)
    championships = len(seasons_p1)

    result = {
        "code":          code,
        "name":          meta.get("name", code),
        "number":        meta.get("number"),
        "nationality":   meta.get("nationality", "Unknown"),
        "dob":           meta.get("dob"),
        "debut":         meta.get("debut"),
        # Career stats
        "championships": championships,
        "wins":          wins,
        "podiums":       podiums,
        "poles":         poles,
        "fastest_laps":  fastest_laps,
        "points":        round(points_sum, 1),
        "starts":        starts,
        "dnfs":          dnfs,
        "win_rate":      round(wins / starts * 100, 1) if starts > 0 else 0,
        "podium_rate":   round(podiums / starts * 100, 1) if starts > 0 else 0,
    }

    _career_cache[code] = result
    return result


def _rookie_stats(code: str, meta: dict) -> dict:
    """Return zeroed stats for rookies with no Jolpica history."""
    return {
        "code":          code,
        "name":          meta.get("name", code),
        "number":        meta.get("number"),
        "nationality":   meta.get("nationality", "Unknown"),
        "dob":           meta.get("dob"),
        "debut":         meta.get("debut"),
        "championships": 0,
        "wins":          0,
        "podiums":       0,
        "poles":         0,
        "fastest_laps":  0,
        "points":        0.0,
        "starts":        0,
        "dnfs":          0,
        "win_rate":      0,
        "podium_rate":   0,
    }


def _extract_races(data: dict) -> list:
    try:
        return data["MRData"]["RaceTable"]["Races"]
    except (KeyError, TypeError):
        return []

    # Flatten results from each race
    flat = []
    for race in _extract_races(data):
        for res in race.get("Results", []):
            flat.append(res)
    return flat


def _extract_races(data: dict) -> list:
    """Extract flat list of result objects from Jolpica race response."""
    try:
        races = data["MRData"]["RaceTable"]["Races"]
    except (KeyError, TypeError):
        return []
    flat = []
    for race in races:
        for res in race.get("Results", []):
            flat.append(res)
    return flat


def _extract_quali(data: dict) -> list:
    """Extract flat list of qualifying objects from Jolpica quali response."""
    try:
        races = data["MRData"]["RaceTable"]["Races"]
    except (KeyError, TypeError):
        return []
    flat = []
    for race in races:
        for res in race.get("QualifyingResults", []):
            flat.append(res)
    return flat


def _extract_seasons(data: dict) -> list:
    """Extract list of seasons where driver finished P1 in championship."""
    try:
        standings = data["MRData"]["StandingsTable"]["StandingsLists"]
        return [s["season"] for s in standings]
    except (KeyError, TypeError):
        return []


def clear_cache():
    """Clear the career cache (e.g. after a race weekend)."""
    global _career_cache
    _career_cache = {}