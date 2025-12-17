from flask import Blueprint, request, jsonify
from app.routes.notes_routes import search_notes

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    question = data.get("message", "")

    notes = search_notes(question)

    if notes:
        return jsonify({
            "reply": f"📘 From notes:\n{notes[0]}"
        })

    return jsonify({
        "reply": "❌ Not found in notes"
    })
