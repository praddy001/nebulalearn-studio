from flask import Blueprint, request, jsonify
from flask_cors import CORS
from sqlalchemy import or_
import re
from app.models import File, User
from app.utils.jwt_utils import decode_token
from app.utils.ai_client import ask_ai

chat_bp = Blueprint("chat", __name__, url_prefix="/api/chat")
CORS(chat_bp, supports_credentials=True)


# --------------------------------------------------
# Helper: get current user from JWT
# --------------------------------------------------
def get_current_user(req):
    auth = req.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        return None

    token = auth.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        return None

    return User.query.get(payload.get("sub"))


# --------------------------------------------------
# CHAT / ASK
# --------------------------------------------------
@chat_bp.route("/ask", methods=["POST"])
def ask():
    try:
        user = get_current_user(request)
        print("USER:", user)

        data = request.get_json() or {}
        raw_question = data.get("question", "").strip()
        search_query = normalize_question(raw_question)

        print("RAW QUESTION:", raw_question)
        print("SEARCH QUERY:", search_query)


        if not raw_question:
            return jsonify({
                "answer": "Please enter a question.",
                "sources": []
            }), 400

        results = File.query.filter(
            or_(
                File.filename.ilike(f"%{search_query}%"),
                File.content_text.ilike(f"%{search_query}%")
            )
        ).limit(3).all()

        if not results:
            ai_answer = ask_ai(raw_question, "")
            print("AI FALLBACK ANSWER:", ai_answer)
            return jsonify({
                "answer": ai_answer,
                "sources": []
            })

        context = "\n\n".join(
            f"{f.filename}:\n{(f.content_text or '')[:1500]}"
            for f in results
        )

        ai_answer = ask_ai(raw_question, context)
        print("AI ANSWER:", ai_answer)

        return jsonify({
            "answer": ai_answer,
            "sources": [f.filename for f in results]
        })

    except Exception as e:
        print("CHAT ROUTE ERROR:", e)
        return jsonify({
            "answer": "Something went wrong while processing your question.",
            "sources": []
        }), 500

def normalize_question(question: str) -> str:
    question = question.lower()

    command_words = [
        "explain", "define", "describe", "tell", "tell me", "tell me about",
        "what is", "what are", "can you explain", "can you tell",
        "help me with", "give me", "show me"
    ]

    for cmd in command_words:
        question = re.sub(rf"\b{cmd}\b", "", question, flags=re.IGNORECASE)

    question = re.sub(r"\s+", " ", question).strip()
    return question