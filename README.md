# SafeScan — Real-Time Healthcare Triage Dashboard

A full-stack, containerized web application that simulates a hospital imaging environment. Medical scans are analyzed by a machine learning model in real-time, with high-risk findings instantly broadcast to a live dashboard via WebSockets.


## Tech Stack

| Layer      | Technology                       | Purpose                                               |
|------------|----------------------------------|-------------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS     | Real-time dashboard UI                                |
| Backend    | FastAPI, Python 3.11             | Async REST API and WebSocket server                   |
| ML Engine  | scikit-learn, OpenCV, skimage    | HOG + color feature extraction, Logistic Regression   |
| Database   | PostgreSQL 15, SQLAlchemy        | Persistent audit logging                              |
| Real-time  | WebSockets (native FastAPI)      | Instant alert streaming to connected clients          |
| DevOps     | Docker, Docker Compose           | Full stack containerization                           |

---

## ML Pipeline

The model was trained on the **ISIC 2020 Melanoma Detection Dataset** using a supervised binary classification approach.

**Feature Extraction (per image):**
- HOG (Histogram of Oriented Gradients) — 128x128 grayscale, 9 orientations, 16x16 cells
- Color statistics — mean and standard deviation per BGR channel (6 values)
- Patient metadata — age (normalized), sex (one-hot), anatomical site (one-hot)

**Model:** Logistic Regression with StandardScaler, trained with class_weight="balanced" to handle dataset imbalance between benign and malignant cases.

**Triage Logic:**
- Confidence >= 80% — HIGH risk — WebSocket URGENT_REVIEW alert
- Confidence < 80% — LOW risk — ROUTINE log entry

---

## Features

### Phase 1 — ML Inference API
- POST /api/v1/predict accepts a JPEG/PNG image with optional patient metadata
- Returns image_id, confidence, risk_level, and action as JSON
- Interactive API docs at /docs (Swagger UI)

### Phase 2 — Real-Time Alert System
- WebSocket endpoint at ws://localhost:8000/api/v1/ws/alerts
- Every prediction broadcasts to all connected dashboard clients instantly
- HIGH risk triggers a red alert banner and session stats update

### Phase 3 — Audit Log
- Every prediction is persisted to PostgreSQL with full traceability
- Logged fields: timestamp, image_id, filename, model_version, confidence, risk_level, action_taken, age, sex, site
- Audit table visible in the dashboard, auto-refreshing every 10 seconds
- Directly addresses maintaining system documentation and verification of incidents requirements

---

## Getting Started

### Option A — Docker (recommended)

```bash
git clone https://github.com/Sameer-Naqvi/safescan-melanoma-dashboard.git
cd safescan-melanoma-dashboard

# Add your model file
cp /path/to/logreg_val.pkl ml_engine/models/logreg_val.pkl

docker-compose up --build
```

Visit http://localhost:5173

### Option B — Local Development

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Database:**
```sql
CREATE DATABASE safescan_db;
CREATE USER safescan_user WITH PASSWORD 'safescan_pass';
GRANT ALL PRIVILEGES ON DATABASE safescan_db TO safescan_user;
```

## Author

**Sameer Naqvi**
[GitHub](https://github.com/Sameer-Naqvi)