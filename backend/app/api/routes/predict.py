import os
import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from app.ml.predictor import predict
from app.services.websocket_manager import manager
from app.db.session import get_db
from app.db.models import AuditLog
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()
MODEL_VERSION = os.getenv("MODEL_VERSION", "1.0.0")

@router.post("/predict")
async def predict_image(
    file: UploadFile = File(...),
    age: float = Form(default=45.0),
    sex: str = Form(default="unknown"),
    site: str = Form(default="unknown"),
    db: Session = Depends(get_db),
):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Only JPEG or PNG accepted.")

    image_bytes = await file.read()
    image_id = str(uuid.uuid4())

    try:
        result = predict(image_bytes, age=age, sex=sex, site=site)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")

    # Write to audit log
    log_entry = AuditLog(
        image_id=image_id,
        filename=file.filename,
        model_version=MODEL_VERSION,
        confidence=result["confidence"],
        risk_level=result["risk_level"],
        action_taken=result["action"],
        age=age,
        sex=sex,
        site=site,
    )
    db.add(log_entry)
    db.commit()

    # Broadcast via WebSocket
    await manager.broadcast({
        "type": "ALERT" if result["risk_level"] == "HIGH" else "UPDATE",
        "image_id": image_id,
        "filename": file.filename,
        "confidence": result["confidence"],
        "action": result["action"],
    })

    return {
        "image_id": image_id,
        "filename": file.filename,
        "age": age,
        "sex": sex,
        "site": site,
        **result
    }
