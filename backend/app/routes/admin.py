from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user, require_role
from app.models.base import ProductTemplate, User
from app.schemas.base import APIResponse, ProductTemplateCreate, ProductTemplateUpdate
from app.services.admin import AdminService

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])

@router.get("/community-stats", response_model=APIResponse)
async def get_community_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    role: str = Depends(require_role("admin", "community_admin", "platform_admin"))
):
    try:
        stats = AdminService.get_community_stats(db)
        return APIResponse(
            status="success",
            data=stats
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/community-trends", response_model=APIResponse)
async def get_community_trends(
    days: int = 30,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    role: str = Depends(require_role("admin", "community_admin", "platform_admin")),
):
    try:
        return APIResponse(
            status="success",
            data=AdminService.get_community_trends(db, days),
        )
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to load community trends")

@router.get("/product-templates", response_model=APIResponse)
async def list_product_templates(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    role: str = Depends(require_role("admin", "platform_admin")),
):
    templates = db.query(ProductTemplate).order_by(ProductTemplate.id).all()
    return APIResponse(
        status="success",
        data={"templates": [
            {
                "id": template.id,
                "name": template.name,
                "description": template.description,
                "processing_instructions": template.processing_instructions,
                "ingredients": template.ingredients,
                "equipment": template.equipment,
                "time_estimate_hours": template.time_estimate_hours,
                "safety_warnings": template.safety_warnings,
                "base_compatibility_score": template.base_compatibility_score,
            }
            for template in templates
        ]},
    )

@router.post("/product-templates", response_model=APIResponse, status_code=status.HTTP_201_CREATED)
async def create_product_template(
    template_data: ProductTemplateCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    role: str = Depends(require_role("admin", "platform_admin")),
):
    existing = db.query(ProductTemplate).filter(ProductTemplate.name == template_data.name).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Product template already exists")
    template = ProductTemplate(**template_data.model_dump())
    db.add(template)
    db.commit()
    db.refresh(template)
    return APIResponse(status="success", message="Product template created", data={"id": template.id})

@router.patch("/product-templates/{template_id}", response_model=APIResponse)
async def update_product_template(
    template_id: int,
    template_data: ProductTemplateUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    role: str = Depends(require_role("admin", "platform_admin")),
):
    template = db.query(ProductTemplate).filter(ProductTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product template not found")
    for field, value in template_data.model_dump(exclude_unset=True).items():
        setattr(template, field, value)
    db.commit()
    return APIResponse(status="success", message="Product template updated", data={"id": template.id})

@router.delete("/product-templates/{template_id}", response_model=APIResponse)
async def delete_product_template(
    template_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    role: str = Depends(require_role("admin", "platform_admin")),
):
    template = db.query(ProductTemplate).filter(ProductTemplate.id == template_id).first()
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product template not found")
    db.delete(template)
    db.commit()
    return APIResponse(status="success", message="Product template deleted", data={"id": template_id})

@router.get("/model-metrics", response_model=APIResponse)
async def get_model_metrics(
    current_user: User = Depends(get_current_user),
    role: str = Depends(require_role("admin", "community_admin", "platform_admin"))
):
    try:
        metrics = AdminService.get_model_metrics()
        return APIResponse(
            status="success",
            data=metrics
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
