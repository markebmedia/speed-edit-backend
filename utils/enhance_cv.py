# speed-edit-backend/utils/enhance_cv.py

import cv2
import numpy as np
import os
from uuid import uuid4

def enhance_image_cv(input_path: str, output_dir: str = "/tmp") -> str:
    img = cv2.imread(input_path)
    if img is None:
        raise ValueError(f"❌ Failed to load image. Check path: {input_path}")

    # === Enhancement Steps ===

    # 1. Auto white balance (approximate)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(img)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    limg = cv2.merge((cl, a, b))
    img = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)

    # 2. Brightness/contrast
    alpha = 1.15  # Contrast
    beta = 10     # Brightness
    img = cv2.convertScaleAbs(img, alpha=alpha, beta=beta)

    # 3. Slight sharpening
    kernel = np.array([[0, -1, 0],
                       [-1, 5, -1],
                       [0, -1, 0]])
    img = cv2.filter2D(img, -1, kernel)

    # Optional denoising
    # img = cv2.fastNlMeansDenoisingColored(img, None, 10, 10, 7, 21)

    # Save result
    filename = f"{uuid4().hex}.jpg"
    output_path = os.path.join(output_dir, filename)
    cv2.imwrite(output_path, img)

    return output_path
