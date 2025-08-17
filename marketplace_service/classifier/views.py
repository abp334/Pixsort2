from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser  # Use the standard parser
from PIL import Image
from pathlib import Path
import tempfile
from io import BytesIO

from .classify import analyze_image_and_categorize, load_category_map_from_json

BASE_DIR = Path(__file__).resolve().parent
CATEGORIES_PATH = BASE_DIR / "categories.json"


class ClassifyImageView(APIView):
    parser_classes = [MultiPartParser]  # Set the correct parser

    def post(self, request, *args, **kwargs):
        # --- FINAL FIX: Look for the 'image' field ---
        if "image" not in request.FILES:
            return Response(
                {"error": "No image file was provided in the 'image' field."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        image_file = request.FILES["image"]

        try:
            image_bytes = image_file.read()
            image = Image.open(BytesIO(image_bytes))
            image.verify()
            image = Image.open(BytesIO(image_bytes))

            with tempfile.NamedTemporaryFile(
                suffix=".jpg", delete=True
            ) as temp_image_file:
                image.convert("RGB").save(temp_image_file, format="JPEG")
                temp_image_path = Path(temp_image_file.name)
                category_map = load_category_map_from_json(str(CATEGORIES_PATH))

                results = analyze_image_and_categorize(
                    image_path=temp_image_path, device="cpu", category_map=category_map
                )

                return Response(results, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"--- PYTHON SERVICE ERROR --- \n{e}\n--------------------------")
            return Response(
                {"error": f"An error occurred during image analysis: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
