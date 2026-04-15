import numpy as np
import pandas as pd
from typing import Dict, List, Optional
from pydantic import BaseModel

class SimulationInput(BaseModel):
    industry: str
    macro_scenario: str
    annual_budget: float
    channels: Dict[str, float]  # channel_id -> percentage

class MonthlyForecast(BaseModel):
    month: str
    budget: float
    conversions: int
    roas: float
    cpa: float

class SimulationResult(BaseModel):
    total_conversions: int
    avg_roas: float
    avg_cpa: float
    confidence_score: float
    monthly_forecast: List[MonthlyForecast]
    ai_insights: List[str]

# Mock Industry Data
INDUSTRY_DATA = {
    "ecommerce": {
        "base_cpc": 1.20,
        "base_cr": 0.03,
        "base_roas": 4.5,
        "seasonality": [1.0, 0.9, 0.8, 1.1, 1.2, 1.1, 1.0, 1.2, 1.5, 2.8, 4.5, 3.5]
    },
    "saas": {
        "base_cpc": 5.50,
        "base_cr": 0.015,
        "base_roas": 2.2,
        "seasonality": [1.1, 1.0, 0.9, 1.0, 1.1, 1.1, 1.0, 1.1, 1.2, 1.1, 1.0, 0.9]
    },
    "healthcare": {
        "base_cpc": 3.20,
        "base_cr": 0.025,
        "base_roas": 3.0,
        "seasonality": [1.2, 1.1, 1.0, 0.9, 0.8, 0.7, 0.7, 0.8, 1.0, 1.1, 1.1, 1.2]
    }
}

SCENARIO_MODIFIERS = {
    "stable_growth": 1.0,
    "recession": 0.75,
    "rapid_growth": 1.3
}

def run_simulation(data: SimulationInput) -> SimulationResult:
    industry_config = INDUSTRY_DATA.get(data.industry.lower(), INDUSTRY_DATA["ecommerce"])
    scenario_mod = SCENARIO_MODIFIERS.get(data.macro_scenario.lower(), 1.0)
    
    monthly_budget = data.annual_budget / 12
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    forecast = []
    total_conv = 0
    total_spend = 0
    
    for i, month in enumerate(months):
        season_mod = industry_config["seasonality"][i]
        
        # Calculate performance metrics
        # Diminishing returns logic: ROAS decreases as budget increases relative to 'standard'
        # Simplified: ROAS = Base * Seasonality * Scenario * (1 - log10(budget / 1000) * 0.1)
        budget_scaling = max(1.0, monthly_budget / 5000)
        diminishing_ret = 1.0 - (np.log10(budget_scaling) * 0.15) if budget_scaling > 1 else 1.0
        
        current_roas = industry_config["base_roas"] * season_mod * scenario_mod * diminishing_ret
        current_cpc = industry_config["base_cpc"] / (season_mod * scenario_mod) # High demand = high CPC
        
        monthly_spend = monthly_budget
        # Revenue = Spend * ROAS
        revenue = monthly_spend * current_roas
        # Conversions = Spend / CPA (Simplified)
        # CPA = CPC / CR
        current_cr = industry_config["base_cr"] * (1.1 if season_mod > 1.5 else 1.0)
        current_cpa = current_cpc / current_cr
        conversions = int(monthly_spend / current_cpa)
        
        forecast.append(MonthlyForecast(
            month=month,
            budget=round(monthly_spend, 2),
            conversions=conversions,
            roas=round(current_roas, 2),
            cpa=round(current_cpa, 2)
        ))
        
        total_conv += conversions
        total_spend += monthly_spend

    avg_roas = sum(f.roas for f in forecast) / 12
    avg_cpa = total_spend / total_conv if total_conv > 0 else 0
    
    # Generate AI Insights
    insights = []
    if data.macro_scenario == "recession":
        insights.append("Economic pressures detected. Focus on high-intent search terms and remarketing to maintain ROAS.")
    
    peak_month = forecast[np.argmax([f.conversions for f in forecast])]
    insights.append(f"Performance is projected to peak in {peak_month.month} with {peak_month.conversions} conversions. Consider increasing liquidity during this window.")
    
    if avg_roas < 3.0:
        insights.append("Projected ROAS is below benchmark. Analyze channel allocation to shift budget from low-performing visual channels to Search.")

    return SimulationResult(
        total_conversions=total_conv,
        avg_roas=round(avg_roas, 2),
        avg_cpa=round(avg_cpa, 2),
        confidence_score=0.85, # Constant for prototype
        monthly_forecast=forecast,
        ai_insights=insights
    )
