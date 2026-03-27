from functools import wraps
from flask import jsonify
from .jwt_utils import get_current_user

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user = get_current_user()

        if not user or user.role != "admin":
            return jsonify({"error": "Admin access required"}), 403

        return f(*args, **kwargs)

    return decorated