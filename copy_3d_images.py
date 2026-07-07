import shutil
import os

src = r"C:\Users\Shashank Poojari\.gemini\antigravity-ide\brain\adfabd1c-2d40-4192-83ea-5ecf42f740b0"
dst = r"C:\Users\Shashank Poojari\Documents\Printing website\Assets"

files = {
    "hero_printing_press_1783403652514.png": "hero-3d-press.png",
    "komori_lithrone_426_1783403665053.png": "machine-komori-426-3d.png",
    "komori_lithrone_28_1783403688941.png":  "machine-komori-28-3d.png",
    "xerox_docucolor_digital_1783403703558.png": "machine-digital-3d.png",
    "kodak_ctp_prepress_1783403726839.png":  "machine-ctp-3d.png",
    "shoei_folding_machine_1783403738179.png": "machine-folding-3d.png",
    "polar_cutting_machine_1783403758369.png": "machine-cutting-3d.png",
    "services_printing_overview_1783403779286.png": "services-overview-3d.png",
    "portfolio_brochures_1783403790732.png": "portfolio-brochures-3d.png",
}

for src_name, dst_name in files.items():
    src_path = os.path.join(src, src_name)
    dst_path = os.path.join(dst, dst_name)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dst_path)
        print(f"Copied: {dst_name}")
    else:
        print(f"NOT FOUND: {src_name}")

print("Done!")
