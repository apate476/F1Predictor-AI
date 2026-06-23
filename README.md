# PolePosition AI 🏁

End-to-end F1 2026 race and championship prediction system. A LightGBM model trained on 2023–2025 race data drives 10,000 Monte Carlo simulations, and a multi-agent AI layer (Strands SDK + GPT-4o) answers natural-language questions about the results. React frontend, FastAPI backend.

---

## What it does

- **Predicts** 2026 driver and constructor championship outcomes using Monte Carlo simulation
- **Answers questions** in natural language: "Who wins the championship?", "How does Verstappen perform at Monaco?", "What are Norris's title odds?"
- **Shows** race-by-race win probabilities, driver profiles, and constructor standings across a 24-race season

---

## Architecture

```
frontend/          React + Vite + Tailwind
  └── WebSocket → ws://localhost:8000/ws/chat
  └── REST      → http://localhost:8000/api/...

backend/
  ├── main.py            FastAPI app — REST endpoints + WebSocket chat handler
  ├── agents/
  │   ├── orchestrator.py    GPT-4o orchestrator: routes questions to specialists
  │   ├── championship_agent.py  Standings, title probabilities, constructor race
  │   ├── driver_agent.py        Driver profiles, head-to-head, circuit strengths
  │   └── race_agent.py          Race winner predictions, per-circuit win probs
  └── tools/
      ├── data_loader.py     Loads sim_data.pkl + CSVs; shared by all agents
      ├── championship_tools.py
      ├── driver_tools.py
      ├── race_tools.py
      └── career_tools.py    Live career stats from Jolpica API (cached)

data/
  ├── race_results_{2023,2024,2025}.csv
  ├── qualifying_{2023,2024,2025}.csv
  ├── pitstops_{2023,2024,2025}.csv
  ├── master_features_all.csv   Engineered features — 1,383 rows, 3 seasons
  └── predictions/
      ├── sim_data.pkl                   Monte Carlo output (10,000 runs)
      └── drivers_championship_2026.csv  Per-driver title probability summary

models/
  ├── lgbm_regressor.pkl   Trained LightGBM model
  └── feature_cols.pkl     Ordered feature column list

notebooks/
  ├── 01_data_collection.ipynb      Jolpica/Ergast API → raw CSVs
  ├── 02_feature_engineering.ipynb  Raw CSVs → master_features_all.csv
  ├── 03_2026_features.ipynb        Pre-season testing → features_2026.csv
  └── 04_model_training.ipynb       Train, tune (Optuna), simulate
```

---

## ML Pipeline

**Features (11):** `outperformance`, `grid_position`, `avg_team_pit_seconds`, `quali_position`, `rolling_avg_quali_5`, `rolling_avg_finish_5`, `rolling_avg_points_5`, `driver_experience`, `teammate_quali_gap`, `constructor_rolling_points_5`, `dnf_rate`, `safety_car_probability`

**Model:** LightGBM regression (predicts finish position)

**Cross-validation:** Time-based forward split — rounds 1–18 train, rounds 19+ test, one fold per year (2023, 2024, 2025). No data leakage.

**Hyperparameter tuning:** Optuna (100 trials)

**Simulation:** 10,000 Monte Carlo runs across 24 races. Per-run points accumulated → championship probability per driver.

**Known limitation:** CV MAE ≈ 0.63 positions. Season-to-season variation (regulation changes, team performance swings) limits predictive accuracy — the model generalises across years but cannot anticipate step-changes in team performance that haven't happened yet.

---

## Agent System

The orchestrator is a GPT-4o Strands agent with three specialist sub-agents as tools:

| Agent | Handles |
|---|---|
| Championship agent | Standings, title odds, constructor race |
| Driver agent | Driver profiles, head-to-head, best/worst circuits |
| Race agent | Per-race win probabilities, season calendar |

The orchestrator routes each user question to one or more specialists, then synthesises a single natural-language response.

---

## How to run

### Prerequisites
- Python 3.11+
- Node 18+
- OpenAI API key

### 1. Python environment

```bash
cd f1-predictor
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install strands-agents        # multi-agent framework
pip install python-dotenv
```

### 2. Environment variables

Create `backend/.env`:
```
OPENAI_API_KEY=your-key-here
```

### 3. Run the backend

```bash
# From f1-predictor/
uvicorn main:app --reload --app-dir backend
```

Backend runs on `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

### 5. (Optional) Regenerate predictions

If you want to retrain the model and re-run simulations:

```bash
# Complete any missing raw data first
python fetch_missing_data.py

# Then run notebooks in order:
# 01_data_collection.ipynb
# 02_feature_engineering.ipynb
# 03_2026_features.ipynb
# 04_model_training.ipynb
```

---

## REST API

| Endpoint | Description |
|---|---|
| `GET /api/championship` | Driver title probabilities |
| `GET /api/constructors` | Constructor standings |
| `GET /api/drivers` | All 2026 drivers |
| `GET /api/driver/{code}` | Driver profile + predictions |
| `GET /api/driver/{code}/career` | Career stats + predictions |
| `GET /api/races` | 2026 race calendar |
| `GET /api/race/{name}` | Win probabilities for a race |
| `WS /ws/chat` | Natural-language AI chat |

---

## Data sources

- **Jolpica/Ergast API** — historical race results, qualifying, pit stops (2023–2025)
- **Bahrain pre-season testing 2026** — driver and team performance baselines for 2026 feature construction

---

## Status

- Phase 1 ✅ Data Collection (2023–2025, 3 seasons, 70 race weekends)
- Phase 2 ✅ Feature Engineering (11 features, 1,383 rows)
- Phase 3 ✅ 2026 Regulation Features
- Phase 4 ✅ Model Training (LightGBM, Optuna, Monte Carlo simulation)
- Phase 5 ✅ Multi-Agent AI (Strands + GPT-4o, 3 specialist agents)
- Phase 6 ✅ FastAPI Backend
- Phase 7 ✅ React Frontend (championship, drivers, races, AI chat)
- Phase 8 ⏳ Deployment
