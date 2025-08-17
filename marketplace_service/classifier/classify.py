import sys
from pathlib import Path
from typing import List, Set, Dict
import json

# Computer Vision and ML
import cv2
import numpy as np
import torch
import nltk
from PIL import Image
from nltk.corpus.reader.wordnet import Synset

# --- One-time NLTK setup ---
try:
    from nltk.corpus import wordnet

    wordnet.ensure_loaded()
except LookupError:
    print("[INFO] First time setup: Downloading WordNet data...")
    nltk.download("wordnet")
    from nltk.corpus import wordnet

    print("[INFO] WordNet download complete.")


# --- Core Functions (Unchanged) ---
def load_category_map_from_json(file_path: str) -> Dict[str, List[Synset]]:
    try:
        with open(file_path, "r") as f:
            json_data = json.load(f)
    except FileNotFoundError:
        raise FileNotFoundError(f"Category file not found at '{file_path}'.")
    except json.JSONDecodeError:
        raise json.JSONDecodeError(f"Could not parse '{file_path}'.")

    category_map = {}
    for category, synset_strings in json_data.items():
        try:
            category_map[category] = [wordnet.synset(s) for s in synset_strings]
        except Exception as e:
            print(
                f"⚠️ Warning: Could not process synset for category '{category}'. Error: {e}"
            )
    print("[INFO] Successfully loaded category map.")
    return category_map


def get_hypernym_chain(synset: Synset) -> Set[Synset]:
    hypernyms = set()
    for s in synset.hypernyms():
        hypernyms.update(get_hypernym_chain(s))
    return hypernyms | {synset}


def get_general_category(
    word: str, category_map: Dict[str, List[Synset]]
) -> str | None:
    search_word = word.replace(" ", "_")
    synsets = wordnet.synsets(search_word)
    if not synsets:
        return None

    all_hypernyms = get_hypernym_chain(synsets[0])
    for category_name, trigger_synsets in category_map.items():
        for trigger in trigger_synsets:
            if trigger in all_hypernyms:
                return category_name
    return None


# --- Main Application Logic (Called by Django) ---
def analyze_image_and_categorize(
    image_path: Path, device: str, category_map: Dict[str, List[Synset]]
) -> Dict:
    """
    Analyzes an image and RETURNS a dictionary with the results.
    """
    print(f"📸 Processing Image: {image_path.name}")

    detailed_labels = []
    general_categories = set()

    image_bgr = load_image_bgr(image_path)

    run_resnet_as_fallback = False
    if detect_faces_and_people(image_bgr):
        yolo_labels = run_yolo_detection(image_path=image_path, device=device)
        if yolo_labels:
            detailed_labels = yolo_labels
            for label in detailed_labels:
                category = get_general_category(label, category_map)
                if category:
                    general_categories.add(category)
        else:
            run_resnet_as_fallback = True
    else:
        run_resnet_as_fallback = True

    if run_resnet_as_fallback:
        top_5_labels = run_resnet_classification(
            image_path=image_path, device=device, topk=5
        )
        if top_5_labels:
            if not detailed_labels:
                detailed_labels.append(top_5_labels[0])
            for label in top_5_labels:
                category = get_general_category(label, category_map)
                if category:
                    general_categories.add(category)

    # --- FINAL FIX: Return a dictionary instead of printing ---
    return {
        "detailed_categories": (
            sorted(list(set(detailed_labels))) if detailed_labels else ["None found"]
        ),
        "overall_categories": (
            sorted(list(general_categories)) if general_categories else ["None found"]
        ),
    }


# --- Model and Image Processing Helpers (Unchanged) ---
class YOOLazyLoader:
    _model = None

    @classmethod
    def get_model(cls):
        if cls._model is None:
            from ultralytics import YOLO

            cls._model = YOLO("yolov8n.pt")
        return cls._model


class ResNetLazyLoader:
    _model = None
    _preprocess = None
    _categories = None

    @classmethod
    def get_model_and_tools(cls):
        if cls._model is None:
            from torchvision import models
            from torchvision.models import ResNet50_Weights

            weights = ResNet50_Weights.DEFAULT
            cls._model = models.resnet50(weights=weights)
            cls._model.eval()
            cls._preprocess = weights.transforms()
            cls._categories = weights.meta["categories"]
        return cls._model, cls._preprocess, cls._categories


def load_image_bgr(image_path: Path) -> np.ndarray:
    image = cv2.imdecode(np.fromfile(str(image_path), dtype=np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError(f"Failed to load image: {image_path}")
    return image


def detect_faces_and_people(image_bgr: np.ndarray) -> bool:
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=5, minSize=(40, 40)
    )
    if len(faces) > 0:
        return True
    hog = cv2.HOGDescriptor()
    hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
    rects, _ = hog.detectMultiScale(
        image_bgr, winStride=(4, 4), padding=(8, 8), scale=1.05
    )
    return len(rects) > 0


def run_yolo_detection(
    image_path: Path, device: str = "cpu", conf: float = 0.25
) -> List[str]:
    model = YOOLazyLoader.get_model()
    results = model.predict(
        source=str(image_path), device=device, conf=conf, verbose=False
    )
    if not results:
        return []
    result = results[0]
    if not result.boxes:
        return []
    names = model.names
    detected_labels = {names.get(int(box.cls[0]), "unknown") for box in result.boxes}
    return list(detected_labels)


def run_resnet_classification(
    image_path: Path, device: str = "cpu", topk: int = 5
) -> List[str]:
    model, preprocess, categories = ResNetLazyLoader.get_model_and_tools()
    model.to(device)
    pil_image = Image.open(image_path).convert("RGB")
    input_tensor = preprocess(pil_image).unsqueeze(0).to(device)
    with torch.inference_mode():
        logits = model(input_tensor)
        probs = torch.nn.functional.softmax(logits, dim=1)[0]
    _, topk_idxs = torch.topk(probs, k=topk)
    return [categories[idx] for idx in topk_idxs.cpu().numpy()]
