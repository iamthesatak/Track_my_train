"""
Train Simulation Engine
Simulates realistic train movement across the Indian Railways network.
Generates positions, delays, speeds, and real-time status updates.
"""

import math
import random
import time
from datetime import datetime, timedelta
from .data.stations import find_station
from .data.trains import trains, find_train


class TrainSimulator:
    """Manages simulation state for all active trains."""

    def __init__(self):
        self.active_trains = {}  # train_number -> SimulatedTrain
        self.start_time = datetime.now()
        self._init_all_trains()

    def _init_all_trains(self):
        """Initialize all trains with simulated positions."""
        for train_data in trains:
            sim = SimulatedTrain(train_data)
            self.active_trains[train_data["number"]] = sim

    def update_all(self):
        """Update positions for all active trains."""
        for sim in self.active_trains.values():
            sim.update()

    def get_all_states(self):
        """Get current state of all trains."""
        states = []
        for sim in self.active_trains.values():
            state = sim.get_state()
            if state:
                states.append(state)
        return states

    def get_train_state(self, train_number: str):
        """Get state of a specific train."""
        sim = self.active_trains.get(train_number)
        if sim:
            return sim.get_state()
        return None


class SimulatedTrain:
    """Simulates a single train's journey."""

    # Weather conditions and their delay impact (minutes per 100km)
    WEATHER_EFFECTS = {
        "clear": 0,
        "cloudy": 0.2,
        "rain": 1.5,
        "heavy_rain": 3.0,
        "fog": 4.0,
        "storm": 5.0,
    }

    # Congestion levels by time of day (0-23 hours)
    CONGESTION_PROFILE = {
        0: 0.2, 1: 0.1, 2: 0.1, 3: 0.1, 4: 0.15, 5: 0.2,
        6: 0.4, 7: 0.6, 8: 0.8, 9: 0.9, 10: 0.7, 11: 0.6,
        12: 0.5, 13: 0.5, 14: 0.6, 15: 0.7, 16: 0.8, 17: 0.9,
        18: 1.0, 19: 0.9, 20: 0.7, 21: 0.5, 22: 0.4, 23: 0.3,
    }

    def __init__(self, train_data: dict):
        self.data = train_data
        self.route = train_data["route"]
        self.total_distance = train_data["total_distance"]
        self.max_speed = train_data["max_speed"]

        # Simulation state
        self.progress = random.uniform(0, 1)  # 0 to 1 along route
        self.current_km = self.progress * self.total_distance
        self.current_speed = 0
        self.delay_minutes = 0
        self.weather = "clear"
        self.status = "running"  # running, at_station, completed, not_started
        self.last_update = time.time()

        # Initialize with realistic state
        self._init_state()

    def _init_state(self):
        """Set initial simulation state with realistic values."""
        # Random delay based on train type
        delay_ranges = {
            "Rajdhani": (-5, 15),
            "Shatabdi": (-3, 10),
            "Vande Bharat": (-2, 8),
            "Duronto": (-5, 20),
            "Gatimaan": (-2, 5),
            "Superfast": (-5, 30),
            "Express": (0, 45),
            "Mail": (0, 60),
        }
        d_range = delay_ranges.get(self.data["type"], (0, 30))
        self.delay_minutes = random.randint(d_range[0], d_range[1])

        # Weather based on region (determined by current position)
        self._update_weather()

        # Speed based on section
        self._update_speed()

        # Determine if at station
        for i, stop in enumerate(self.route):
            stop_km = stop["km"]
            if abs(self.current_km - stop_km) < 5:
                self.status = "at_station"
                self.current_station_idx = i
                self.current_speed = 0
                break
        else:
            self.status = "running"
            self.current_station_idx = self._get_section_index()

    def _get_section_index(self):
        """Get index of the section the train is currently in."""
        for i in range(len(self.route) - 1):
            if self.route[i]["km"] <= self.current_km <= self.route[i + 1]["km"]:
                return i
        return 0

    def _update_weather(self):
        """Update weather condition based on region and randomness."""
        weathers = ["clear", "clear", "clear", "cloudy", "cloudy", "rain", "fog"]
        # Bias toward clear weather, but occasionally introduce disruptions
        if random.random() < 0.05:
            self.weather = random.choice(["heavy_rain", "storm", "fog"])
        elif random.random() < 0.15:
            self.weather = random.choice(["rain", "cloudy"])
        else:
            self.weather = random.choice(["clear", "clear", "cloudy"])

    def _update_speed(self):
        """Calculate current speed based on conditions."""
        if self.status == "at_station":
            self.current_speed = 0
            return

        # Base speed (fraction of max)
        base_speed = self.max_speed * random.uniform(0.6, 0.95)

        # Weather reduction
        weather_factor = 1.0 - (self.WEATHER_EFFECTS.get(self.weather, 0) / 10.0)
        weather_factor = max(0.3, weather_factor)

        # Congestion reduction
        hour = datetime.now().hour
        congestion = self.CONGESTION_PROFILE.get(hour, 0.5)
        congestion_factor = 1.0 - (congestion * 0.15)

        # Speed restrictions (random sections)
        speed_restriction = 1.0
        if random.random() < 0.05:
            speed_restriction = random.uniform(0.3, 0.6)

        self.current_speed = round(
            base_speed * weather_factor * congestion_factor * speed_restriction, 1
        )

    def update(self):
        """Update train position and state."""
        now = time.time()
        dt = now - self.last_update
        self.last_update = now

        if self.status == "completed" or self.status == "not_started":
            # Reset occasionally to keep simulation running
            if random.random() < 0.01:
                self.progress = 0
                self.current_km = 0
                self.delay_minutes = random.randint(-5, 15)
                self.status = "running"
            return

        if self.status == "at_station":
            # Stay at station for a bit, then depart
            if random.random() < 0.15:  # ~15% chance per update to depart
                self.status = "running"
                self._update_speed()
                # Chance of delay increasing at station
                if random.random() < 0.3:
                    self.delay_minutes += random.randint(1, 5)
                elif random.random() < 0.1:
                    # Chance of recovering some delay
                    self.delay_minutes = max(
                        self.delay_minutes - random.randint(1, 3), -5
                    )
            return

        # Update speed periodically
        if random.random() < 0.3:
            self._update_speed()

        # Update weather occasionally
        if random.random() < 0.02:
            self._update_weather()

        # Move train forward
        # Speed is km/h, dt is seconds, so distance = speed * dt / 3600
        distance_covered = self.current_speed * dt / 3600.0

        # Scale speed for faster simulation (10x real-time)
        distance_covered *= 10

        self.current_km += distance_covered
        self.progress = min(self.current_km / self.total_distance, 1.0)

        # Check if approaching or at a station
        for i, stop in enumerate(self.route):
            if abs(self.current_km - stop["km"]) < 3:
                self.status = "at_station"
                self.current_station_idx = i
                self.current_km = stop["km"]
                self.current_speed = 0

                # Random delay changes at station
                if random.random() < 0.4:
                    self.delay_minutes += random.randint(-2, 5)
                break

        # Check if journey complete
        if self.current_km >= self.total_distance:
            self.status = "completed"
            self.current_km = self.total_distance
            self.progress = 1.0
            self.current_speed = 0

        # Occasionally add random delays (signal halt, etc.)
        if random.random() < 0.02 and self.status == "running":
            self.delay_minutes += random.randint(1, 8)
            self.current_speed = 0
            self.status = "at_station"  # Simulates unscheduled stop

    def get_state(self):
        """Get current train state as a dictionary."""
        # Calculate current GPS position
        lat, lng = self._interpolate_position()

        # Determine which stations are completed
        completed_stations = []
        upcoming_stations = []
        current_station = None

        for i, stop in enumerate(self.route):
            station_info = find_station(stop["station"])
            if not station_info:
                continue

            station_state = {
                "code": stop["station"],
                "name": station_info["name"],
                "scheduled_arr": stop.get("arr"),
                "scheduled_dep": stop.get("dep"),
                "platform": stop.get("platform", 1),
                "km": stop["km"],
                "day": stop.get("day", 0),
            }

            if stop["km"] < self.current_km - 5:
                # Calculate actual times with delay
                actual_delay = self.delay_minutes + random.randint(-3, 3)
                station_state["status"] = "completed"
                station_state["actual_delay"] = max(actual_delay - random.randint(0, 5), -5)
                completed_stations.append(station_state)
            elif abs(stop["km"] - self.current_km) <= 5:
                station_state["status"] = "current"
                station_state["actual_delay"] = self.delay_minutes
                current_station = station_state
            else:
                station_state["status"] = "upcoming"
                # Predict delay for upcoming stations
                distance_remaining = stop["km"] - self.current_km
                predicted_additional_delay = self._predict_delay_change(distance_remaining)
                station_state["predicted_delay"] = self.delay_minutes + predicted_additional_delay
                station_state["confidence"] = self._calculate_confidence(distance_remaining)
                upcoming_stations.append(station_state)

        # Determine status label
        if self.delay_minutes <= 0:
            status_label = "on_time"
        elif self.delay_minutes <= 15:
            status_label = "slightly_delayed"
        elif self.delay_minutes <= 45:
            status_label = "delayed"
        else:
            status_label = "severely_delayed"

        # Get next station
        section_idx = self._get_section_index()
        next_station_code = None
        next_station_name = None
        if section_idx + 1 < len(self.route):
            ns = find_station(self.route[section_idx + 1]["station"])
            if ns:
                next_station_code = self.route[section_idx + 1]["station"]
                next_station_name = ns["name"]

        # Last station
        last_station_code = None
        last_station_name = None
        if section_idx >= 0 and section_idx < len(self.route):
            ls = find_station(self.route[section_idx]["station"])
            if ls:
                last_station_code = self.route[section_idx]["station"]
                last_station_name = ls["name"]

        source_info = find_station(self.data["source"])
        dest_info = find_station(self.data["destination"])

        return {
            "number": self.data["number"],
            "name": self.data["name"],
            "type": self.data["type"],
            "source": {
                "code": self.data["source"],
                "name": source_info["name"] if source_info else self.data["source"],
            },
            "destination": {
                "code": self.data["destination"],
                "name": dest_info["name"] if dest_info else self.data["destination"],
            },
            "status": self.status,
            "status_label": status_label,
            "position": {"lat": lat, "lng": lng},
            "current_speed": self.current_speed,
            "max_speed": self.max_speed,
            "delay_minutes": self.delay_minutes,
            "progress": round(self.progress * 100, 1),
            "current_km": round(self.current_km, 1),
            "total_distance": self.total_distance,
            "weather": self.weather,
            "last_station": {
                "code": last_station_code,
                "name": last_station_name,
            },
            "next_station": {
                "code": next_station_code,
                "name": next_station_name,
            },
            "completed_stations": completed_stations,
            "current_station": current_station,
            "upcoming_stations": upcoming_stations,
            "days": self.data.get("days", []),
        }

    def _interpolate_position(self):
        """Calculate GPS position by interpolating between route stations."""
        if not self.route:
            return 20.5937, 78.9629  # Center of India

        # Find the two stations we're between
        prev_stop = self.route[0]
        next_stop = self.route[-1]

        for i in range(len(self.route) - 1):
            if self.route[i]["km"] <= self.current_km <= self.route[i + 1]["km"]:
                prev_stop = self.route[i]
                next_stop = self.route[i + 1]
                break

        prev_station = find_station(prev_stop["station"])
        next_station = find_station(next_stop["station"])

        if not prev_station or not next_station:
            return 20.5937, 78.9629

        # Linear interpolation
        section_length = next_stop["km"] - prev_stop["km"]
        if section_length == 0:
            return prev_station["lat"], prev_station["lng"]

        section_progress = (self.current_km - prev_stop["km"]) / section_length
        section_progress = max(0, min(1, section_progress))

        lat = prev_station["lat"] + (next_station["lat"] - prev_station["lat"]) * section_progress
        lng = prev_station["lng"] + (next_station["lng"] - prev_station["lng"]) * section_progress

        # Add slight random offset to simulate track curves
        lat += random.uniform(-0.01, 0.01)
        lng += random.uniform(-0.01, 0.01)

        return round(lat, 4), round(lng, 4)

    def _predict_delay_change(self, distance_remaining: float) -> int:
        """Predict how delay will change over remaining distance."""
        # Further stations have more uncertainty
        # Trains tend to recover some delay on longer runs
        recovery_rate = 0.05  # 5% recovery per 100km for premium trains
        if self.data["type"] in ("Rajdhani", "Shatabdi", "Vande Bharat", "Duronto"):
            recovery_rate = 0.08

        recovery = int(distance_remaining / 100 * recovery_rate * self.delay_minutes)

        # Weather and congestion can add delay
        weather_impact = self.WEATHER_EFFECTS.get(self.weather, 0) * distance_remaining / 100
        congestion_impact = random.uniform(0, 2) * distance_remaining / 200

        predicted_change = -recovery + int(weather_impact + congestion_impact)
        return max(-self.delay_minutes, predicted_change)

    def _calculate_confidence(self, distance_remaining: float) -> str:
        """Calculate confidence level for ETA prediction."""
        if distance_remaining < 100:
            return "high"
        elif distance_remaining < 500:
            return "medium"
        else:
            return "low"


# Global simulator instance
simulator = TrainSimulator()
