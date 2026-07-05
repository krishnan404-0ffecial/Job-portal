"""Vercel serverless entry point.

Vercel looks for a handler in the api/ directory.
This file imports the FastAPI app from main.py and exposes it
as the ASGI handler that Vercel's Python runtime expects.
"""

import sys
import os

# Add the parent directory (backend root) to sys.path so that
# imports like `from database import ...` and `from routers import ...`
# work correctly in the serverless environment.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
