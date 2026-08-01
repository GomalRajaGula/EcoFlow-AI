import argparse
import os
import re
import sys

from sqlalchemy.orm import Session

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.base import FermentationBatch, FermentationLog, ProductRecommendation, RoadmapProgress, User
from app.services.storage import MINIO_ENDPOINT, MINIO_BUCKET_NAME, s3_client

STORAGE_URL_PATTERN = re.compile(rf"^({re.escape(MINIO_ENDPOINT)})/{re.escape(MINIO_BUCKET_NAME)}/(.+)$")


def delete_storage_object(image_url: str) -> bool:
    match = STORAGE_URL_PATTERN.match(image_url or "")
    if not match:
        return False
    try:
        s3_client.delete_object(Bucket=MINIO_BUCKET_NAME, Key=match.group(2))
        return True
    except Exception as exc:
        print(f"  (storage delete failed for {image_url}: {exc})")
        return False


def erase_user(db: Session, user_id: str) -> dict:
    summary = {"roadmaps": 0, "recommendations": 0, "logs": 0, "images": 0, "batches": 0, "user": 0}

    batches = db.query(FermentationBatch).filter(FermentationBatch.user_id == user_id).all()
    batch_ids = [b.id for b in batches]

    roadmaps_deleted = db.query(RoadmapProgress).filter(RoadmapProgress.user_id == user_id).delete(synchronize_session=False)
    summary["roadmaps"] = roadmaps_deleted

    recs_deleted = 0
    for batch_id in batch_ids:
        recs_deleted += db.query(ProductRecommendation).filter(ProductRecommendation.batch_id == batch_id).delete(synchronize_session=False)
    summary["recommendations"] = recs_deleted

    logs = db.query(FermentationLog).filter(FermentationLog.batch_id.in_(batch_ids)).all() if batch_ids else []
    for log in logs:
        if delete_storage_object(log.image_url):
            summary["images"] += 1
        summary["logs"] += 1
    if batch_ids:
        db.query(FermentationLog).filter(FermentationLog.batch_id.in_(batch_ids)).delete(synchronize_session=False)

    db.query(FermentationBatch).filter(FermentationBatch.user_id == user_id).delete(synchronize_session=False)
    summary["batches"] = len(batches)

    user = db.query(User).filter(User.id == user_id).first()
    if user:
        db.delete(user)
        summary["user"] = 1

    db.commit()
    return summary


def main():
    parser = argparse.ArgumentParser(description="Erase all data for a user (right-to-erasure compliance)")
    parser.add_argument("--user-id", required=True, help="Firebase UID of the user to erase")
    args = parser.parse_args()

    db = SessionLocal()
    try:
        summary = erase_user(db, args.user_id)
        print(f"Erased user '{args.user_id}': {summary}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
