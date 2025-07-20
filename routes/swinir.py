from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from utils.enhance_swinir import enhance_image_swinir
import tempfile
import shutil

router = APIRouter()

@router.post("/")
async def swinir_enhance(file: UploadFile = File(...)):
    try:
        # Save uploaded file to a temporary location with .jpg extension
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_input_path = temp_file.name

        # Enhance image using SwinIR
        output_path = enhance_image_swinir(temp_input_path)

        return FileResponse(
            path=output_path,
            media_type="image/jpeg",
            filename="enhanced.jpg"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


