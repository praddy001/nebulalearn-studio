import os
import uuid

from flask import Blueprint, request, jsonify, current_app, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename

from ..models import db, File, User
from ..utils.jwt_utils import decode_token
from ..utils.s3_utils import upload_to_s3, delete_from_s3
from ..utils.text_extractor import extract_text_from_file

files_bp = Blueprint("files", __name__, url_prefix="/api/files")
CORS(files_bp, supports_credentials=True)


# --------------------------------------------------
# Helper: get current user from JWT
# --------------------------------------------------
def get_current_user():
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        return None

    token = auth.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        return None

    return User.query.get(payload.get("sub"))


# --------------------------------------------------
# LIST FILES
# --------------------------------------------------
@files_bp.route("/", methods=["GET"])
def list_files():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    files = (
        File.query.filter_by(uploaded_by=user.id).all()
        if user.role == "teacher"
        else File.query.all()
    )

    return jsonify([
        {
            "id": f.id,
            "filename": f.filename,
            "size": f.size,
            "uploaded_at": f.uploaded_at.isoformat(),
            "download_url": f"/api/files/{f.id}/download"
        }
        for f in files
    ])


# --------------------------------------------------
# UPLOAD FILE (TEACHER ONLY)
# --------------------------------------------------
@files_bp.route("/upload", methods=["POST", "OPTIONS"])
def upload_file():
    if request.method == "OPTIONS":
        return "", 200

    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    if user.role != "teacher":
        return jsonify({"error": "Only teachers can upload notes"}), 403

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    uploaded_file = request.files["file"]
    if uploaded_file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    filename = secure_filename(uploaded_file.filename)
    ext = os.path.splitext(filename)[1]
    key = f"{uuid.uuid4().hex}{ext}"

    upload_dir = current_app.config.get("UPLOAD_FOLDER", "uploads")
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, key)
    uploaded_file.save(file_path)

    # ✅ Extract text safely
    extracted_text = extract_text_from_file(file_path)
    if not extracted_text or not extracted_text.strip():
        extracted_text = f"[No readable text extracted from {filename}]"

    file_record = File(
        filename=filename,
        storage_path=file_path,
        mimetype=uploaded_file.mimetype,
        size=os.path.getsize(file_path),
        uploaded_by=user.id,
        content_text=extracted_text
    )

    db.session.add(file_record)
    db.session.commit()

    return jsonify({
        "message": "File uploaded successfully",
        "id": file_record.id
    }), 201


# --------------------------------------------------
# DOWNLOAD FILE
# --------------------------------------------------
@files_bp.route("/<int:file_id>/download", methods=["GET"])
def download_file(file_id):
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    file = File.query.get_or_404(file_id)

    if user.role == "teacher" and file.uploaded_by != user.id:
        return jsonify({"error": "Forbidden"}), 403

    if not os.path.exists(file.storage_path):
        return jsonify({"error": "File not found"}), 404

    return send_file(
        file.storage_path,
        as_attachment=True,
        download_name=file.filename,
        mimetype=file.mimetype
    )


# --------------------------------------------------
# DELETE FILE (TEACHER ONLY)
# --------------------------------------------------
@files_bp.route("/<int:file_id>", methods=["DELETE"])
def delete_file(file_id):
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    file = File.query.get_or_404(file_id)

    if user.role != "teacher" or file.uploaded_by != user.id:
        return jsonify({"error": "Forbidden"}), 403

    try:
        if os.path.exists(file.storage_path):
            os.remove(file.storage_path)
    except Exception:
        pass

    db.session.delete(file)
    db.session.commit()

    return jsonify({"message": "File deleted successfully"})
