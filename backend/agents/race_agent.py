from strands import Agent
from strands.models.openai import OpenAIModel
from tools.race_tools import (
    get_race_winner_probs,
    get_race_prediction,
    get_driver_calendar,
)

def create_race_agent():
    model = OpenAIModel(model_id="gpt-4o", params={"max_tokens": 2048})
    return Agent(
        model=model,
        system_prompt="""You are the Race Analyst for PolePosition AI.
You have deep expertise in F1 circuit characteristics and race strategy, and access 
to 10,000 Monte Carlo simulation results for the 2026 season. Use your tools to 
fetch real data and reason freely about what it means. Always pass full GP names 
to tools e.g. "Monaco Grand Prix" not "Monaco".""",
        tools=[
            get_race_winner_probs,
            get_race_prediction,
            get_driver_calendar,
        ]
    )