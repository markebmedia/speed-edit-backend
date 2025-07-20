from fastapi import FastAPI
from routes import cv_enhance, swinir

app = FastAPI()

# Route prefixes
app.include_router(cv_enhance.router, prefix="/cv-enhance")
app.include_router(swinir.router, prefix="/ai-enhance")
