import jwt
import datetime
from flask import current_app, request, g
from functools import wraps
from ..models import User
from flask import abort


def create_access_token(payload: dict, expires_days: int = 7):
    now = datetime.datetime.utcnow()
    exp = now + datetime.timedelta(days=expires_days)
    payload_copy = payload.copy()
    payload_copy.update({"iat": now, "exp": exp})
    token = jwt.encode(payload_copy, current_app.config["JWT_SECRET"], algorithm=current_app.config.get("JWT_ALGORITHM", "HS256"))
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return token

def decode_token(token: str):
    try:
        data = jwt.decode(token, current_app.config["JWT_SECRET"], algorithms=[current_app.config.get("JWT_ALGORITHM", "HS256")])
        return data
    except Exception:
        return None

def get_current_user():
    return getattr(g, "_current_user", None)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth:
            abort(401, description="authorization header required")

        parts = auth.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            abort(401, description="invalid authorization header")

        token = parts[1]
        payload = decode_token(token)
        if not payload or "sub" not in payload:
            abort(401, description="invalid or expired token")

        user = User.query.get(payload["sub"])
        if not user:
            abort(401, description="user not found")

        g._current_user = user
        return f(*args, **kwargs)
    return decorated


def teacher_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user = get_current_user()
        if not user or user.role != "teacher":
            abort(403, description="teacher access required")
        return f(*args, **kwargs)
    return decorated