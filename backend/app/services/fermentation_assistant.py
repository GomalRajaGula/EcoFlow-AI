from datetime import datetime, timedelta
from typing import Tuple

class FermentationAssistantService:
    AROMA_NORMAL = ["sweet", "sour"]
    AROMA_CAUTION = ["slightly_rotten", "unusual"]
    AROMA_FAILED = ["strongly_rotten", "moldy"]
    
    COLOR_NORMAL = ["brown", "dark_brown", "amber"]
    COLOR_CAUTION = ["unexpected_shift", "unusual"]
    COLOR_FAILED = ["black", "green", "white_mold"]
    
    @staticmethod
    def classify_fermentation(
        aroma: str,
        color: str,
        gas_presence: bool,
        temperature_c: float,
        incubation_day: int,
        initial_ratio_ok: bool = True
    ) -> Tuple[str, float, str]:
        status = "Normal"
        confidence = 0.8
        suggestion = ""
        
        aroma_lower = aroma.lower()
        color_lower = color.lower()
        temp_optimal = 20 <= temperature_c <= 30
        
        failed_count = 0
        caution_count = 0
        
        if aroma_lower in FermentationAssistantService.AROMA_FAILED:
            failed_count += 1
        elif aroma_lower in FermentationAssistantService.AROMA_CAUTION:
            caution_count += 1
        
        if color_lower in FermentationAssistantService.COLOR_FAILED:
            failed_count += 1
        elif color_lower in FermentationAssistantService.COLOR_CAUTION:
            caution_count += 1
        
        if not temp_optimal:
            caution_count += 1
        
        if incubation_day < 7 and not gas_presence:
            pass
        elif incubation_day >= 7 and not gas_presence:
            caution_count += 1
        
        if failed_count >= 1:
            status = "Failed"
            confidence = 0.9
            suggestion = "Fermentation appears to have failed. Recommend starting over with new batch."
        elif caution_count >= 2:
            status = "Caution"
            confidence = 0.7
            suggestions = []
            if not temp_optimal:
                if temperature_c < 20:
                    suggestions.append("Increase temperature (ideal: 20-30°C)")
                else:
                    suggestions.append("Decrease temperature (ideal: 20-30°C)")
            if aroma_lower in FermentationAssistantService.AROMA_CAUTION:
                suggestions.append("Monitor aroma closely; slight off-smell may resolve")
            if color_lower in FermentationAssistantService.COLOR_CAUTION:
                suggestions.append("Watch for color changes; unexpected shift may indicate contamination")
            suggestion = "; ".join(suggestions) if suggestions else "Continue monitoring closely."
        else:
            status = "Normal"
            confidence = 0.85
            suggestion = "Fermentation progressing normally. Continue monitoring daily."
        
        return status, confidence, suggestion
    
    @staticmethod
    def calculate_health_score(
        status: str,
        confidence: float,
        days_elapsed: int
    ) -> float:
        base_score = {
            "Normal": 80,
            "Caution": 50,
            "Failed": 10
        }.get(status, 50)
        
        confidence_bonus = confidence * 20
        progress_bonus = min(days_elapsed / 90 * 10, 10)
        
        health_score = base_score + (confidence_bonus - 10) + progress_bonus
        return min(100, max(0, health_score))
    
    @staticmethod
    def should_trigger_harvest_alert(
        status: str,
        incubation_day: int,
        gas_presence: bool,
        aroma: str
    ) -> bool:
        ideal_range = 83 <= incubation_day <= 97
        is_normal = status == "Normal"
        ready_signs = gas_presence and aroma.lower() in FermentationAssistantService.AROMA_NORMAL
        
        return ideal_range and is_normal and ready_signs
