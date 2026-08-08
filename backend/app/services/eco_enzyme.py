from datetime import datetime, timedelta

class EcoEnzymeService:
    """Perhitungan rasio bahan eco-enzyme (1 : 3 : 10 = gula : sampah : air)."""

    @staticmethod
    def calculate_ingredients(waste_kg: float, start_date: datetime = None) -> dict:
        """Hitung kebutuhan air, gula, dan tanggal panen dari berat sampah.

        Args:
            waste_kg: Berat sampah organik (kg).
            start_date: Tanggal mulai fermentasi (default: sekarang).

        Returns:
            dict: {"ideal_water_liters", "ideal_sugar_kg", "expected_harvest_date"}.
                Air = 3x berat sampah, gula = 1x berat, panen = +90 hari.
        """
        ideal_water = waste_kg * 3
        ideal_sugar = waste_kg * 1
        expected_harvest_days = 90
        
        base_date = start_date if start_date else datetime.utcnow()
        
        return {
            "ideal_water_liters": ideal_water,
            "ideal_sugar_kg": ideal_sugar,
            "expected_harvest_date": base_date + timedelta(days=expected_harvest_days)
        }
    
    @staticmethod
    def check_ingredient_deviation(
        waste_kg: float,
        user_water: float,
        user_sugar: float,
        threshold: float = 0.1
    ) -> dict:
        """Cek deviasi bahan user terhadap rasio ideal.

        Args:
            waste_kg: Berat sampah (kg).
            user_water: Air yang dipakai user (L).
            user_sugar: Gula yang dipakai user (kg).
            threshold: Ambang deviasi yang ditoleransi (default 0.1 = 10%).

        Returns:
            dict: {"water_deviation", "sugar_deviation", "has_warning", "warnings"}.
        """
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
