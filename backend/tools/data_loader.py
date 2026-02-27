# ================================================================
# SHARED DATA LOADER — all agents import from here
# ================================================================
import pickle
import numpy as np
import pandas as pd
from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

# ── Load simulation data ─────────────────────────────────────────
SIM_PATH = Path(os.getenv("SIM_DATA_PATH", "../data/predictions/sim_data.pkl"))

with open(SIM_PATH, "rb") as f:
    sim_data = pickle.load(f)

DRIVERS          = sim_data["drivers"]
ROUNDS           = sim_data["rounds"]
RACE_NAMES       = sim_data["race_names"]        # {round: name}
POS_DIST         = sim_data["pos_distribution"]  # (22, 24, 20)
SIM_POINTS       = sim_data["sim_points"]        # (10000, 22)
SIM_WINS         = sim_data["sim_wins"]
N_SIMS           = sim_data["N_SIMULATIONS"]

POINTS_MAP = {1:25, 2:18, 3:15, 4:12, 5:10, 6:8, 7:6, 8:4, 9:2, 10:1}

# ── Pull team map directly from 2026 features ───────────────────
FEATURES_2026_PATH = Path(os.getenv("FEATURES_2026_PATH", "../data/features_2026.csv"))
df_2026 = pd.read_csv(FEATURES_2026_PATH)
TEAM_MAP = dict(zip(df_2026['driver'], df_2026['team_2026']))


# ── Pull driver names from 2025 race results ─────────────────────
RESULTS_PATH = Path(os.getenv("RESULTS_PATH", "../data/race_results_2025.csv"))
df_results = pd.read_csv(RESULTS_PATH)
DRIVER_NAMES = dict(zip(df_results['driver'], df_results['driver_name']))

# ── Add manually only what's missing (BOT, PER from 2024) ────────
DRIVER_NAMES.update({
    "BOT": "Valtteri Bottas",
    "PER": "Sergio Perez",
    "LIN": "Arvid Lindblad",   # rookie, not in 2025 data
})

# ── Championship winner per simulation ───────────────────────────
def get_champ_winners():
    return np.argmax(SIM_POINTS, axis=1)

CHAMP_WINNERS = get_champ_winners()

# ── Fuzzy driver match ───────────────────────────────────────────
def find_driver(query: str) -> str | None:
    q = query.upper().strip()
    if q in DRIVERS:
        return q
    for code, name in DRIVER_NAMES.items():
        if q in name.upper() or name.upper().split()[0] in q:
            return code
    for d in DRIVERS:
        if q[:3] in d:
            return d
    return None

def find_race(query: str) -> tuple[int | None, str | None]:
    q = query.strip()
    for rnd, name in RACE_NAMES.items():
        if q.lower() == name.lower():
            return rnd, name
    return None, None