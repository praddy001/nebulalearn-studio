import os
import io
import uuid
from flask import Blueprint, request, jsonify, current_app, send_file
from werkzeug.utils import secure_filename
from ..models import db, File, User
from ..utils.jwt_utils import token_required, get_current_user
from ..utils.s3_utils import upload_to_s3, download_from_s3, delete_from_s3
from ..utils.text_extractor import extract_text_from_file


files_bp = Blueprint("files", __name__)

@files_bp.route("/", methods=["GET"])
@token_required
def list_files():
    user = get_current_user()
    files = File.query.filter_by(uploaded_by=user.id).order_by(File.uploaded_at.desc()).all()
    out = []
    for f in files:
        out.append({
            "id": f.id,
            "filename": f.filename,
            "mimetype": f.mimetype,
            "size": f.size,
            "uploaded_at": f.uploaded_at.isoformat(),
            "download_url": f"/api/files/{f.id}/download"
        })
    return jsonify(out)

@files_bp.route("/upload", methods=["POST"])
@token_required
def upload_file():
    user = get_current_user()
    if "file" not in request.files:
        return jsonify({"error": "no file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "no selected file"}), 400

    filename = secure_filename(file.filename)
    ext = os.path.splitext(filename)[1]
    key = f"{uuid.uuid4().hex}{ext}"

    use_s3 = current_app.config.get("USE_S3", False)
    if use_s3:
        # upload to S3/MinIO
        upload_to_s3(file, key, content_type=file.mimetype)
        storage_path = key
        size = file.content_length or None
    else:
        # save to local disk
        upload_folder = current_app.config.get("UPLOAD_FOLDER", "uploads")
        os.makedirs(upload_folder, exist_ok=True)
        path = os.path.join(upload_folder, key)
        file.save(path)
        storage_path = path
        size = os.path.getsize(path)

    f = File(
        filename=filename,
        storage_path=storage_path,
        mimetype=file.mimetype,
        size=size,
        uploaded_by=user.id
    )
    db.session.add(f)
    db.session.commit()

    return jsonify({
        "id": f.id,
        "filename": f.filename,
        "download_url": f"/api/files/{f.id}/download"
    }), 201

@files_bp.route("/<int:file_id>/download", methods=["GET"])
@token_required
def download_file(file_id):
    user = get_current_user()
    f = File.query.get_or_404(file_id)
    if f.uploaded_by != user.id:
        return jsonify({"error": "forbidden"}), 403

    use_s3 = current_app.config.get("USE_S3", False)
    if use_s3:
        data = download_from_s3(f.storage_path)
        return send_file(io.BytesIO(data), download_name=f.filename, mimetype=f.mimetype, as_attachment=True)
    else:
        return send_file(f.storage_path, as_attachment=True, download_name=f.filename, mimetype=f.mimetype)

@files_bp.route("/<int:file_id>", methods=["DELETE"])
@token_required
def delete_file(file_id):
    user = get_current_user()
    f = File.query.get_or_404(file_id)
    if f.uploaded_by != user.id:
        return jsonify({"error": "forbidden"}), 403

    use_s3 = current_app.config.get("USE_S3", False)
    if use_s3:
        delete_from_s3(f.storage_path)
    else:
        try:
            os.remove(f.storage_path)
        except Exception:
            pass

    db.session.delete(f)
    db.session.commit()
    return jsonify({"status": "deleted"})
