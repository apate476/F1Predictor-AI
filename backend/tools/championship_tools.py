from strands import tool
from .data_loader import (
    DRIVERS, RACE_NAMES, SIM_POINTS, SIM_WINS,
    N_SIMS, TEAM_MAP, DRIVER_NAMES, CHAMP_WINNERS
)
import numpy as np

@tool
def get_championship_standings() -> dict:
    """
    Returns the full 2026 predicted drivers championship standings.
    Includes avg points, championship win %, race win %, floor and ceiling.
    """
    results = []
    for i, driver in enumerate(DRIVERS):
        champ_wins = int(np.sum(CHAMP_WINNERS == i))
        results.append({
            "position"   : 0,
            "driver"     : driver,
            "full_name"  : DRIVER_NAMES.get(driver, driver),
            "team"       : TEAM_MAP.get(driver, "Unknown"),
            "avg_points" : round(float(SIM_POINTS[:, i].mean()), 1),
            "champ_pct"  : round(champ_wins / N_SIMS * 100, 1),
            "win_pct"    : round(float(SIM_WINS[i]) / (N_SIMS * 24) * 100, 1),
            "min_points" : round(float(SIM_POINTS[:, i].min()), 0),
            "max_points" : round(float(SIM_POINTS[:, i].max()), 0),
            "std"        : round(float(SIM_POINTS[:, i].std()), 1),
        })

    results.sort(key=lambda x: x["avg_points"], reverse=True)
    for i, r in enumerate(results):
        r["position"] = i + 1

    return {"standings": results}


@tool
def get_constructors_standings() -> dict:
    """
    Returns the 2026 predicted constructors championship standings.
    """
    team_points = {}
    team_wins   = {}

    for i, driver in enumerate(DRIVERS):
        team = TEAM_MAP.get(driver, "Unknown")
        if team not in team_points:
            team_points[team] = np.zeros(N_SIMS)
            team_wins[team]   = 0
        team_points[team] += SIM_POINTS[:, i]
        team_wins[team]   += int(SIM_WINS[i])

    stacked = np.stack(list(team_points.values()), axis=1)
    team_champ_idx = np.argmax(stacked, axis=1)
    team_list = list(team_points.keys())

    results = []
    for idx, team in enumerate(team_list):
        pts = team_points[team]
        champ_count = int(np.sum(team_champ_idx == idx))
        results.append({
            "team"       : team,
            "avg_points" : round(float(pts.mean()), 1),
            "champ_pct"  : round(champ_count / N_SIMS * 100, 1),
            "min_points" : round(float(pts.min()), 0),
            "max_points" : round(float(pts.max()), 0),
            "drivers"    : [d for d in DRIVERS if TEAM_MAP.get(d) == team],
        })

    results.sort(key=lambda x: x["avg_points"], reverse=True)
    for i, r in enumerate(results):
        r["position"] = i + 1

    return {"constructors": results}


@tool
def get_title_contenders() -> dict:
    """
    Returns drivers with a realistic championship probability > 0%.
    """
    contenders = []
    for i, driver in enumerate(DRIVERS):
        champ_wins = int(np.sum(CHAMP_WINNERS == i))
        if champ_wins > 0:
            contenders.append({
                "driver"     : driver,
                "full_name"  : DRIVER_NAMES.get(driver, driver),
                "team"       : TEAM_MAP.get(driver, "Unknown"),
                "champ_pct"  : round(champ_wins / N_SIMS * 100, 1),
                "avg_points" : round(float(SIM_POINTS[:, i].mean()), 1),
                "win_pct"    : round(float(SIM_WINS[i]) / (N_SIMS * 24) * 100, 1),
            })

    contenders.sort(key=lambda x: x["champ_pct"], reverse=True)
    return {"contenders": contenders}