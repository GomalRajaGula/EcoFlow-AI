class EnvironmentalImpactService:
    CO2_PER_KG_WASTE = 1.9
    METHANE_PER_KG_WASTE = 0.06
    WATER_SAVED_PER_KG = 5.0
    EQUIVALENT_TREES_PER_TON_CO2 = 45

    @classmethod
    def calculate_batch_impact(cls, waste_weight_kg: float) -> dict:
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
        impact = cls.calculate_batch_impact(total_waste_kg)
        impact["total_batches"] = total_batches
        impact["total_waste_diverted_kg"] = total_waste_kg
        return impact

    @classmethod
    def calculate_impact_summary(cls, batches: list) -> dict:
        total_waste_kg = sum(batch.waste_weight_kg for batch in batches if hasattr(batch, 'waste_weight_kg') and batch.waste_weight_kg)
        return cls.calculate_user_impact(total_waste_kg, len(batches))
