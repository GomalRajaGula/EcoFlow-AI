class EnvironmentalImpactService:
    """Perhitungan dampak lingkungan dari pengalihan sampah organik."""

    CO2_PER_KG_WASTE = 1.9
    METHANE_PER_KG_WASTE = 0.06
    WATER_SAVED_PER_KG = 5.0
    EQUIVALENT_TREES_PER_TON_CO2 = 45

    @classmethod
    def calculate_batch_impact(cls, waste_weight_kg: float) -> dict:
        """Hitung dampak lingkungan untuk satu batch.

        Args:
            waste_weight_kg: Berat sampah yang dialihkan (kg).

        Returns:
            dict: {"co2_avoided_kg", "methane_avoided_kg",
                   "water_saved_liters", "equivalent_trees_planted"}.
        """
        co2_avoided = waste_weight_kg * cls.CO2_PER_KG_WASTE
        methane_avoided = waste_weight_kg * cls.METHANE_PER_KG_WASTE
        water_saved = waste_weight_kg * cls.WATER_SAVED_PER_KG
        tree_equivalents = (co2_avoided / 1000) * cls.EQUIVALENT_TREES_PER_TON_CO2

        return {
            "co2_avoided_kg": co2_avoided,
            "methane_avoided_kg": methane_avoided,
            "water_saved_liters": water_saved,
            "equivalent_trees_planted": tree_equivalents,
        }

    @classmethod
    def calculate_user_impact(cls, total_waste_kg: float, total_batches: int) -> dict:
        """Hitung dampak agregat untuk seorang user (semua batch)."""
        impact = cls.calculate_batch_impact(total_waste_kg)
        impact["total_batches"] = total_batches
        impact["total_waste_diverted_kg"] = total_waste_kg
        return impact

    @classmethod
    def calculate_impact_summary(cls, batches: list) -> dict:
        """Aggregate dampak dari list object batch (memakai waste_weight_kg)."""
        total_waste_kg = sum(batch.waste_weight_kg for batch in batches if hasattr(batch, 'waste_weight_kg') and batch.waste_weight_kg)
        return cls.calculate_user_impact(total_waste_kg, len(batches))
