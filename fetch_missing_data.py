"""
Fetches complete race results, qualifying, and pit stop data for 2023 and 2024.
Only fetches rounds that are missing from the existing CSV files.

Run from the f1-predictor directory:
    python fetch_missing_data.py
"""

import time
import requests
import pandas as pd
from pathlib import Path

DATA_DIR = Path("data")
DELAY    = 1.5   # seconds between API calls — stays well under rate limit

# ── Helpers ───────────────────────────────────────────────────────────────────

def get(url, retries=3):
    for attempt in range(retries):
        try:
            r = requests.get(url, timeout=20)
            r.raise_for_status()
            return r.json()
        except requests.exceptions.HTTPError as e:
            if r.status_code == 429:
                wait = 10 * (attempt + 1)
                print(f"    Rate limited — waiting {wait}s...")
                time.sleep(wait)
            else:
                raise
    raise RuntimeError(f"Failed after {retries} retries: {url}")

# ── Race results ──────────────────────────────────────────────────────────────

def fetch_race_results_round(year, rnd):
    data = get(f"https://api.jolpi.ca/ergast/f1/{year}/{rnd}/results.json")
    races = data["MRData"]["RaceTable"]["Races"]
    if not races:
        return pd.DataFrame()
    race = races[0]
    rows = []
    for res in race["Results"]:
        grid = int(res.get("grid", 0))
        rows.append({
            "year"            : year,
            "round"           : int(race["round"]),
            "race_name"       : race["raceName"],
            "circuit"         : race["Circuit"]["circuitName"],
            "date"            : race["date"],
            "driver"          : res["Driver"].get("code", res["Driver"]["driverId"][:3].upper()),
            "driver_name"     : res["Driver"]["givenName"] + " " + res["Driver"]["familyName"],
            "team"            : res["Constructor"]["name"],
            "grid_position"   : grid if grid > 0 else 20,
            "finish_position" : int(res["position"]),
            "points"          : float(res["points"]),
            "status"          : res["status"],
            "laps_completed"  : int(res["laps"]),
            "fastest_lap_rank": int(res["FastestLap"]["rank"]) if "FastestLap" in res else None,
        })
    return pd.DataFrame(rows)

# ── Qualifying ────────────────────────────────────────────────────────────────

def fetch_qualifying_round(year, rnd):
    data = get(f"https://api.jolpi.ca/ergast/f1/{year}/{rnd}/qualifying.json")
    races = data["MRData"]["RaceTable"]["Races"]
    if not races:
        return pd.DataFrame()
    race = races[0]
    rows = []
    for res in race["QualifyingResults"]:
        rows.append({
            "year"          : year,
            "round"         : int(race["round"]),
            "race_name"     : race["raceName"],
            "driver"        : res["Driver"].get("code", res["Driver"]["driverId"][:3].upper()),
            "driver_name"   : res["Driver"]["givenName"] + " " + res["Driver"]["familyName"],
            "team"          : res["Constructor"]["name"],
            "quali_position": int(res["position"]),
        })
    return pd.DataFrame(rows)

# ── Pit stops ─────────────────────────────────────────────────────────────────

def fetch_pitstops_round(year, rnd):
    data = get(f"https://api.jolpi.ca/ergast/f1/{year}/{rnd}/pitstops.json?limit=100")
    races = data["MRData"]["RaceTable"]["Races"]
    if not races or "PitStops" not in races[0]:
        return pd.DataFrame()
    race = races[0]
    rows = []
    for ps in race["PitStops"]:
        rows.append({
            "year"    : year,
            "round"   : int(race["round"]),
            "driver"  : ps["driverId"],
            "lap"     : int(ps["lap"]),
            "stop"    : int(ps["stop"]),
            "duration": ps["duration"],
        })
    return pd.DataFrame(rows)

# ── Total rounds per year ─────────────────────────────────────────────────────

TOTAL_ROUNDS = {2023: 22, 2024: 24}

# ── Main ──────────────────────────────────────────────────────────────────────

def fill_missing(year):
    print(f"\n{'='*50}")
    print(f"  Year {year}")
    print(f"{'='*50}")

    # Load existing files
    rr_path = DATA_DIR / f"race_results_{year}.csv"
    qq_path = DATA_DIR / f"qualifying_{year}.csv"
    pp_path = DATA_DIR / f"pitstops_{year}.csv"

    df_rr = pd.read_csv(rr_path) if rr_path.exists() else pd.DataFrame()
    df_qq = pd.read_csv(qq_path) if qq_path.exists() else pd.DataFrame()
    df_pp = pd.read_csv(pp_path) if pp_path.exists() else pd.DataFrame()

    existing_rr = set(df_rr["round"].unique()) if "round" in df_rr.columns else set()
    existing_qq = set(df_qq["round"].unique()) if "round" in df_qq.columns else set()
    existing_pp = set(df_pp["round"].unique()) if "round" in df_pp.columns else set()

    all_rounds = set(range(1, TOTAL_ROUNDS[year] + 1))
    missing_rr = sorted(all_rounds - existing_rr)
    missing_qq = sorted(all_rounds - existing_qq)
    missing_pp = sorted(all_rounds - existing_pp)

    print(f"  Race results missing : {missing_rr}")
    print(f"  Qualifying missing   : {missing_qq}")
    print(f"  Pit stops missing    : {missing_pp}")

    new_rr, new_qq, new_pp = [], [], []

    all_missing = sorted(set(missing_rr) | set(missing_qq) | set(missing_pp))
    for rnd in all_missing:
        print(f"  Round {rnd}/{TOTAL_ROUNDS[year]}...", end=" ", flush=True)

        if rnd in missing_rr:
            df = fetch_race_results_round(year, rnd)
            if not df.empty:
                new_rr.append(df)
            time.sleep(DELAY)

        if rnd in missing_qq:
            df = fetch_qualifying_round(year, rnd)
            if not df.empty:
                new_qq.append(df)
            time.sleep(DELAY)

        if rnd in missing_pp:
            df = fetch_pitstops_round(year, rnd)
            if not df.empty:
                new_pp.append(df)
            time.sleep(DELAY)

        print("✅")

    # Append and save
    if new_rr:
        df_rr = pd.concat([df_rr] + new_rr, ignore_index=True).sort_values(["round", "finish_position"])
        df_rr.to_csv(rr_path, index=False)
        print(f"  Saved race_results_{year}.csv — {df_rr['round'].nunique()} rounds")

    if new_qq:
        df_qq = pd.concat([df_qq] + new_qq, ignore_index=True).sort_values(["round", "quali_position"])
        df_qq.to_csv(qq_path, index=False)
        print(f"  Saved qualifying_{year}.csv — {df_qq['round'].nunique()} rounds")

    if new_pp:
        df_pp = pd.concat([df_pp] + new_pp, ignore_index=True).sort_values(["round"])
        df_pp.to_csv(pp_path, index=False)
        print(f"  Saved pitstops_{year}.csv — {df_pp['round'].nunique()} rounds")


if __name__ == "__main__":
    fill_missing(2023)
    fill_missing(2024)
    print("\n✅ Done. Now re-run 02_feature_engineering.ipynb from the multi-year cell.")
