import os
import subprocess
import uuid
from fastapi import UploadFile

UPLOAD_DIR = "temp_inputs"
OUTPUT_DIR = "temp_outputs"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

def enhance_image_swinir(file: UploadFile) -> str:
    # Save uploaded image to disk
    input_filename = f"{uuid.uuid4().hex}_{file.filename}"
    input_path = os.path.join(UPLOAD_DIR, input_filename)
    with open(input_path, "wb") as f:
        f.write(file.file.read())

    # Output file path
    output_filename = f"enhanced_{input_filename}"
    output_path = os.path.join(OUTPUT_DIR, output_filename)

    # Run enhancement using your SwinIR script
    command = [
        "python3", "SwinIR/main_test_swinir.py",
        "--task", "real_image_sr",
        "--scale", "2",
        "--model_path", "SwinIR/model_zoo/003_realSR_BSRGAN_DFOWMFC_s64w8_SwinIR-M_x2.pth",
        "--folder_lq", UPLOAD_DIR,
        "--tile", "0",
        "--folder_out", OUTPUT_DIR
    ]

    subprocess.run(command, check=True)

    return output_path
