from strands import tool
from .data_loader import (
    DRIVERS, ROUNDS, RACE_NAMES, POS_DIST,
    N_SIMS, TEAM_MAP, DRIVER_NAMES, find_driver, find_race
)
import numpy as np

@tool
def get_race_winner_probs(race: str) -> dict:
    """
    Returns win/podium/points probabilities for ALL drivers at a specific race.
    Race must be full GP name e.g. "Monaco Grand Prix".
    """
    rnd, race_name = find_race(race)
    if not rnd:
        return {"error": f"Race '{race}' not found", "available": list(RACE_NAMES.values())}

    r_idx = ROUNDS.index(rnd)
    results = []

    for i, driver in enumerate(DRIVERS):
        probs = POS_DIST[i, r_idx, :] / N_SIMS * 100
        results.append({
            "driver"     : driver,
            "full_name"  : DRIVER_NAMES.get(driver, driver),
            "team"       : TEAM_MAP.get(driver, "Unknown"),
            "win_pct"    : round(float(probs[0]), 1),
            "podium_pct" : round(float(sum(probs[:3])), 1),
            "points_pct" : round(float(sum(probs[:10])), 1),
            "likely_pos" : int(probs.argmax()) + 1,
            "pos_probs"  : [round(float(p), 1) for p in probs],
        })

    results.sort(key=lambda x: x["win_pct"], reverse=True)
    for i, r in enumerate(results):
        r["position"] = i + 1

    return {"race": race_name, "round": rnd, "drivers": results}


@tool
def get_race_prediction(driver: str, race: str) -> dict:
    """
    Returns detailed probability breakdown for one driver at one race.
    Driver can be code or name. Race must be full GP name e.g. "Monaco Grand Prix".
    """
    d = find_driver(driver)
    if not d:
        return {"error": f"Driver '{driver}' not found"}

    rnd, race_name = find_race(race)
    if not rnd:
        return {"error": f"Race '{race}' not found"}

    d_idx = DRIVERS.index(d)
    r_idx = ROUNDS.index(rnd)
    probs = POS_DIST[d_idx, r_idx, :] / N_SIMS * 100

    return {
        "driver"     : d,
        "full_name"  : DRIVER_NAMES.get(d, d),
        "team"       : TEAM_MAP.get(d, "Unknown"),
        "race"       : race_name,
        "round"      : rnd,
        "win_pct"    : round(float(probs[0]), 1),
        "podium_pct" : round(float(sum(probs[:3])), 1),
        "points_pct" : round(float(sum(probs[:10])), 1),
        "likely_pos" : int(probs.argmax()) + 1,
        "pos_probs"  : [round(float(p), 1) for p in probs],
    }


@tool
def get_driver_calendar(driver: str) -> dict:
    """
    Returns all races ranked best to worst for a specific driver.
    Shows where driver peaks and struggles across the season.
    Driver can be code or full name.
    """
    d = find_driver(driver)
    if not d:
        return {"error": f"Driver '{driver}' not found"}

    d_idx = DRIVERS.index(d)
    races = []

    for r_idx, rnd in enumerate(ROUNDS):
        probs = POS_DIST[d_idx, r_idx, :] / N_SIMS * 100
        races.append({
            "round"      : rnd,
            "race"       : RACE_NAMES[rnd],
            "win_pct"    : round(float(probs[0]), 1),
            "podium_pct" : round(float(sum(probs[:3])), 1),
            "points_pct" : round(float(sum(probs[:10])), 1),
            "likely_pos" : int(probs.argmax()) + 1,
        })

    return {
        "driver"         : d,
        "full_name"      : DRIVER_NAMES.get(d, d),
        "team"           : TEAM_MAP.get(d, "Unknown"),
        "calendar_order" : sorted(races, key=lambda x: x["round"]),
        "ranked_by_win"  : sorted(races, key=lambda x: x["win_pct"], reverse=True),
    }