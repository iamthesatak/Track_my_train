"""
ETA Prediction Module
Statistical model for predicting train arrival times at upcoming stations.
Uses current delay, speed, weather, congestion, and historical patterns.
"""

import math
import random
from datetime import datetime, timedelta


class ETAPredictor:
    """Predicts Expected Time of Arrival for trains at upcoming stations."""

    # Historical punctuality by train type (fraction of trains on time)
    PUNCTUALITY_RATES = {
        "Rajdhani": 0.82,
        "Shatabdi": 0.85,
        "Vande Bharat": 0.90,
        "Duronto": 0.78,
        "Gatimaan": 0.88,
        "Superfast": 0.70,
        "Express": 0.60,
        "Mail": 0.55,
    }

    # Average recovery rate (minutes recovered per 100km)
    RECOVERY_RATES = {
        "Rajdhani": 3.5,
        "Shatabdi": 4.0,
        "Vande Bharat": 4.5,
        "Duronto": 3.0,
        "Gatimaan": 4.5,
        "Superfast": 2.0,
        "Express": 1.5,
        "Mail": 1.0,
    }

    # Zone-wise average delay (minutes)
    ZONE_DELAYS = {
        "NR": 12, "NCR": 15, "NER": 20, "NFR": 25,
        "ER": 18, "ECR": 22, "SER": 16, "ECoR": 14,
        "SR": 10, "SCR": 12, "SWR": 11, "WR": 13,
        "WCR": 17, "NWR": 16, "SECR": 18, "KR": 15,
    }

    def predict_eta(self, train_state: dict, station_code: str) -> dict:
        """
        Predict ETA for a train at a specific upcoming station.

        Returns:
            dict with predicted_arrival, delay_minutes, confidence,
            confidence_percentage, factors
        """
        if not train_state:
            return None

        # Find the target station in upcoming stations
        target = None
        for s in train_state.get("upcoming_stations", []):
            if s["code"] == station_code:
                target = s
                break

        if not target:
            return None

        # Base prediction from scheduled time + current delay
        scheduled_arr = target.get("scheduled_arr")
        if not scheduled_arr:
            return None

        current_delay = train_state.get("delay_minutes", 0)
        distance_remaining = target["km"] - train_state.get("current_km", 0)
        train_type = train_state.get("type", "Express")
        current_speed = train_state.get("current_speed", 60)
        weather = train_state.get("weather", "clear")

        # Factor 1: Delay recovery
        recovery_rate = self.RECOVERY_RATES.get(train_type, 1.5)
        recovery = (distance_remaining / 100) * recovery_rate
        recovered_delay = max(current_delay - recovery, -5)

        # Factor 2: Weather impact
        weather_delays = {
            "clear": 0, "cloudy": 1, "rain": 5,
            "heavy_rain": 12, "fog": 15, "storm": 20,
        }
        weather_delay = weather_delays.get(weather, 0) * (distance_remaining / 500)

        # Factor 3: Time-of-day congestion
        hour = datetime.now().hour
        if 7 <= hour <= 10 or 17 <= hour <= 20:
            congestion_delay = random.uniform(2, 8)
        elif 22 <= hour or hour <= 5:
            congestion_delay = random.uniform(-2, 1)
        else:
            congestion_delay = random.uniform(0, 4)

        # Factor 4: Historical pattern (add some noise)
        historical_noise = random.uniform(-3, 5)

        # Final predicted delay
        predicted_delay = round(
            recovered_delay + weather_delay + congestion_delay + historical_noise
        )
        predicted_delay = max(predicted_delay, -10)  # Can be early by up to 10 min

        # Calculate confidence
        confidence_pct = self._calculate_confidence_pct(
            distance_remaining, weather, train_type, current_delay
        )

        if confidence_pct >= 80:
            confidence = "high"
        elif confidence_pct >= 50:
            confidence = "medium"
        else:
            confidence = "low"

        # Contributing factors
        factors = []
        if weather != "clear":
            factors.append({"name": f"Weather: {weather}", "impact": f"+{round(weather_delay)}min"})
        if congestion_delay > 3:
            factors.append({"name": "Peak hour congestion", "impact": f"+{round(congestion_delay)}min"})
        if recovery > 2:
            factors.append({"name": "Schedule recovery", "impact": f"-{round(recovery)}min"})
        if current_delay > 15:
            factors.append({"name": "Cascading delay", "impact": f"+{round(current_delay * 0.3)}min"})
        if not factors:
            factors.append({"name": "Normal operations", "impact": "On schedule"})

        # Predicted arrival time
        arr_parts = scheduled_arr.split(":")
        arr_hour, arr_min = int(arr_parts[0]), int(arr_parts[1])
        base_time = datetime.now().replace(
            hour=arr_hour, minute=arr_min, second=0
        )
        if base_time < datetime.now():
            base_time += timedelta(days=1)

        predicted_time = base_time + timedelta(minutes=predicted_delay)

        return {
            "station_code": station_code,
            "scheduled_arrival": scheduled_arr,
            "predicted_arrival": predicted_time.strftime("%H:%M"),
            "delay_minutes": predicted_delay,
            "confidence": confidence,
            "confidence_percentage": confidence_pct,
            "distance_remaining": round(distance_remaining, 1),
            "factors": factors,
            "model_version": "v1.2.0",
        }

    def _calculate_confidence_pct(
        self, distance: float, weather: str, train_type: str, current_delay: int
    ) -> int:
        """Calculate prediction confidence as percentage."""
        # Base confidence from distance
        if distance < 50:
            base = 95
        elif distance < 150:
            base = 85
        elif distance < 400:
            base = 70
        elif distance < 800:
            base = 55
        else:
            base = 40

        # Weather penalty
        weather_penalty = {
            "clear": 0, "cloudy": 2, "rain": 8,
            "heavy_rain": 15, "fog": 18, "storm": 25,
        }
        base -= weather_penalty.get(weather, 0)

        # Train type bonus
        type_bonus = {
            "Rajdhani": 8, "Shatabdi": 8, "Vande Bharat": 10,
            "Duronto": 6, "Gatimaan": 10, "Superfast": 3,
            "Express": 0, "Mail": -2,
        }
        base += type_bonus.get(train_type, 0)

        # High delay reduces confidence
        if current_delay > 30:
            base -= 10
        elif current_delay > 60:
            base -= 20

        return max(15, min(98, base))

    def get_network_stats(self, all_states: list) -> dict:
        """Calculate network-wide statistics."""
        if not all_states:
            return {}

        total = len(all_states)
        on_time = sum(1 for s in all_states if s.get("delay_minutes", 0) <= 5)
        delayed = sum(1 for s in all_states if 5 < s.get("delay_minutes", 0) <= 30)
        severely_delayed = sum(1 for s in all_states if s.get("delay_minutes", 0) > 30)
        avg_delay = sum(s.get("delay_minutes", 0) for s in all_states) / total
        avg_speed = sum(s.get("current_speed", 0) for s in all_states) / total

        # Delays by train type
        type_delays = {}
        for s in all_states:
            t = s.get("type", "Express")
            if t not in type_delays:
                type_delays[t] = []
            type_delays[t].append(s.get("delay_minutes", 0))

        type_avg_delays = {
            k: round(sum(v) / len(v), 1) for k, v in type_delays.items()
        }

        # Weather distribution
        weather_counts = {}
        for s in all_states:
            w = s.get("weather", "clear")
            weather_counts[w] = weather_counts.get(w, 0) + 1

        return {
            "total_trains": total,
            "on_time": on_time,
            "on_time_percentage": round(on_time / total * 100, 1),
            "delayed": delayed,
            "severely_delayed": severely_delayed,
            "average_delay": round(avg_delay, 1),
            "average_speed": round(avg_speed, 1),
            "type_delays": type_avg_delays,
            "weather_distribution": weather_counts,
            "updated_at": datetime.now().isoformat(),
        }


# Global predictor instance
predictor = ETAPredictor()
