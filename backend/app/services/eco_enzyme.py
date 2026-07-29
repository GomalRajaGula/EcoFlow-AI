from datetime import datetime, timedelta

class EcoEnzymeService:
    @staticmethod
    def calculate_ingredients(waste_kg: float) -> dict:
        ideal_water = waste_kg * 3
        ideal_sugar = waste_kg * 1
        expected_harvest_days = 90
        
        return {
            "ideal_water_liters": ideal_water,
            "ideal_sugar_kg": ideal_sugar,
            "expected_harvest_date": datetime.utcnow() + timedelta(days=expected_harvest_days)
        }
    
    @staticmethod
    def check_ingredient_deviation(
        waste_kg: float,
        user_water: float,
        user_sugar: float,
        threshold: float = 0.1
    ) -> dict:
        ideal = EcoEnzymeService.calculate_ingredients(waste_kg)
        ideal_water = ideal["ideal_water_liters"]
        ideal_sugar = ideal["ideal_sugar_kg"]
        
        water_deviation = abs(user_water - ideal_water) / ideal_water
        sugar_deviation = abs(user_sugar - ideal_sugar) / ideal_sugar
        
        warnings = []
        if water_deviation > threshold:
            warnings.append(f"Water deviation: {water_deviation*100:.1f}% (threshold: {threshold*100}%)")
        if sugar_deviation > threshold:
            warnings.append(f"Sugar deviation: {sugar_deviation*100:.1f}% (threshold: {threshold*100}%)")
        
        return {
            "water_deviation": water_deviation,
            "sugar_deviation": sugar_deviation,
            "has_warning": len(warnings) > 0,
            "warnings": warnings
        }
