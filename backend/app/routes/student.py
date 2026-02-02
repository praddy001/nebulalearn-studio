from flask import Blueprint, jsonify, request
from app.models import User
from app.utils.jwt_utils import token_required, teacher_required

student_bp = Blueprint(
    "student",
    __name__,
    url_prefix="/api/students"
)

@student_bp.route("", methods=["GET", "OPTIONS"])
def get_students():

    # ✅ Allow CORS preflight
    if request.method == "OPTIONS":
        return "", 200

    # 🔐 Protect only the actual GET
    @token_required
    @teacher_required
    def handle_get():
        students = User.query.filter_by(role="student").all()
        return jsonify([
            {
                "id": s.id,
                "name": s.name
            }
            for s in students
        ])

    return handle_get()
