from flask import Blueprint, request, jsonify
from ..models import db, User
from ..utils.jwt_utils import (
    create_access_token,
    token_required,
    get_current_user,
)

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


# ----------------------------
# REGISTER (Student + Teacher)
# ----------------------------
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    role = data.get("role", "student")

    # ✅ Validation
    if not name or not email or not password:
        return jsonify({"error": "missing required fields"}), 400

    if len(password) < 8:
        return jsonify({"error": "password must be at least 8 characters"}), 400

    if role not in ("student", "teacher"):
        return jsonify({"error": "invalid role"}), 400

    # ✅ Duplicate email check
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "email already registered"}), 400

    # ✅ Create user
    user = User(name=name, email=email, role=role)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    # ✅ JWT
    token = create_access_token({
        "sub": user.id,
        "role": user.role,
    })

    return jsonify({
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
        }
    }), 201


# ----------------------------
# LOGIN
# ----------------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "email and password required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "invalid credentials"}), 401

    token = create_access_token({
        "sub": user.id,
        "role": user.role,
    })

    return jsonify({
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
        }
    }), 200


# ----------------------------
# CURRENT USER (FOR DASHBOARD)
# ----------------------------
@auth_bp.route("/me", methods=["GET"])
@token_required
def me():
    user = get_current_user()
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
    }), 200
