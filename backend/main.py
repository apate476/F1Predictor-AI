# ================================================================
# POLEPOSITION AI — FastAPI Backend
# ================================================================
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from agents.orchestrator import create_orchestrator
from tools.championship_tools import (
    get_championship_standings,
    get_constructors_standings,
)
from tools.race_tools import get_race_winner_probs
from tools.driver_tools import get_driver_profile
from tools.data_loader import DRIVERS, RACE_NAMES, DRIVER_NAMES, TEAM_MAP
import json

app = FastAPI(title="PolePosition AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create orchestrator once at startup
orchestrator = create_orchestrator()

# ── REST ENDPOINTS ───────────────────────────────────────────────

@app.get("/api/championship")
async def championship():
    return get_championship_standings()

@app.get("/api/constructors")
async def constructors():
    return get_constructors_standings()

@app.get("/api/drivers")
async def drivers():
    return {"drivers": [
        {"code": d, "name": DRIVER_NAMES.get(d, d), "team": TEAM_MAP.get(d, "")}
        for d in DRIVERS
    ]}

@app.get("/api/driver/{driver_code}")
async def driver(driver_code: str):
    return get_driver_profile(driver_code)

@app.get("/api/race/{race_name}")
async def race(race_name: str):
    return get_race_winner_probs(race_name)

@app.get("/api/races")
async def races():
    return {"races": [
        {"round": rnd, "name": name}
        for rnd, name in sorted(RACE_NAMES.items())
    ]}

# ── WEBSOCKET CHAT ───────────────────────────────────────────────

@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data).get("message", "")

            await websocket.send_text(json.dumps({"type": "thinking"}))

            response = orchestrator(message)

            await websocket.send_text(json.dumps({
                "type"   : "response",
                "message": str(response),
            }))

    except WebSocketDisconnect:
        pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)