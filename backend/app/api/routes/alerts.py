from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.websocket_manager import manager

router = APIRouter()

@router.websocket("/ws/alerts")
async def websocket_alerts(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive, listen for pings
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket)