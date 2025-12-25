import os
import fitz  # PyMuPDF
from docx import Document


def extract_text_from_file(path: str) -> str:
    ext = os.path.splitext(path)[1].lower()

    try:
        # -------- PDF --------
        if ext == ".pdf":
            text = ""
            with fitz.open(path) as doc:
                for page in doc:
                    text += page.get_text()
            return text.strip()

        # -------- DOCX --------
        elif ext == ".docx":
            doc = Document(path)
            return "\n".join(p.text for p in doc.paragraphs).strip()

    except Exception as e:
        print("❌ TEXT EXTRACTION ERROR:", e)

    return ""
