from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .simulator import SimulationInput, SimulationResult, run_simulation

app = FastAPI(title="JumpFly Simulation Lab API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "JumpFly Simulation Lab API is running", "version": "1.0.0"}

@app.post("/simulate", response_model=SimulationResult)
async def simulate(data: SimulationInput):
    try:
        result = run_simulation(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
