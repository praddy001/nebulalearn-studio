from datetime import datetime
from app import db

class Event(db.Model):
    __tablename__ = "event"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)

    event_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    created_by = db.Column(
        db.Integer, db.ForeignKey("user.id"), nullable=False
    )

    creator = db.relationship("User", backref="events")
