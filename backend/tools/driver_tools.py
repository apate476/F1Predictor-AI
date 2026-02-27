from strands import tool
from .data_loader import (
    DRIVERS, ROUNDS, RACE_NAMES, POS_DIST, SIM_POINTS,
    SIM_WINS, N_SIMS, TEAM_MAP, DRIVER_NAMES, CHAMP_WINNERS, find_driver
)
import numpy as np

@tool
def get_driver_profile(driver: str) -> dict:
    """
    Returns complete season profile for a driver.
    Includes points outlook, championship probability, best/worst circuits.
    Driver can be code (LEC) or full name (Leclerc, Charles).
    """
    d = find_driver(driver)
    if not d:
        return {"error": f"Driver '{driver}' not found", "available": DRIVERS}

    i = DRIVERS.index(d)
    pts = SIM_POINTS[:, i]
    champ_wins = int(np.sum(CHAMP_WINNERS == i))

    circuit_stats = []
    for r_idx, rnd in enumerate(ROUNDS):
        probs = POS_DIST[i, r_idx, :] / N_SIMS * 100
        circuit_stats.append({
            "race"       : RACE_NAMES[rnd],
            "round"      : rnd,
            "win_pct"    : round(float(probs[0]), 1),
            "podium_pct" : round(float(sum(probs[:3])), 1),
            "points_pct" : round(float(sum(probs[:10])), 1),
            "likely_pos" : int(probs.argmax()) + 1,
        })

    circuit_stats.sort(key=lambda x: x["win_pct"], reverse=True)

    return {
        "driver"         : d,
        "full_name"      : DRIVER_NAMES.get(d, d),
        "team"           : TEAM_MAP.get(d, "Unknown"),
        "avg_points"     : round(float(pts.mean()), 1),
        "champ_pct"      : round(champ_wins / N_SIMS * 100, 1),
        "win_pct"        : round(float(SIM_WINS[i]) / (N_SIMS * 24) * 100, 1),
        "min_points"     : round(float(pts.min()), 0),
        "max_points"     : round(float(pts.max()), 0),
        "std"            : round(float(pts.std()), 1),
        "best_circuits"  : circuit_stats[:5],
        "worst_circuits" : circuit_stats[-5:][::-1],
        "all_circuits"   : circuit_stats,
    }


@tool
def compare_drivers(driver1: str, driver2: str) -> dict:
    """
    Head to head comparison of two drivers across all metrics and every circuit.
    Drivers can be codes or full names.
    """
    d1 = find_driver(driver1)
    d2 = find_driver(driver2)

    if not d1:
        return {"error": f"Driver '{driver1}' not found"}
    if not d2:
        return {"error": f"Driver '{driver2}' not found"}

    i1, i2 = DRIVERS.index(d1), DRIVERS.index(d2)
    pts1, pts2 = SIM_POINTS[:, i1], SIM_POINTS[:, i2]

    champ1 = int(np.sum(CHAMP_WINNERS == i1))
    champ2 = int(np.sum(CHAMP_WINNERS == i2))
    d1_beats_d2 = round(float(np.sum(pts1 > pts2)) / N_SIMS * 100, 1)

    circuit_comparison = []
    for r_idx, rnd in enumerate(ROUNDS):
        p1 = POS_DIST[i1, r_idx, :] / N_SIMS * 100
        p2 = POS_DIST[i2, r_idx, :] / N_SIMS * 100
        circuit_comparison.append({
            "race"       : RACE_NAMES[rnd],
            "round"      : rnd,
            "d1_win_pct" : round(float(p1[0]), 1),
            "d2_win_pct" : round(float(p2[0]), 1),
            "d1_podium"  : round(float(sum(p1[:3])), 1),
            "d2_podium"  : round(float(sum(p2[:3])), 1),
            "d1_likely"  : int(p1.argmax()) + 1,
            "d2_likely"  : int(p2.argmax()) + 1,
            "advantage"  : d1 if p1[0] > p2[0] else d2,
        })

    return {
        "driver1": {
            "code"       : d1,
            "full_name"  : DRIVER_NAMES.get(d1, d1),
            "team"       : TEAM_MAP.get(d1, "Unknown"),
            "avg_points" : round(float(pts1.mean()), 1),
            "champ_pct"  : round(champ1 / N_SIMS * 100, 1),
            "win_pct"    : round(float(SIM_WINS[i1]) / (N_SIMS * 24) * 100, 1),
            "min_points" : round(float(pts1.min()), 0),
            "max_points" : round(float(pts1.max()), 0),
        },
        "driver2": {
            "code"       : d2,
            "full_name"  : DRIVER_NAMES.get(d2, d2),
            "team"       : TEAM_MAP.get(d2, "Unknown"),
            "avg_points" : round(float(pts2.mean()), 1),
            "champ_pct"  : round(champ2 / N_SIMS * 100, 1),
            "win_pct"    : round(float(SIM_WINS[i2]) / (N_SIMS * 24) * 100, 1),
            "min_points" : round(float(pts2.min()), 0),
            "max_points" : round(float(pts2.max()), 0),
        },
        "d1_beats_d2_pct"    : d1_beats_d2,
        "circuit_comparison" : circuit_comparison,
    }