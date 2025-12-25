import os
from google import genai

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found")

client = genai.Client(api_key=API_KEY)


def ask_ai(question: str, context: str) -> str:
    try:
        prompt = f"""
You are a helpful AI study assistant.

Answer ONLY using the notes below.
If the answer is not present, say so clearly.

NOTES:
{context}

QUESTION:
{question}

Explain in simple student-friendly language.
"""

        response = client.models.generate_content(
            model ="gemini-2.5-flash",
            contents=prompt
        )

        return response.text.strip()

    except Exception as e:
        print(" AI ERROR:", e)
        return "AI is temporarily unavailable. Please try again later."
