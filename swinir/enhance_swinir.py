import os
import uuid
import cv2
import numpy as np
import torch
from torchvision.transforms.functional import to_tensor
from swinir.models.network_swinir import SwinIR

# ---- Model init -------------------------------------------------------------
# Matches checkpoint: SwinIR-M classical SR x2 (DF2K, s64, w8)
# Key clues: embed_dim=180, num_heads=6, upsampler='pixelshuffle'

model = SwinIR(
    upscale=2,
    in_chans=3,
    img_size=64,
    window_size=8,
    img_range=1.0,
    depths=[6, 6, 6, 6, 6, 6],
    embed_dim=180,
    num_heads=[6, 6, 6, 6, 6, 6],
    mlp_ratio=2,
    upsampler='pixelshuffle',  # ✅ Correct for this checkpoint
    resi_connection='1conv'
)

# Load checkpoint weights
_ckpt_path = "swinir/model_zoo/001_classicalSR_DF2K_s64w8_SwinIR-M_x2.pth"
_checkpoint = torch.load(_ckpt_path, map_location="cpu")
model.load_state_dict(_checkpoint["params"], strict=True)
model.eval()


def enhance_image_swinir(image_path: str) -> str:
    """Run SwinIR super-resolution/enhancement on a single image path."""
    print("🔧 Starting enhancement...")

    # Read & convert to RGB float32 [0,1]
    img_bgr = cv2.imread(image_path, cv2.IMREAD_COLOR)
    if img_bgr is None:
        raise RuntimeError(f"Failed to read image: {image_path}")
    img = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0

    # To tensor [1,3,H,W]
    img_tensor = to_tensor(img).unsqueeze(0)

    # Inference
    with torch.no_grad():
        out = model(img_tensor).squeeze(0).clamp(0, 1)

    # Back to uint8 RGB
    out_img = (out.permute(1, 2, 0).cpu().numpy() * 255.0).round().astype(np.uint8)

    # Save
    os.makedirs("temp_outputs", exist_ok=True)
    out_path = os.path.join("temp_outputs", f"enhanced_{uuid.uuid4().hex}.jpg")
    cv2.imwrite(out_path, cv2.cvtColor(out_img, cv2.COLOR_RGB2BGR))

    print("✅ Enhancement complete:", out_path)
    return out_path
