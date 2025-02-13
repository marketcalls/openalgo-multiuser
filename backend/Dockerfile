FROM python:3.9-slim

WORKDIR /app

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONIOENCODING=utf-8

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy requirements file
COPY requirements.txt .

# Fix requirements file encoding and install dependencies
RUN cat requirements.txt | tr -d '\r' | tr -d '\0' > requirements_fixed.txt && \
    pip install --no-cache-dir -r requirements_fixed.txt

# Copy the rest of the application
COPY . .

EXPOSE 8000

# Use shell form to execute the wait command
CMD /bin/sh -c 'until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_SERVER" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\q"; do echo "Waiting for PostgreSQL..."; sleep 1; done && uvicorn main:app --host 0.0.0.0 --port 8000'
