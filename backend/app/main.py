from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db, engine, Base
from app.core.auth import get_current_user
from app.models.base import User, FermentationBatch, FermentationLog, ProductTemplate
from app.schemas.base import (
    FermentationBatchCreate, FermentationBatch as BatchSchema,
    FermentationLogCreate, FermentationLog as LogSchema,
    APIResponse, ErrorResponse
)
from app.services.eco_enzyme import EcoEnzymeService
from app.services.fermentation_assistant import FermentationAssistantService
from app.routes.recommendations import router as rec_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="EcoFlow API", version="0.1.0")

app.include_router(rec_router)

@app.post("/api/v1/batches", response_model=APIResponse)
async def create_batch(
    batch_data: FermentationBatchCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        calc = EcoEnzymeService.calculate_ingredients(batch_data.waste_weight_kg, batch_data.start_date)
        
        new_batch = FermentationBatch(
            user_id=current_user.id,
            name=batch_data.name,
            waste_weight_kg=batch_data.waste_weight_kg,
            water_liters=calc["ideal_water_liters"],
            sugar_kg=calc["ideal_sugar_kg"],
            start_date=batch_data.start_date,
            harvest_date=calc["expected_harvest_date"],
            status="pending_start"
        )
        db.add(new_batch)
        db.commit()
        db.refresh(new_batch)
        
        return APIResponse(
            status="success",
            message="Batch created successfully",
            data={
                "batch_id": new_batch.id,
                "waste_weight_kg": new_batch.waste_weight_kg,
                "calculated_water_liters": new_batch.water_liters,
                "calculated_sugar_kg": new_batch.sugar_kg,
                "expected_harvest_date": new_batch.harvest_date.isoformat()
            }
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@app.get("/api/v1/batches", response_model=APIResponse)
async def list_batches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    batches = db.query(FermentationBatch).filter(FermentationBatch.user_id == current_user.id).all()
    
    batch_data = []
    for batch in batches:
        batch_data.append({
            "id": batch.id,
            "name": batch.name,
            "status": batch.status,
            "waste_weight_kg": batch.waste_weight_kg,
            "water_liters": batch.water_liters,
            "sugar_kg": batch.sugar_kg,
            "start_date": batch.start_date.isoformat(),
            "harvest_date": batch.harvest_date.isoformat() if batch.harvest_date else None,
            "created_at": batch.created_at.isoformat()
        })
    
    return APIResponse(
        status="success",
        data={"batches": batch_data, "total": len(batch_data)}
    )

@app.get("/api/v1/batches/{batch_id}", response_model=APIResponse)
async def get_batch(
    batch_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    batch = db.query(FermentationBatch).filter(
        FermentationBatch.id == batch_id,
        FermentationBatch.user_id == current_user.id
    ).first()
    
    if not batch:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Batch not found")
    
    return APIResponse(
        status="success",
        data={
            "id": batch.id,
            "name": batch.name,
            "status": batch.status,
            "waste_weight_kg": batch.waste_weight_kg,
            "water_liters": batch.water_liters,
            "sugar_kg": batch.sugar_kg,
            "start_date": batch.start_date.isoformat(),
            "harvest_date": batch.harvest_date.isoformat() if batch.harvest_date else None,
            "created_at": batch.created_at.isoformat()
        }
    )

@app.post("/api/v1/batches/{batch_id}/logs", response_model=APIResponse)
async def create_fermentation_log(
    batch_id: int,
    log_data: FermentationLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    batch = db.query(FermentationBatch).filter(
        FermentationBatch.id == batch_id,
        FermentationBatch.user_id == current_user.id
    ).first()
    
    if not batch:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Batch not found")
    
    try:
        incubation_day = (log_data.log_date.date() - batch.start_date.date()).days
        
        status_pred, confidence, suggestion = FermentationAssistantService.classify_fermentation(
            aroma=log_data.aroma,
            color=log_data.color,
            gas_presence=log_data.gas_presence,
            temperature_c=log_data.temperature_c,
            incubation_day=incubation_day
        )
        
        health_score = FermentationAssistantService.calculate_health_score(status_pred, confidence, incubation_day)
        
        harvest_alert = FermentationAssistantService.should_trigger_harvest_alert(
            status_pred, incubation_day, log_data.gas_presence, log_data.aroma
        )
        
        new_log = FermentationLog(
            batch_id=batch_id,
            log_date=log_data.log_date,
            aroma=log_data.aroma,
            color=log_data.color,
            gas_presence=log_data.gas_presence,
            temperature_c=log_data.temperature_c,
            notes=log_data.notes,
            ai_status=status_pred,
            ai_confidence=confidence,
            ai_suggestion=suggestion
        )
        db.add(new_log)
        
        if batch.status == "pending_start":
            batch.status = "in_progress"
        
        db.commit()
        db.refresh(new_log)
        
        return APIResponse(
            status="success",
            message="Log recorded successfully",
            data={
                "log_id": new_log.id,
                "ai_status_prediction": status_pred,
                "ai_confidence_score": confidence,
                "health_score": round(health_score, 2),
                "corrective_action_suggestion": suggestion,
                "harvest_alert_triggered": harvest_alert,
                "incubation_day": incubation_day
            }
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@app.get("/api/v1/batches/{batch_id}/logs", response_model=APIResponse)
async def get_batch_logs(
    batch_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    batch = db.query(FermentationBatch).filter(
        FermentationBatch.id == batch_id,
        FermentationBatch.user_id == current_user.id
    ).first()
    
    if not batch:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Batch not found")
    
    logs = db.query(FermentationLog).filter(FermentationLog.batch_id == batch_id).order_by(FermentationLog.log_date).all()
    
    logs_data = []
    for log in logs:
        logs_data.append({
            "id": log.id,
            "log_date": log.log_date.isoformat(),
            "aroma": log.aroma,
            "color": log.color,
            "gas_presence": log.gas_presence,
            "temperature_c": log.temperature_c,
            "ai_status": log.ai_status,
            "ai_confidence": log.ai_confidence,
            "ai_suggestion": log.ai_suggestion,
            "created_at": log.created_at.isoformat()
        })
    
    return APIResponse(
        status="success",
        data={"logs": logs_data, "total": len(logs_data)}
    )

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
