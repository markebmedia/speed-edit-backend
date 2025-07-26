# swinir_loader.py
import os
import sys
import torch

# ✅ Ensure current dir is on sys.path so imports work in dist/
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from models.network_swinir import SwinIR  # ✅ Import directly from models folder

# ✅ Path to the model file
_ckpt_path = os.path.join(CURRENT_DIR, "model_zoo", "001_classicalSR_DF2K_s64w8_SwinIR-M_x2.pth")

# ✅ Initialize SwinIR model
print("🔄 Loading SwinIR model once at startup...")

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
    upsampler='pixelshuffle',  # ✅ Matches checkpoint
    resi_connection='1conv'
)

_checkpoint = torch.load(_ckpt_path, map_location="cpu")
model.load_state_dict(_checkpoint["params"], strict=True)
model.eval()

print("✅ SwinIR model loaded and ready for enhancement.")

