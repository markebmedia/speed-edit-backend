# app/main.py
from fastapi import FastAPI

app = FastAPI()

# ✅ Health check for debugging
@app.get("/")
def read_root():
    return {"message": "Speed Edit Backend is live"}

# ✅ Try/except for safe router loading
try:
    from routes import cv_enhance, swinir
    app.include_router(cv_enhance.router, prefix="/enhance-cv")
    app.include_router(swinir.router, prefix="/enhance-swinir")
except Exception as e:
    import traceback
    print("❌ Error during route loading:", e)
    traceback.print_exc()
