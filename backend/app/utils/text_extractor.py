import os

def extract_text_from_file(file_path: str) -> str:
    """
    Extract text from uploaded files.
    Currently supports TXT files.
    PDF/DOCX support can be added later.
    """
    if not os.path.exists(file_path):
        return ""

    ext = os.path.splitext(file_path)[1].lower()

    try:
        if ext == ".txt":
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()

        elif ext in [".pdf", ".docx"]:
            # Placeholder for future implementation
            return ""

        else:
            return ""
    except Exception as e:
        print("Text extraction error:", e)
        return ""
