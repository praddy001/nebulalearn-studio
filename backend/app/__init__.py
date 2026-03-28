import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from app.extension import db, migrate
from app.routes.auth_routes import auth_bp
from app.routes.file_routes import files_bp
from app.routes.chat_routes import chat_bp
from app.routes.notes_routes import notes_bp
from app.routes.student import student_bp
from app.routes.attendance import attendance_bp
from app.routes.event import event_bp




load_dotenv()

def create_app():
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object("config.Config")

    CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
    supports_credentials=True
 )


    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    app.config["UPLOAD_FOLDER"] = os.path.join(BASE_DIR, "uploads")
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # init extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(files_bp, url_prefix="/api/files")
    app.register_blueprint(student_bp, url_prefix="/api/students")
    app.register_blueprint(notes_bp, url_prefix="/api")
    app.register_blueprint(chat_bp,url_prefix="/api/chat")
    app.register_blueprint(attendance_bp,url_prefix="/api/attendance")
    app.register_blueprint(event_bp,url_prefix="/api/events")
    

    @app.route("/api/health")
    def health():
        return {"status": "ok"}

    return app
