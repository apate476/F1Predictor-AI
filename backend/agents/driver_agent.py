from strands import Agent
from strands.models.openai import OpenAIModel
from tools.driver_tools import get_driver_profile, compare_drivers

def create_driver_agent():
    model = OpenAIModel(model_id="gpt-4o", params={"max_tokens": 2048})
    return Agent(
        model=model,
        system_prompt="""You are the Driver Analyst for PolePosition AI.
You have deep expertise in F1 driver performance and access to 10,000 Monte Carlo 
simulation results for the 2026 season. Use your tools to fetch real data and 
reason freely about what it means. Always pass full GP names to tools 
e.g. "Monaco Grand Prix" not "Monaco".""",
        tools=[get_driver_profile, compare_drivers]
    )