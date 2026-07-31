from datetime import datetime, timedelta, timezone

from sqlalchemy import case, func
from sqlalchemy.orm import Session

from app.models.base import FermentationBatch, FermentationLog, ProductRecommendation, RoadmapProgress, User


class AdminService:
    @staticmethod
    def get_community_stats(db: Session) -> dict:
        total_users = db.query(User).count()
        total_batches = db.query(FermentationBatch).count()
        total_waste = db.query(func.sum(FermentationBatch.waste_weight_kg)).scalar() or 0.0
        normal_logs = db.query(FermentationLog).filter(FermentationLog.ai_status == "Normal").count()
        failed_logs = db.query(FermentationLog).filter(FermentationLog.ai_status == "Failed").count()
        caution_logs = db.query(FermentationLog).filter(FermentationLog.ai_status == "Caution").count()
        total_logs = normal_logs + failed_logs + caution_logs
        success_rate = (normal_logs / total_logs * 100) if total_logs > 0 else 0.0
        users_with_logs = db.query(func.count(func.distinct(FermentationBatch.user_id))).join(
            FermentationLog, FermentationLog.batch_id == FermentationBatch.id
        ).scalar() or 0
        roadmap_users = db.query(func.count(func.distinct(RoadmapProgress.user_id))).scalar() or 0
        recommendation_users = db.query(func.count(func.distinct(FermentationBatch.user_id))).join(
            ProductRecommendation, ProductRecommendation.batch_id == FermentationBatch.id
        ).scalar() or 0

        return {
            "total_users": total_users,
            "total_batches": total_batches,
            "total_waste_processed_kg": float(total_waste),
            "success_rate_percentage": round(success_rate, 2),
            "normal_logs": normal_logs,
            "caution_logs": caution_logs,
            "failed_logs": failed_logs,
            "total_logs": total_logs,
            "users_with_logs": users_with_logs,
            "engagement": {
                "log_adoption_percentage": round((users_with_logs / total_users * 100) if total_users else 0, 2),
                "recommendation_adoption_percentage": round((recommendation_users / total_users * 100) if total_users else 0, 2),
                "roadmap_adoption_percentage": round((roadmap_users / total_users * 100) if total_users else 0, 2),
                "average_logs_per_user": round((total_logs / users_with_logs) if users_with_logs else 0, 2),
            },
        }

    @staticmethod
    def get_community_trends(db: Session, days: int = 30) -> dict:
        safe_days = min(max(days, 7), 90)
        start_date = datetime.now(timezone.utc) - timedelta(days=safe_days - 1)
        log_rows = db.query(
            func.date(FermentationLog.log_date).label("date"),
            func.count(FermentationLog.id).label("logs"),
            func.sum(case((FermentationLog.ai_status == "Normal", 1), else_=0)).label("normal"),
        ).filter(FermentationLog.log_date >= start_date).group_by(
            func.date(FermentationLog.log_date)
        ).order_by(func.date(FermentationLog.log_date)).all()

        trend_by_date = {
            str(row.date): {
                "logs": int(row.logs or 0),
                "normal": int(row.normal or 0),
                "success_rate_percentage": round((int(row.normal or 0) / int(row.logs or 1)) * 100, 2),
            }
            for row in log_rows
        }
        trends = []
        for offset in range(safe_days):
            current_date = (start_date + timedelta(days=offset)).date().isoformat()
            trends.append({"date": current_date, **trend_by_date.get(current_date, {"logs": 0, "normal": 0, "success_rate_percentage": 0})})

        return {"days": safe_days, "trends": trends}

    @staticmethod
    def get_model_metrics() -> dict:
        return {
            "precision": 0.92,
            "recall": 0.89,
            "f1_score": 0.90,
            "total_predictions": 12500,
            "uptime_percentage": 99.9,
            "average_inference_time_ms": 45,
        }
