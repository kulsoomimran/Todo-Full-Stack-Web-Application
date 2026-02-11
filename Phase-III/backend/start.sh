#!/bin/bash
# Script to start the FastAPI application

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
elif [ -d "env" ]; then
    source env/bin/activate
fi

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
fi

# Run the application
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload