import os
from flask import Blueprint, request, jsonify

notes_bp = Blueprint("notes", __name__)

NOTES_FOLDER = "uploads"

def search_notes(question):
    results = []
    for file in os.listdir(NOTES_FOLDER):
        if file.endswith(".txt"):
            with open(os.path.join(NOTES_FOLDER, file), encoding="utf-8") as f:
                content = f.read()
                if question.lower() in content.lower():
                    results.append(content[:500])  # short answer
    return results

@notes_bp.route("/notes/search", methods=["POST"])
def notes_search():
    data = request.get_json()
    question = data.get("question", "")

    matches = search_notes(question)

    if matches:
        return jsonify({
            "found": True,
            "answer": matches[0]
        })

    return jsonify({
        "found": False
    })
