import os
import sys
import subprocess

def install_and_import(package):
    try:
        __import__(package)
    except ImportError:
        print(f"Installing {package}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])

# Ensure PyMuPDF (fitz) is installed
try:
    import fitz
except ImportError:
    install_and_import("pymupdf")
    import fitz

def extract_images():
    pdf_path = "Assets/Company Profile Om Graphic.pdf"
    output_dir = "Assets"
    
    if not os.path.exists(pdf_path):
        print(f"PDF file not found at {pdf_path}")
        return

    doc = fitz.open(pdf_path)
    print(f"Opened PDF: {pdf_path} ({len(doc)} pages)")

    # Let's map specific page images to descriptive names based on content
    # Page 2: Mr. Uttam Nimkar (Director)
    # Page 3: Teamwork cloud
    # Page 4: Organisation Chart
    # Page 8: Strength pie chart
    # Page 9: Machines (CTP, Xerox, System, Komori 1, Komori 2, HMT)
    # Page 10: Machines (Pining, Folding, Lamination, Punching, Binding, Sewn)
    # Page 11: Machines (Index, Polar 42, Polar 32, Wiro)

    image_counter = 0
    for page_num in range(len(doc)):
        page = doc[page_num]
        image_list = page.get_images(full=True)
        print(f"Page {page_num + 1} has {len(image_list)} images.")
        
        for img_idx, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            # Map page and index to descriptive name
            name_suffix = f"page_{page_num+1}_img_{img_idx+1}"
            
            # Let's assign specific names if we know what they are
            if page_num == 1 and img_idx == 0:
                filename = "director-uttam-nimkar"
            elif page_num == 2 and img_idx == 0:
                filename = "team-wordcloud"
            elif page_num == 3 and img_idx == 0:
                filename = "org-chart"
            elif page_num == 7 and img_idx == 0:
                filename = "strength-chart"
            else:
                filename = f"extracted_{name_suffix}"
                
            out_path = os.path.join(output_dir, f"{filename}.{image_ext}")
            with open(out_path, "wb") as f:
                f.write(image_bytes)
            print(f"Extracted: {out_path}")
            image_counter += 1
            
    print(f"Total images extracted: {image_counter}")

if __name__ == "__main__":
    extract_images()
