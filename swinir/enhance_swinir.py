import os
import sys
import uuid
import cv2
import numpy as np
import torch
from torchvision.transforms.functional import to_tensor

# ✅ Ensure dist/ is on sys.path so "swinir" is visible
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(CURRENT_DIR)
if PARENT_DIR not in sys.path:
    sys.path.insert(0, PARENT_DIR)

from swinir.models.network_swinir import SwinIR

# ---- Model init (loads once) -----------------------------------------------
_ckpt_path = os.path.join(CURRENT_DIR, "model_zoo", "001_classicalSR_DF2K_s64w8_SwinIR-M_x2.pth")

model = SwinIR(
    upscale=2, in_chans=3, img_size=64, window_size=8, img_range=1.0,
    depths=[6,6,6,6,6,6], embed_dim=180, num_heads=[6,6,6,6,6,6],
    mlp_ratio=2, upsampler='pixelshuffle', resi_connection='1conv'
)

model.load_state_dict(torch.load(_ckpt_path, map_location="cpu")["params"], strict=True)
model.eval()


def enhance_image_swinir(image_path: str, output_dir: str = "temp_outputs") -> str:
    """Enhance a single image using SwinIR."""
    img_bgr = cv2.imread(image_path, cv2.IMREAD_COLOR)
    if img_bgr is None:
        raise RuntimeError(f"❌ Failed to read image: {image_path}")

    img = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    img_tensor = to_tensor(img).unsqueeze(0)

    with torch.no_grad():
        out = model(img_tensor).squeeze(0).clamp(0, 1)

    out_img = (out.permute(1, 2, 0).cpu().numpy() * 255).astype(np.uint8)
    os.makedirs(output_dir, exist_ok=True)
    out_path = os.path.join(output_dir, f"enhanced_{uuid.uuid4().hex}.jpg")
    cv2.imwrite(out_path, cv2.cvtColor(out_img, cv2.COLOR_RGB2BGR))

    print(out_path)  # ✅ stdout for EnhanceService
    return out_path


# ✅ CLI support
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python enhance_swinir.py <input_path> <output_path>")
        sys.exit(1)

    result_path = enhance_image_swinir(sys.argv[1], os.path.dirname(sys.argv[2]))
    if result_path != sys.argv[2]:
        os.rename(result_path, sys.argv[2])
        print(sys.argv[2])
