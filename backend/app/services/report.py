from datetime import datetime, timezone
import io

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

class ReportService:
    @staticmethod
    def generate_business_report(batch_id: int, analysis_data: dict) -> dict:
        timestamp = datetime.now(timezone.utc).isoformat()

        buffer = io.BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4

        y = height - 50
        pdf.setFont("Helvetica-Bold", 16)
        pdf.drawString(50, y, "Business Viability Report")

        y -= 24
        pdf.setFont("Helvetica", 10)
        pdf.drawString(50, y, f"Batch ID: {batch_id}")
        y -= 16
        pdf.drawString(50, y, f"Generated At: {timestamp}")

        y -= 28
        pdf.setFont("Helvetica", 11)
        pdf.drawString(50, y, "This report outlines the commercial viability and financial metrics for your Eco-Enzyme production.")

        y -= 28
        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(50, y, "Financial Summary")

        rows = [
            ("COGS per Liter", analysis_data.get("cogs_per_liter")),
            ("Suggested Retail Price", analysis_data.get("suggested_retail_price")),
            ("Gross Margin (%)", analysis_data.get("gross_margin_percentage")),
            ("Break-even Units (Liters)", analysis_data.get("break_even_units_liters")),
            ("Yearly Net Profit", analysis_data.get("yearly_net_profit")),
            ("Viability Rating", analysis_data.get("viability_rating")),
        ]

        pdf.setFont("Helvetica", 10)
        for label, value in rows:
            y -= 18
            display_value = f"{value:.2f}" if isinstance(value, (float, int)) else str(value)
            pdf.drawString(50, y, f"{label}: {display_value}")

        pdf.showPage()
        pdf.save()
        buffer.seek(0)

        return {
            "title": "Business Viability Report",
            "batch_id": batch_id,
            "generated_at": timestamp,
            "content": buffer.getvalue(),
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
