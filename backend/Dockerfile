FROM python:3.9-slim

WORKDIR /app

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONIOENCODING=utf-8

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Fix requirements file encoding and install dependencies
RUN cat requirements.txt | tr -d '\r' | tr -d '\0' > requirements_fixed.txt && \
    pip install --no-cache-dir -r requirements_fixed.txt

COPY . .

# Make wait script executable
COPY wait-for-db.sh .
RUN chmod +x wait-for-db.sh

EXPOSE 8000

CMD ["./wait-for-db.sh", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
