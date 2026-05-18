from sqlalchemy import Column, String, Float, DateTime, func
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

class AuditLog(Base):
    __tablename__ = "audit_log"

    image_id       = Column(String, primary_key=True)
    timestamp      = Column(DateTime(timezone=True), server_default=func.now())
    filename       = Column(String, nullable=False)
    model_version  = Column(String, nullable=False)
    confidence     = Column(Float, nullable=False)
    risk_level     = Column(String, nullable=False)
    action_taken   = Column(String, nullable=False)
    age            = Column(Float, nullable=True)
    sex            = Column(String, nullable=True)
    site           = Column(String, nullable=True)
