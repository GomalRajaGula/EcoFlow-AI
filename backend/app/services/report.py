from datetime import datetime, timezone

class ReportService:
    @staticmethod
    def generate_business_report(batch_id: int, analysis_data: dict) -> dict:
        timestamp = datetime.now(timezone.utc).isoformat()
        
        return {
            "title": "Business Viability Report",
            "batch_id": batch_id,
            "generated_at": timestamp,
            "summary": "This report outlines the commercial viability and financial metrics for your Eco-Enzyme production.",
            "sections": [
                {
                    "title": "Production Cost Analysis",
                    "content": analysis_data.get("cost_analysis", {})
                },
                {
                    "title": "Market Potential",
                    "content": analysis_data.get("market_potential", {})
                },
                {
                    "title": "Profitability Forecast",
                    "content": analysis_data.get("profitability", {})
                }
            ],
            "raw_data": analysis_data
        }

    @staticmethod
    def generate_roadmap_report(batch_id: int, roadmap_data: dict) -> dict:
        timestamp = datetime.now(timezone.utc).isoformat()
        
        return {
            "title": "Commercialization Roadmap Report",
            "batch_id": batch_id,
            "generated_at": timestamp,
            "summary": "This roadmap provides a step-by-step guide to transforming your eco-enzyme into a commercial product.",
            "sections": [
                {
                    "title": "Product Strategy",
                    "content": roadmap_data.get("strategy", {})
                },
                {
                    "title": "Action Plan",
                    "content": roadmap_data.get("steps", [])
                },
                {
                    "title": "Milestones & Timeline",
                    "content": roadmap_data.get("milestones", {})
                }
            ],
            "raw_data": roadmap_data
        }
