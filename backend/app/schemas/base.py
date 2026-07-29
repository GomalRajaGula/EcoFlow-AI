from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: str
    role: str
    waste_diverted_kg: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class FermentationBatchBase(BaseModel):
    name: str
    waste_weight_kg: float

class FermentationBatchCreate(FermentationBatchBase):
    start_date: datetime

class FermentationBatchUpdate(BaseModel):
    water_liters: Optional[float] = None
    sugar_kg: Optional[float] = None

class FermentationBatch(FermentationBatchBase):
    id: int
    user_id: str
    status: str
    water_liters: float
    sugar_kg: float
    start_date: datetime
    harvest_date: Optional[datetime] = None
    final_volume_liters: Optional[float] = None
    final_color: Optional[str] = None
    final_aroma_intensity: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class FermentationLogBase(BaseModel):
    log_date: datetime
    aroma: str
    color: str
    gas_presence: bool
    temperature_c: float
    notes: Optional[str] = None

class FermentationLogCreate(FermentationLogBase):
    pass

class FermentationLog(FermentationLogBase):
    id: int
    batch_id: int
    ai_status: Optional[str] = None
    ai_confidence: Optional[float] = None
    ai_suggestion: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class ProductTemplateBase(BaseModel):
    name: str
    description: str
    processing_instructions: str
    ingredients: dict
    equipment: dict
    time_estimate_hours: float
    safety_warnings: str
    base_compatibility_score: float = 0.5

class ProductTemplate(ProductTemplateBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ProductRecommendationItem(BaseModel):
    product_id: int
    name: str
    compatibility_score: float
    description: str

class ProductRecommendation(BaseModel):
    id: int
    batch_id: int
    recommended_products: List[ProductRecommendationItem]
    selected_product_id: Optional[int] = None
    is_commercial_orientation: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class APIResponse(BaseModel):
    status: str
    message: Optional[str] = None
    data: Optional[dict] = None

class ErrorResponse(BaseModel):
    status: str
    code: str
    message: str
    details: Optional[dict] = None

class PaginationResponse(BaseModel):
    total_items: int
    total_pages: int
    current_page: int
    page_size: int
    next_page: Optional[int] = None
    prev_page: Optional[int] = None
    data: list
