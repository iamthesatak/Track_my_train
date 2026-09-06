"""
TrackMyTrain — FastAPI Backend Server
REST API + WebSocket for real-time train tracking and ETA prediction.
"""

import asyncio
import json
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from server.simulation import simulator
from server.prediction import predictor
from server.data.stations import stations, find_station, search_stations
from server.data.trains import trains, find_train, search_trains, get_trains_at_station, get_trains_between_stations


# Background task to update simulation
async def simulation_loop():
    """Continuously update train positions."""
    while True:
        simulator.update_all()
        await asyncio.sleep(3)  # Update every 3 seconds


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle."""
    task = asyncio.create_task(simulation_loop())
    yield
    task.cancel()


app = FastAPI(
    title="TrackMyTrain API",
    description="Real-time Indian Railways ETA prediction system",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- WebSocket connections manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, data: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(data)
            except Exception:
                pass


manager = ConnectionManager()


# --- REST API Endpoints ---

@app.get("/api/trains")
async def get_all_trains_status():
    """Get current status of all trains."""
    states = simulator.get_all_states()
    return {"trains": states, "count": len(states)}

@app.get("/api/trains/between")
async def get_trains_between(
    from_station: str = Query(..., alias="from", min_length=1),
    to_station: str = Query(..., alias="to", min_length=1),
):
    """Get all trains running between two stations with live tracking data."""
    between = get_trains_between_stations(from_station, to_station)

    if not between:
        return {
            "from": from_station,
            "to": to_station,
            "trains": [],
            "count": 0,
        }

    results = []
    from_info = find_station(from_station.upper())
    to_info = find_station(to_station.upper())

    for entry in between:
        train_data = entry["train"]
        state = simulator.get_train_state(train_data["number"])
        if not state:
            continue

        # Calculate segment-specific progress
        seg_start_km = entry["segment"][0]["km"]
        seg_end_km = entry["segment"][-1]["km"]
        seg_distance = entry["segment_distance"]
        train_km = state.get("current_km", 0)

        if train_km < seg_start_km:
            seg_progress = 0
            seg_status = "not_entered"
        elif train_km > seg_end_km:
            seg_progress = 100
            seg_status = "passed"
        else:
            seg_progress = round(
                (train_km - seg_start_km) / seg_distance * 100, 1
            ) if seg_distance > 0 else 0
            seg_status = "in_segment"

        # Get ETA for destination station
        eta = predictor.predict_eta(state, to_station.upper())

        results.append({
            "number": state["number"],
            "name": state["name"],
            "type": state["type"],
            "status": state["status"],
            "status_label": state["status_label"],
            "delay_minutes": state["delay_minutes"],
            "current_speed": state["current_speed"],
            "weather": state["weather"],
            "position": state["position"],
            "progress": state["progress"],
            "current_km": state["current_km"],
            "segment_progress": seg_progress,
            "segment_status": seg_status,
            "segment_distance": seg_distance,
            "segment_from_km": seg_start_km,
            "segment_to_km": seg_end_km,
            "segment_dep_time": entry["segment"][0].get("dep") or entry["segment"][0].get("arr") or "00:00",
            "source": state["source"],
            "destination": state["destination"],
            "last_station": state.get("last_station"),
            "next_station": state.get("next_station"),
            "segment_stations": [
                {
                    "code": s["station"],
                    "name": (find_station(s["station"]) or {}).get("name", s["station"]),
                    "km": s["km"],
                    "arr": s.get("arr"),
                    "dep": s.get("dep"),
                }
                for s in entry["segment"]
            ],
            "eta": eta,
        })

    # Sort results chronologically by departure time from the origin station
    results.sort(key=lambda x: x["segment_dep_time"])

    return {
        "from": {
            "code": from_station.upper(),
            "name": from_info["name"] if from_info else from_station,
        },
        "to": {
            "code": to_station.upper(),
            "name": to_info["name"] if to_info else to_station,
        },
        "trains": results,
        "count": len(results),
    }



@app.get("/api/trains/{train_number}")
async def get_train_detail(train_number: str):
    """Get detailed status of a specific train."""
    state = simulator.get_train_state(train_number)
    if not state:
        return {"error": "Train not found", "train_number": train_number}

    # Add ETA predictions for upcoming stations
    predictions = []
    for station in state.get("upcoming_stations", []):
        pred = predictor.predict_eta(state, station["code"])
        if pred:
            predictions.append(pred)

    state["predictions"] = predictions
    return state


@app.get("/api/trains/{train_number}/eta/{station_code}")
async def get_eta_prediction(train_number: str, station_code: str):
    """Get ETA prediction for a train at a specific station."""
    state = simulator.get_train_state(train_number)
    if not state:
        return {"error": "Train not found"}

    prediction = predictor.predict_eta(state, station_code)
    if not prediction:
        return {"error": "Station not found in train route or already passed"}

    return prediction


@app.get("/api/search")
async def search(q: str = Query(..., min_length=1)):
    """Search for trains and stations."""
    train_results = search_trains(q)
    station_results = search_stations(q)

    return {
        "query": q,
        "trains": [
            {
                "number": t["number"],
                "name": t["name"],
                "type": t["type"],
                "source": t["source"],
                "destination": t["destination"],
            }
            for t in train_results
        ],
        "stations": [
            {
                "code": s["code"],
                "name": s["name"],
                "city": s["city"],
                "zone": s["zone"],
            }
            for s in station_results
        ],
    }


@app.get("/api/stations")
async def get_all_stations():
    """Get all stations."""
    return {"stations": stations, "count": len(stations)}


@app.get("/api/stations/{station_code}")
async def get_station_detail(station_code: str):
    """Get station details and trains at this station."""
    station = find_station(station_code)
    if not station:
        return {"error": "Station not found"}

    station_trains = get_trains_at_station(station_code)
    return {
        "station": station,
        "trains": [
            {
                "number": t["number"],
                "name": t["name"],
                "type": t["type"],
                "source": t["source"],
                "destination": t["destination"],
            }
            for t in station_trains
        ],
    }


@app.get("/api/stats")
async def get_network_stats():
    """Get network-wide statistics."""
    states = simulator.get_all_states()
    stats = predictor.get_network_stats(states)
    return stats



@app.get("/api/stats/delays")
async def get_delay_stats():
    """Get delay statistics breakdown."""
    states = simulator.get_all_states()

    # Delay distribution
    delay_buckets = {"early": 0, "on_time": 0, "5-15min": 0, "15-30min": 0, "30-60min": 0, "60+min": 0}
    for s in states:
        d = s.get("delay_minutes", 0)
        if d < 0:
            delay_buckets["early"] += 1
        elif d <= 5:
            delay_buckets["on_time"] += 1
        elif d <= 15:
            delay_buckets["5-15min"] += 1
        elif d <= 30:
            delay_buckets["15-30min"] += 1
        elif d <= 60:
            delay_buckets["30-60min"] += 1
        else:
            delay_buckets["60+min"] += 1

    # Top delayed trains
    sorted_by_delay = sorted(states, key=lambda x: x.get("delay_minutes", 0), reverse=True)
    top_delayed = [
        {
            "number": s["number"],
            "name": s["name"],
            "type": s["type"],
            "delay": s.get("delay_minutes", 0),
            "source": s["source"]["name"],
            "destination": s["destination"]["name"],
        }
        for s in sorted_by_delay[:10]
    ]

    return {
        "delay_distribution": delay_buckets,
        "top_delayed": top_delayed,
    }


# --- WebSocket Endpoint ---

@app.websocket("/ws/live")
async def websocket_live(websocket: WebSocket):
    """WebSocket endpoint for real-time train updates."""
    await manager.connect(websocket)
    try:
        while True:
            # Send updates every 5 seconds
            states = simulator.get_all_states()
            stats = predictor.get_network_stats(states)
            await websocket.send_json({
                "type": "update",
                "trains": states,
                "stats": stats,
                "timestamp": time.time(),
            })
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)


@app.websocket("/ws/train/{train_number}")
async def websocket_train(websocket: WebSocket, train_number: str):
    """WebSocket for tracking a specific train."""
    await manager.connect(websocket)
    try:
        while True:
            state = simulator.get_train_state(train_number)
            if state:
                # Add predictions
                predictions = []
                for station in state.get("upcoming_stations", []):
                    pred = predictor.predict_eta(state, station["code"])
                    if pred:
                        predictions.append(pred)
                state["predictions"] = predictions

                await websocket.send_json({
                    "type": "train_update",
                    "train": state,
                    "timestamp": time.time(),
                })
            await asyncio.sleep(3)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
