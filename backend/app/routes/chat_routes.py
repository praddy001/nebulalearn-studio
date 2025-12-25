from flask import Blueprint, request, jsonify
from flask_cors import CORS
from sqlalchemy import or_

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
        #  Auth check
        user = get_current_user(request)
        if not user:
            return jsonify({"error": "Unauthorized"}), 401

        #  Read question
        data = request.get_json() or {}
        question = data.get("question", "").strip()

        if not question:
            return jsonify({"error": "Question required"}), 400

        #  Search notes (filename + content)
        results = File.query.filter(
            or_(
                File.filename.ilike(f"%{question}%"),
                File.content_text.ilike(f"%{question}%")
            )
        ).limit(3).all()

        #  If no notes found
        if not results:
            return jsonify({
                "answer": "I couldn't find this topic in the uploaded notes.",
                "sources": []
            })

        #  Build context for AI
        context = "\n\n".join(
            f"{f.filename}:\n{f.content_text[:1500]}"
            for f in results
            if f.content_text
        )

        if not context.strip():
            all_files = File.query.limit(3).all()

            if not all_files:
                return jsonify({
                    "answer": "No notes are uploaded yet.",
                    "sources": []
                })

            context = "\n\n".join(
                f"{f.filename}:\n{(f.content_text or '')[:1500]}"
                for f in all_files
            )
            
        #  Ask AI (SAFE)
        ai_answer = ask_ai(question, context)

        #  Return response
        return jsonify({
            "answer": ai_answer,
            "sources": [f.filename for f in results]
        })

    except Exception as e:
        #  Never crash Flask
        print(" CHAT ROUTE ERROR:", e)
        return jsonify({
            "answer": "Something went wrong while processing your question.",
            "sources": []
        }), 500
