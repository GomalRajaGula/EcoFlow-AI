from typing import List
import math

class ProductRecommendationService:
    PRODUCT_TEMPLATES = {
        1: {"name": "Household Cleaner", "ideal_ph": (3.0, 4.0), "ideal_aroma": "sour", "ideal_color": "brown"},
        2: {"name": "Disinfectant", "ideal_ph": (2.5, 3.5), "ideal_aroma": "sour", "ideal_color": "dark_brown"},
        3: {"name": "Liquid Fertilizer", "ideal_ph": (3.5, 5.0), "ideal_aroma": "sweet", "ideal_color": "amber"},
        4: {"name": "Pest Repellent", "ideal_ph": (3.0, 4.0), "ideal_aroma": "sour", "ideal_color": "brown"},
        5: {"name": "Drain Cleaner", "ideal_ph": (2.5, 3.5), "ideal_aroma": "sour", "ideal_color": "dark_brown"},
        6: {"name": "Odor Neutralizer", "ideal_ph": (3.5, 5.0), "ideal_aroma": "sweet", "ideal_color": "light_brown"},
        7: {"name": "Cosmetic Base", "ideal_ph": (4.0, 5.5), "ideal_aroma": "sweet", "ideal_color": "amber"},
        8: {"name": "Animal Feed Additive", "ideal_ph": (3.5, 5.0), "ideal_aroma": "sweet", "ideal_color": "light_brown"},
    }
    
    @staticmethod
    def calculate_compatibility(
        product_id: int,
        final_color: str,
        aroma_intensity: str,
        final_volume_liters: float,
        user_intent: str = "household"
    ) -> float:
        if product_id not in ProductRecommendationService.PRODUCT_TEMPLATES:
            return 0.0
        
        product = ProductRecommendationService.PRODUCT_TEMPLATES[product_id]
        
        color_match = ProductRecommendationService._color_similarity(final_color, product["ideal_color"])
        aroma_match = ProductRecommendationService._aroma_similarity(aroma_intensity, product["ideal_aroma"])
        volume_match = min(final_volume_liters / 10, 1.0)
        intent_bonus = 1.0 if (user_intent == "commercial" and product_id not in [6, 7]) else 1.0
        
        score = (color_match * 0.4 + aroma_match * 0.4 + volume_match * 0.2) * intent_bonus
        return min(100, max(0, score * 100))
    
    @staticmethod
    def _color_similarity(user_color: str, ideal_color: str) -> float:
        user_color_lower = user_color.lower()
        ideal_color_lower = ideal_color.lower()
        
        if user_color_lower == ideal_color_lower:
            return 1.0
        
        color_groups = {
            "brown": ["brown", "dark_brown", "light_brown"],
            "amber": ["amber", "gold", "honey"],
            "dark": ["dark_brown", "black", "very_dark"]
        }
        
        for group_colors in color_groups.values():
            if user_color_lower in group_colors and ideal_color_lower in group_colors:
                return 0.75
        
        return 0.3
    
    @staticmethod
    def _aroma_similarity(user_aroma: str, ideal_aroma: str) -> float:
        user_aroma_lower = user_aroma.lower()
        ideal_aroma_lower = ideal_aroma.lower()
        
        if user_aroma_lower == ideal_aroma_lower:
            return 1.0
        
        if user_aroma_lower in ["sweet", "fruity"] and ideal_aroma_lower in ["sweet", "fruity"]:
            return 0.85
        if user_aroma_lower in ["sour", "tangy"] and ideal_aroma_lower in ["sour", "tangy"]:
            return 0.85
        
        return 0.4
    
    @staticmethod
    def get_ranked_recommendations(
        final_color: str,
        aroma_intensity: str,
        final_volume_liters: float,
        user_intent: str = "household"
    ) -> List[dict]:
        recommendations = []
        
        for product_id, product_info in ProductRecommendationService.PRODUCT_TEMPLATES.items():
            score = ProductRecommendationService.calculate_compatibility(
                product_id, final_color, aroma_intensity, final_volume_liters, user_intent
            )
            recommendations.append({
                "product_id": product_id,
                "name": product_info["name"],
                "compatibility_score": round(score, 2),
                "description": f"{product_info['name']} product recommendation",
                "processing_instruction_summary": f"Use for {product_info['name'].lower()} applications"
            })
        
        recommendations.sort(key=lambda x: x["compatibility_score"], reverse=True)
        return recommendations[:5]
