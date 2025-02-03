# Backend

FastAPI application for OpenAlgo-Multi User. This directory contains the server-side implementation including API endpoints, database models, and business logic.

## Key Components
- FastAPI application setup
- Database models and migrations
- API endpoints
- WebSocket implementations
- Authentication and authorization
- Trading platform integrations
- Background tasks with Celery

## Setup Instructions

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the development server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000
API documentation will be available at http://localhost:8000/docs
