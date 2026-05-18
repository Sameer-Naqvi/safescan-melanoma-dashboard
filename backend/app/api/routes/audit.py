from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import AuditLog

router = APIRouter()

@router.get("/audit")
def get_audit_log(limit: int = 50, db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return [
        {
            "image_id":      log.image_id,
            "timestamp":     log.timestamp.isoformat() if log.timestamp else None,
            "filename":      log.filename,
            "model_version": log.model_version,
            "confidence":    log.confidence,
            "risk_level":    log.risk_level,
            "action_taken":  log.action_taken,
            "age":           log.age,
            "sex":           log.sex,
            "site":          log.site,
        }
        for log in logs
    ]
