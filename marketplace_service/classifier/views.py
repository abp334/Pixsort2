from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from pathlib import Path
import tempfile

from .classify import analyze_image_and_categorize

BASE_DIR = Path(__file__).resolve().parent
CATEGORIES_PATH = BASE_DIR / "categories.json"


class ClassifyImageView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        if "image" not in request.FILES:
            return Response(
                {"error": "No image file was provided in the 'image' field."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        image_file = request.FILES["image"]

        try:
            image_content = image_file.read()
            print(f"[DEBUG] Received image content size: {len(image_content)} bytes")
            if len(image_content) > 16:
                 print(f"[DEBUG] Header bytes: {image_content[:16].hex()}")
            
            # Call the analysis function with bytes
            results = analyze_image_and_categorize(image_content)

            return Response(results, status=status.HTTP_200_OK)

        except Exception as e:
            error_message = f"An error occurred during image analysis: {str(e)}"
            print(
                f"--- PYTHON SERVICE ERROR --- \n{error_message}\n--------------------------"
            )
            return Response(
                {"error": error_message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
