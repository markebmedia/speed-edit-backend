import os
import subprocess
import uuid
import shutil

UPLOAD_DIR = "temp_inputs"
OUTPUT_DIR = "temp_outputs"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

def enhance_image_swinir(input_path: str) -> str:
    # Generate unique filename and copy original input into temp_inputs
    original_filename = os.path.basename(input_path)
    unique_filename = f"{uuid.uuid4().hex}_{original_filename}"
    temp_input_path = os.path.join(UPLOAD_DIR, unique_filename)
    shutil.copy(input_path, temp_input_path)

    # Output filename and path
    output_filename = f"enhanced_{unique_filename}"
    output_path = os.path.join(OUTPUT_DIR, output_filename)

    # Call SwinIR enhancement script
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

    # Return the full path of the enhanced image
    return output_path
