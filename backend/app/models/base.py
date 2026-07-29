from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    role = Column(String, default="user")
    waste_diverted_kg = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    batches = relationship("FermentationBatch", back_populates="user")

class FermentationBatch(Base):
    __tablename__ = "fermentation_batches"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String)
    status = Column(String, default="pending")
    waste_weight_kg = Column(Float)
    water_liters = Column(Float)
    sugar_kg = Column(Float)
    start_date = Column(DateTime)
    harvest_date = Column(DateTime, nullable=True)
    final_volume_liters = Column(Float, nullable=True)
    final_color = Column(String, nullable=True)
    final_aroma_intensity = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="batches")
    logs = relationship("FermentationLog", back_populates="batch")
    recommendation = relationship("ProductRecommendation", back_populates="batch", uselist=False)

class FermentationLog(Base):
    __tablename__ = "fermentation_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("fermentation_batches.id"))
    log_date = Column(DateTime)
    aroma = Column(String)
    color = Column(String)
    gas_presence = Column(Boolean)
    temperature_c = Column(Float)
    notes = Column(Text, nullable=True)
    ai_status = Column(String, nullable=True)
    ai_confidence = Column(Float, nullable=True)
    ai_suggestion = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    batch = relationship("FermentationBatch", back_populates="logs")

class ProductTemplate(Base):
    __tablename__ = "product_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    processing_instructions = Column(Text)
    ingredients = Column(JSON)
    equipment = Column(JSON)
    time_estimate_hours = Column(Float)
    safety_warnings = Column(Text)
    base_compatibility_score = Column(Float, default=0.5)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ProductRecommendation(Base):
    __tablename__ = "product_recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("fermentation_batches.id"), unique=True)
    recommended_products_json = Column(JSON)
    selected_product_id = Column(Integer, ForeignKey("product_templates.id"), nullable=True)
    selection_date = Column(DateTime, nullable=True)
    is_commercial_orientation = Column(Boolean, default=False)
    business_analysis_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    batch = relationship("FermentationBatch", back_populates="recommendation")
