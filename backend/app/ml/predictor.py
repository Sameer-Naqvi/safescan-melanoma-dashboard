import joblib
import numpy as np
import cv2
from skimage.feature import hog
from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parents[3] / "ml_engine" / "models" / "logreg_val.pkl"

model = joblib.load(MODEL_PATH)

# Must match training script exactly
SEX_CATEGORIES  = ["male", "female", "unknown"]
SITE_CATEGORIES = [
    "head/neck", "upper extremity", "lower extremity",
    "torso", "palms/soles", "oral/genital", "unknown"
]

def extract_features(
    image_bytes: bytes,
    age: float = 45.0,
    sex: str = "unknown",
    site: str = "unknown",
    img_size: int = 128
) -> np.ndarray:
    """
    Replicates the exact feature extraction from training:
    HOG + color stats + age + sex one-hot + site one-hot
    """
    # Decode image
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image.")

    img = cv2.resize(img, (img_size, img_size))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # HOG features (matches skimage hog in training)
    hog_features = hog(
        gray,
        orientations=9,
        pixels_per_cell=(16, 16),
        cells_per_block=(2, 2),
        block_norm="L2-Hys",
    )

    # Color stats — mean + std per BGR channel
    img_float = img.astype(np.float32) / 255.0
    color_features = []
    for channel in range(3):
        color_features.append(img_float[:, :, channel].mean())
        color_features.append(img_float[:, :, channel].std())
    color_features = np.array(color_features)

    # Metadata
    age_feature  = np.array([float(age) / 100.0])
    sex_vec      = np.array([1.0 if sex == cat else 0.0 for cat in SEX_CATEGORIES])
    site_vec     = np.array([1.0 if site == cat else 0.0 for cat in SITE_CATEGORIES])

    # Concatenate exactly as in training
    features = np.concatenate([hog_features, color_features, age_feature, sex_vec, site_vec])
    return features


def predict(
    image_bytes: bytes,
    age: float = 45.0,
    sex: str = "unknown",
    site: str = "unknown"
) -> dict:
    features = extract_features(image_bytes, age=age, sex=sex, site=site)
    features = features.reshape(1, -1)

    confidence = float(model.predict_proba(features)[0][1])
    risk_level = "HIGH" if confidence >= 0.80 else "LOW"
    action = "URGENT_REVIEW" if risk_level == "HIGH" else "ROUTINE"

    return {
        "confidence": round(confidence, 4),
        "risk_level": risk_level,
        "action": action,
    }
