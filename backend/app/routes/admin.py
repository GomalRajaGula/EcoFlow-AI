from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user, require_role
from app.models.base import User
from app.schemas.base import APIResponse
from app.services.admin import AdminService

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])

@router.get("/community-stats", response_model=APIResponse)
async def get_community_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    role: str = Depends(require_role("admin"))
):
    try:
        stats = AdminService.get_community_stats(db)
        return APIResponse(
            status="success",
            data=stats
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/model-metrics", response_model=APIResponse)
async def get_model_metrics(
    current_user: User = Depends(get_current_user),
    role: str = Depends(require_role("admin"))
):
    try:
        metrics = AdminService.get_model_metrics()
        return APIResponse(
            status="success",
            data=metrics
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
