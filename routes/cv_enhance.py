from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
import shutil
import os
from uuid import uuid4
from utils.enhance_cv import enhance_image_cv

router = APIRouter()

@router.post("/")
async def cv_enhance(file: UploadFile = File(...)):
    # Save uploaded file to /tmp
    temp_input_path = f"/tmp/{uuid4().hex}_{file.filename}"
    with open(temp_input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run enhancement
    try:
        enhanced_path = enhance_image_cv(temp_input_path)
    except Exception as e:
        return {"error": str(e)}

    return FileResponse(
        enhanced_path,
        media_type="image/jpeg",
        filename="enhanced.jpg"
    )
