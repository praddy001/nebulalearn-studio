import os
from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv  
from .models import db
from .routes.auth_routes import auth_bp
from .routes.file_routes import files_bp
from .routes.chat_routes import chat_bp
from .routes.notes_routes import notes_bp
from .routes.student import student_bp

migrate = Migrate() 

load_dotenv()

def create_app():
    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object("config.Config")

    # ✅ CORS — ALLOW YOUR ACTUAL FRONTEND
    frontend = os.getenv("FRONTEND_URL", "http://localhost:8080")

    CORS(
        app,
        resources={r"/api/*": {"origins": frontend}},
        supports_credentials=True
    )

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    app.config["UPLOAD_FOLDER"] = os.path.join(BASE_DIR, "uploads")

    # uploads folder
    os.makedirs(app.config.get("UPLOAD_FOLDER", "uploads"), exist_ok=True)

    # init extensions
    db.init_app(app)
    Migrate(app, db)

    # register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(files_bp, url_prefix="/api/files")
    app.register_blueprint(student_bp, url_prefix="/api/student")
    app.register_blueprint(chat_bp, url_prefix="/api")
    app.register_blueprint(notes_bp, url_prefix="/api")

    @app.route("/api/health")
    def health():
        return {"status": "ok"}

    return app
