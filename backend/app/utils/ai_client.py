import os
from google import genai

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found")

client = genai.Client(api_key=API_KEY)


def ask_ai(question: str, context: str = "", history: str = "") -> str:
    try:
        # ----------------------------
        # MODE 1: Notes-based answer
        # ----------------------------
        if context.strip():
            prompt = f"""
You are a helpful AI study assistant.

Use the NOTES and CONVERSATION to answer.
If the answer is not present in notes, you may still answer using your knowledge.

NOTES:
{context}

CONVERSATION:
{history}

QUESTION:
{question}

Explain in simple student-friendly language.
"""

        # ----------------------------
        # MODE 2: Pure AI fallback
        # ----------------------------
        else:
            prompt = f"""
You are a helpful AI study assistant.

Use your general knowledge and conversation history.

CONVERSATION:
{history}

QUESTION:
{question}

Explain clearly in simple student-friendly language.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text.strip()

    except Exception as e:
        print("AI ERROR:", e)
        return "AI is temporarily unavailable. Please try again later."