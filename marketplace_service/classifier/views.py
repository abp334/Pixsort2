from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from pathlib import Path
import tempfile

from .classify import analyze_image_and_categorize, load_category_map_from_json

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
            with tempfile.NamedTemporaryFile(delete=True, suffix=".jpg") as temp_file:
                for chunk in image_file.chunks():
                    temp_file.write(chunk)
                temp_file.flush()

                temp_image_path = Path(temp_file.name)
                category_map = load_category_map_from_json(str(CATEGORIES_PATH))

                results = analyze_image_and_categorize(
                    image_path=temp_image_path, device="cpu", category_map=category_map
                )

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
