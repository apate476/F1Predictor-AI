from strands import Agent, tool
from strands.models.openai import OpenAIModel
from agents.championship_agent import create_championship_agent
from agents.driver_agent import create_driver_agent
from agents.race_agent import create_race_agent

# Create sub-agents once at startup
_championship_agent = create_championship_agent()
_driver_agent       = create_driver_agent()
_race_agent         = create_race_agent()

@tool
def ask_championship_agent(question: str) -> str:
    """
    Ask the championship specialist. Use for standings, title probabilities,
    constructors championship, who wins the championship.
    """
    return str(_championship_agent(question))

@tool
def ask_driver_agent(question: str) -> str:
    """
    Ask the driver specialist. Use for driver profiles, head to head comparisons,
    best and worst circuits for a driver.
    """
    return str(_driver_agent(question))

@tool
def ask_race_agent(question: str) -> str:
    """
    Ask the race specialist. Use for race winner predictions, driver probabilities
    at specific circuits, full season calendar for a driver.
    """
    return str(_race_agent(question))


def create_orchestrator():
    model = OpenAIModel(model_id="gpt-4o", params={"max_tokens": 4096})
    return Agent(
        model=model,
        system_prompt="""You are PolePosition AI — an expert F1 prediction system for the 2026 season.

You have three specialist agents at your disposal. Route questions to the right 
agent or combine multiple agents for complex questions. Synthesize their responses 
into one clear, engaging answer.

Key context:
- 10,000 Monte Carlo simulations using real Bahrain pre-season testing data
- Training data: 2023, 2024, 2025 seasons — CV MAE 0.632
- New 2026 regulations: active aero, no DRS, 50% electrical power, narrower cars
- 11 teams including new Audi and Cadillac
- Lando Norris is reigning world champion

Reason freely. Be engaging and data-driven.""",
        tools=[
            ask_championship_agent,
            ask_driver_agent,
            ask_race_agent,
        ]
    )