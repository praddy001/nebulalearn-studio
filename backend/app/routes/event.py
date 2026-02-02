from flask import Blueprint, request, jsonify
from app.models import Event
from datetime import datetime
from app import db
from ..utils.jwt_utils import (
    token_required,
    get_current_user,
    teacher_required,
)

event_bp = Blueprint("events", __name__, url_prefix="/api/events")


# ✅ POST EVENT
@event_bp.route("", methods=["POST", "OPTIONS"])
@token_required
@teacher_required
def post_event():
    # Allow CORS preflight
    if request.method == "OPTIONS":
        return jsonify({"message": "OK"}), 200

    user = get_current_user()
    data = request.json

    event = Event(
        title=data["title"],
        description=data["description"],
        event_date=datetime.strptime(data["date"], "%Y-%m-%d").date(),
        created_by=user.id   # 👈 better than trusting frontend
    )

    db.session.add(event)
    db.session.commit()

    return jsonify({"message": "Event posted successfully"}), 201


# ✅ GET EVENTS
@event_bp.route("", methods=["GET"])
@token_required
def get_events():
    events = Event.query.order_by(Event.event_date.desc()).all()

    result = []
    for e in events:
        result.append({
            "title": e.title,
            "description": e.description,
            "date": e.event_date.strftime("%Y-%m-%d")
        })

    return jsonify(result), 200
