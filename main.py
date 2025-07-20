from fastapi import FastAPI
from routes import cv_enhance

app = FastAPI()

app.include_router(cv_enhance.router, prefix="/cv-enhance")

