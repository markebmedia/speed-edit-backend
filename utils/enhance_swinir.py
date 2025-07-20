def enhance_image_swinir(input_path: str) -> str:
    import os
    import subprocess
    import uuid

    OUTPUT_DIR = "temp_outputs"
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Create output file path
    output_filename = f"enhanced_{uuid.uuid4().hex}.jpg"
    output_path = os.path.join(OUTPUT_DIR, output_filename)

    # Run enhancement using SwinIR
    command = [
        "python3", "swinir/main_test_swinir.py",
        "--task", "classical_sr",
        "--scale", "2",
        "--model_path", "swinir/model_zoo/001_classicalSR_DF2K_s64w8_SwinIR-M_x2.pth",
        "--folder_lq", os.path.dirname(input_path),
        "--tile", "0",
        "--folder_out", OUTPUT_DIR
    ]

    result = subprocess.run(command, capture_output=True, text=True)
    print("STDOUT:", result.stdout)
    print("STDERR:", result.stderr)

    if result.returncode != 0:
        raise RuntimeError(f"Enhancement failed: {result.stderr}")

    return output_path



