import os
import io
import json
import torch
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
from ultralytics import YOLO
import pillow_avif
import nltk
from nltk.corpus import wordnet

# --- LAZY LOADING SETUP ---
# Define global variables for the models, but don't load them yet.
resnet_model = None
yolo_model = None
category_map = None

# Define the image transformations globally
preprocess = transforms.Compose(
    [
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ]
)


def download_nltk_data():
    """Downloads NLTK data if not already present."""
    try:
        nltk.data.find("corpora/wordnet")
        print("[INFO] WordNet data already downloaded.")
    except LookupError:
        print("[INFO] First time setup: Downloading WordNet data...")
        nltk.download("wordnet", quiet=True)
        print("[INFO] WordNet download complete.")


def load_models_and_map():
    """Loads all models and the category map if they haven't been loaded yet."""
    global resnet_model, yolo_model, category_map

    # Load ResNet model for detailed classification
    if resnet_model is None:
        print("[INFO] Loading ResNet model for the first time...")
        resnet_model = models.resnet152(weights=models.ResNet152_Weights.DEFAULT)
        resnet_model.eval()
        print("[INFO] ResNet model loaded.")

    # Load YOLO model for object detection
    if yolo_model is None:
        print("[INFO] Loading YOLO model for the first time...")
        # Path to the model file at the root of the project
        model_path = os.path.join(os.path.dirname(__file__), "..", "..", "yolov8n.pt")
        yolo_model = YOLO(model_path)
        print("[INFO] YOLO model loaded.")

    # Load the category map
    if category_map is None:
        print("[INFO] Loading category map for the first time...")
        map_path = os.path.join(os.path.dirname(__file__), "categories.json")
        with open(map_path, "r") as f:
            category_map = json.load(f)
        print("[INFO] Category map loaded.")


def get_synonyms(word):
    """Gets synonyms for a word using WordNet."""
    synonyms = set()
    for syn in wordnet.synsets(word):
        for lemma in syn.lemmas():
            synonyms.add(lemma.name().lower())
    return list(synonyms)


def map_to_overall_category(detected_classes):
    """Maps detected classes to broader, overall categories using synonyms."""
    overall_categories = set()
    for cls in detected_classes:
        cls_lower = cls.lower()
    for cls in detected_classes:
        cls_lower = cls.lower()
        # Iterate over all categories and their mapped keywords
        for category, keywords in category_map.items():
            if cls_lower in keywords:
                overall_categories.add(category)
        
        # Keep synonym mapping as backup/enhancement
        synonyms = get_synonyms(cls_lower)
        for synonym in synonyms:
             for category, keywords in category_map.items():
                if synonym in keywords:
                    overall_categories.add(category)

    return list(overall_categories) if overall_categories else ["Miscellaneous"]


def analyze_image_and_categorize(image_source):
    """
    Main function to analyze an image, get detailed and overall categories.
    Args:
        image_source: File path or file-like object (e.g. BytesIO)
    """
    # --- LAZY LOADING TRIGGER ---
    # This will only run on the first call to this function.
    download_nltk_data()
    load_models_and_map()

    try:
        # Check if input is bytes, if so wrap in BytesIO
        if isinstance(image_source, bytes):
            print(f"[DEBUG] classify.py received {len(image_source)} bytes")
            image_source = io.BytesIO(image_source)
        else:
            print(f"[DEBUG] classify.py received {type(image_source)}")
            
        image = Image.open(image_source).convert("RGB")

        # 1. Detailed Classification with ResNet
        input_tensor = preprocess(image)
        input_batch = input_tensor.unsqueeze(0)

        with torch.no_grad():
            output = resnet_model(input_batch)

        probabilities = torch.nn.functional.softmax(output[0], dim=0)

        # Fetch ImageNet labels
        labels_url = (
            "https://raw.githubusercontent.com/pytorch/hub/master/imagenet_classes.txt"
        )
        if not os.path.exists("imagenet_classes.txt"):
            torch.hub.download_url_to_file(labels_url, "imagenet_classes.txt")

        with open("imagenet_classes.txt", "r") as f:
            categories = [s.strip() for s in f.readlines()]

        top5_prob, top5_catid = torch.topk(probabilities, 5)
        detailed_categories = [
            categories[top5_catid[i]] for i in range(top5_prob.size(0))
        ]

        # 2. Object Detection and Overall Categorization with YOLO
        results = yolo_model(image)
        detected_classes = [results[0].names[int(c)] for c in results[0].boxes.cls]

        overall_categories = map_to_overall_category(detected_classes)

        return {
            "detailed_categories": detailed_categories,
            "overall_categories": overall_categories,
        }
    except Exception as e:
        print(f"[ERROR] Error during image analysis: {e}")
        return {
            "detailed_categories": ["Error"],
            "overall_categories": ["Error"],
            "error": str(e),
        }
