import cv2
import numpy as np
import os
import sys
from uuid import uuid4

DEFAULT_OUTPUT_DIR = "/opt/render/project/src/temp_outputs"

def enhance_image_cv(input_path: str, output_target: str = DEFAULT_OUTPUT_DIR) -> str:
    img = cv2.imread(input_path)
    if img is None:
        raise ValueError(f"❌ Failed to load image. Check path: {input_path}")

    # === Enhancement Steps ===
    img = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(img)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    limg = cv2.merge((cl, a, b))
    img = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)

    alpha = 1.15
    beta = 10
    img = cv2.convertScaleAbs(img, alpha=alpha, beta=beta)

    kernel = np.array([[0, -1, 0],
                       [-1, 5, -1],
                       [0, -1, 0]])
    img = cv2.filter2D(img, -1, kernel)

    # ✅ If output_target ends with .jpg/.png, treat it as a file path
    if output_target.lower().endswith(('.jpg', '.jpeg', '.png')):
        output_path = output_target
    else:
        filename = f"{uuid4().hex}.jpg"
        output_path = os.path.join(output_target, filename)

    cv2.imwrite(output_path, img)
    print(output_path)  # ✅ Output the exact file path
    return output_path

if __name__ == "__main__":
    input_path = sys.argv[1]
    output_target = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_OUTPUT_DIR
    enhance_image_cv(input_path, output_target)
