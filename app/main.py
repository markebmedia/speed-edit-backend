from fastapi import FastAPI
from routes import cv_enhance, swinir

app = FastAPI()

# Simple root endpoint for testing
@app.get("/")
def read_root():
    return {"message": "Speed Edit Backend is live"}

# Route prefixes
app.include_router(cv_enhance.router, prefix="/cv-enhance")
app.include_router(swinir.router, prefix="/ai-enhance")
