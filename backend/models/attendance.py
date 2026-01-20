from datetime import date
from app import db

class Attendance(db.Model):
    __tablename__ = "attendance"

    id = db.Column(db.Integer, primary_key=True)

    student_id = db.Column(
        db.Integer, db.ForeignKey("user.id"), nullable=False
    )

    subject = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, default=date.today)
    status = db.Column(db.String(10), nullable=False)  # present / absent

    marked_by = db.Column(
        db.Integer, db.ForeignKey("user.id"), nullable=False
    )

    student = db.relationship(
        "User", foreign_keys=[student_id], backref="attendance_records"
    )

    teacher = db.relationship(
        "User", foreign_keys=[marked_by]
    )
