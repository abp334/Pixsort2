# Use Python 3.10
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies for OpenCV and others
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements from the subdirectory
# Copy the marketplace service directory
COPY marketplace_service /app/marketplace_service

# Set working directory to the service
WORKDIR /app/marketplace_service

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install pillow-avif-plugin

# Cache dir
RUN mkdir -p /app/cache
ENV XDG_CACHE_HOME=/app/cache

# Create a non-root user (good practice for HF Spaces)
RUN useradd -m -u 1000 user
RUN chown -R user:user /app
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Expose port 7860 (Hugging Face default)
EXPOSE 7860

# Start command (bind to 0.0.0.0:7860)
CMD ["gunicorn", "marketplace_service.wsgi:application", "--bind", "0.0.0.0:7860", "--timeout", "600", "--workers", "2"]
