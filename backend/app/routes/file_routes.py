import os
import io
import uuid

from flask import Blueprint, request, jsonify, current_app, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename

from ..models import db, File, User
from ..utils.jwt_utils import decode_token
from ..utils.s3_utils import upload_to_s3, download_from_s3, delete_from_s3
from ..utils.text_extractor import extract_text_from_file

files_bp = Blueprint("files", __name__, url_prefix="/api/files")
CORS(files_bp, supports_credentials=True)


# --------------------------------------------------
# Helper: get current user from JWT
# --------------------------------------------------
def get_current_user_from_request():
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        return None

    token = auth.split(" ")[1]
    payload = decode_token(token)

    if not payload:
        return None

    user_id = payload.get("sub")
    if not user_id:
        return None

    return User.query.get(user_id)


# --------------------------------------------------
# LIST FILES
# --------------------------------------------------
@files_bp.route("/", methods=["GET"])
def list_files():
    user = get_current_user_from_request()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    if user.role == "teacher":
        files = File.query.filter_by(uploaded_by=user.id).all()
    else:
        files = File.query.all()

    return jsonify([
        {
            "id": f.id,
            "filename": f.filename,
            "size": f.size,
            "uploaded_at": f.uploaded_at.isoformat(),
            "download_url": f"/api/files/{f.id}/download"
        } for f in files
    ])


# --------------------------------------------------
# UPLOAD FILE (TEACHER ONLY)
# --------------------------------------------------
@files_bp.route("/upload", methods=["POST", "OPTIONS"])
def upload_file():
    # ✅ Allow CORS preflight
    if request.method == "OPTIONS":
        return "", 200

    user = get_current_user_from_request()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    if user.role != "teacher":
        return jsonify({"error": "Only teachers can upload notes"}), 403

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    filename = secure_filename(file.filename)
    ext = os.path.splitext(filename)[1]
    key = f"{uuid.uuid4().hex}{ext}"

    use_s3 = current_app.config.get("USE_S3", False)

    if use_s3:
        upload_to_s3(file, key, content_type=file.mimetype)
        storage_path = key
        size = file.content_length
        text = extract_text_from_file(file)
    else:
        upload_dir = current_app.config.get("UPLOAD_FOLDER", "uploads")
        os.makedirs(upload_dir, exist_ok=True)

        path = os.path.join(upload_dir, key)
        file.save(path)

        storage_path = path
        size = os.path.getsize(path)
        text = extract_text_from_file(path)

    f = File(
        filename=filename,
        storage_path=storage_path,
        mimetype=file.mimetype,
        size=size,
        uploaded_by=user.id,
        content_text=text
    )

    db.session.add(f)
    db.session.commit()

    return jsonify({
        "message": "File uploaded successfully",
        "id": f.id
    }), 201


# --------------------------------------------------
# DOWNLOAD FILE
# --------------------------------------------------
@files_bp.route("/<int:file_id>/download", methods=["GET"])
def download_file(file_id):
    user = get_current_user_from_request()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    f = File.query.get_or_404(file_id)

    if user.role == "teacher" and f.uploaded_by != user.id:
        return jsonify({"error": "Forbidden"}), 403

    if not current_app.config.get("USE_S3", False):
        if not os.path.exists(f.storage_path):
            return jsonify({"error": "File not found on server"}), 404

        return send_file(
            f.storage_path,
            as_attachment=True,
            download_name=f.filename,
            mimetype=f.mimetype
        )


    return send_file(
        f.storage_path,
        as_attachment=True,
        download_name=f.filename,
        mimetype=f.mimetype
    )


# --------------------------------------------------
# DELETE FILE
# --------------------------------------------------
@files_bp.route("/<int:file_id>", methods=["DELETE"])
def delete_file(file_id):
    user = get_current_user_from_request()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    f = File.query.get_or_404(file_id)

    if user.role != "teacher" or f.uploaded_by != user.id:
        return jsonify({"error": "Forbidden"}), 403

    if current_app.config.get("USE_S3", False):
        delete_from_s3(f.storage_path)
    else:
        try:
            os.remove(f.storage_path)
        except Exception:
            pass

    db.session.delete(f)
    db.session.commit()

    return jsonify({"message": "File deleted"})
