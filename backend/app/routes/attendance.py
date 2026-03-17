from flask import Blueprint, request, jsonify
from datetime import datetime

from app import db
from app.models import Attendance
from ..utils.jwt_utils import (
    token_required,
    teacher_required,
    get_current_user,
)

attendance_bp = Blueprint(
    "attendance",
    __name__,
    url_prefix="/api/attendance"
)

@attendance_bp.route("", methods=["POST", "OPTIONS"])
def mark_attendance():

    # ✅ CORS preflight must bypass auth
    if request.method == "OPTIONS":
        return "", 200

    # ✅ Apply auth ONLY for POST
    @token_required
    @teacher_required
    def handle_post():
        data = request.get_json()

        attendance = Attendance(
            student_id=data["student_id"],
            date=datetime.strptime(data["date"], "%Y-%m-%d").date(),
            status=data["status"]
        )

        db.session.add(attendance)
        db.session.commit()

        return jsonify({"message": "Attendance marked successfully"}), 201

    return handle_post()

@attendance_bp.route("/bulk", methods=["POST", "OPTIONS"])
def bulk_attendance():

    # ✅ Allow CORS preflight
    if request.method == "OPTIONS":
        return "", 200

    @token_required
    @teacher_required
    def handle_post():
        data = request.get_json()

        date = datetime.strptime(data["date"], "%Y-%m-%d").date()
        records = data["records"]

        for record in records:
            attendance = Attendance(
                student_id=record["student_id"],
                date=date,
                status=record["status"]
            )
            db.session.add(attendance)

        db.session.commit()

        return jsonify({"message": "Bulk attendance saved"}), 201

    return handle_post()

@attendance_bp.route("/student", methods=["GET", "OPTIONS"])
def get_my_attendance():

    # ✅ Allow CORS preflight WITHOUT auth
    if request.method == "OPTIONS":
        return "", 200

    # 🔐 Apply auth ONLY for GET
    @token_required
    def handle_get():
        user = get_current_user()  # student from JWT
        print("Logged-in student ID:", user.id)

        records = Attendance.query.filter_by(student_id=user.id).all()

        return jsonify([
            {
                "date": r.date.strftime("%Y-%m-%d"),
                "status": r.status
            }
            for r in records
        ]), 200

    return handle_get()

@attendance_bp.route("/students-summary", methods=["GET", "OPTIONS"])
def get_students_summary():

    if request.method == "OPTIONS":
        return "", 200

    @token_required
    @teacher_required
    def handle_get():

        from app.models import User

        students = User.query.filter_by(role="student").all()

        result = []

        for s in students:

            records = Attendance.query.filter_by(student_id=s.id).all()

            total = len(records)
            present = len([r for r in records if r.status.lower() == "present"])
            absent = total - present

            percentage = (present / total * 100) if total > 0 else 0

            result.append({
                "id": s.id,
                "name": s.name,
                "email": s.email,
                "total_classes": total,
                "present": present,
                "absent": absent,
                "percentage": round(percentage, 2)
            })

        return jsonify(result)

    return handle_get()
