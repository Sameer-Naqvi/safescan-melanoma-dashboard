from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.ml.predictor import predict
from app.services.websocket_manager import manager
import uuid

router = APIRouter()

@router.post("/predict")
async def predict_image(
    file: UploadFile = File(...),
    age: float = Form(default=45.0),
    sex: str = Form(default="unknown"),
    site: str = Form(default="unknown"),
):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Only JPEG or PNG accepted.")

    image_bytes = await file.read()
    image_id = str(uuid.uuid4())

    try:
        result = predict(image_bytes, age=age, sex=sex, site=site)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")

    response = {
        "image_id": image_id,
        "filename": file.filename,
        "age": age,
        "sex": sex,
        "site": site,
        **result
    }

    # Broadcast to all connected dashboards if HIGH risk
    if result["risk_level"] == "HIGH":
        await manager.broadcast({
            "type": "ALERT",
            "image_id": image_id,
            "filename": file.filename,
            "confidence": result["confidence"],
            "action": result["action"],
        })
    else:
        await manager.broadcast({
            "type": "UPDATE",
            "image_id": image_id,
            "filename": file.filename,
            "confidence": result["confidence"],
            "action": result["action"],
        })

    return response