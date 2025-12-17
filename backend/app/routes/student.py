from flask import Blueprint, jsonify
from ..utils.jwt_utils import token_required, get_current_user

student_bp = Blueprint("student", __name__)

@student_bp.route("/me", methods=["GET"])
@token_required
def me():
    user = get_current_user()
    return jsonify({
        "id": user.id,
        "email": user.email
    })
