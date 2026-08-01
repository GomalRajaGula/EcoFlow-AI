import argparse
import os
import sys
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.base import FermentationBatch, FermentationLog, ProductRecommendation, RoadmapProgress

TERMINAL_STATUSES = ("harvested", "success")


def main():
    parser = argparse.ArgumentParser(description="Retention cleanup: remove terminal batches older than N days")
    parser.add_argument("--retention-days", type=int, default=int(os.getenv("RETENTION_DAYS", "365")),
                        help="Delete terminal batches older than this (default: RETENTION_DAYS env or 365)")
    parser.add_argument("--apply", action="store_true", help="Actually delete (default: dry-run report only)")
    args = parser.parse_args()

    cutoff = datetime.now(timezone.utc) - timedelta(days=args.retention_days)
    print(f"Cutoff: {cutoff.isoformat()} (older than {args.retention_days} days)")

    db = SessionLocal()
    try:
        candidates = (
            db.query(FermentationBatch)
            .filter(FermentationBatch.status.in_(TERMINAL_STATUSES), FermentationBatch.created_at < cutoff)
            .all()
        )
        print(f"Candidates: {len(candidates)} terminal batch(es)")

        if not args.apply:
            for b in candidates:
                print(f"  [dry-run] batch {b.id} '{b.name}' status={b.status} created={b.created_at}")
            print("Dry-run complete (use --apply to delete)")
            return

        batch_ids = [b.id for b in candidates]
        logs = 0
        recs = 0
        roadmaps = 0
        if batch_ids:
            logs = db.query(FermentationLog).filter(FermentationLog.batch_id.in_(batch_ids)).delete(synchronize_session=False)
            recs = db.query(ProductRecommendation).filter(ProductRecommendation.batch_id.in_(batch_ids)).delete(synchronize_session=False)
            roadmaps = db.query(RoadmapProgress).filter(RoadmapProgress.batch_id.in_(batch_ids)).delete(synchronize_session=False)
            db.query(FermentationBatch).filter(FermentationBatch.id.in_(batch_ids)).delete(synchronize_session=False)
        db.commit()
        print(f"Deleted {len(candidates)} batches, {logs} logs, {recs} recommendations, {roadmaps} roadmaps")
    finally:
        db.close()


if __name__ == "__main__":
    main()
