from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)

    # ✅ SINGLE name column (safe for SQLite)
    name = db.Column(db.String(120), nullable=True)

    email = db.Column(db.String(255), unique=True, index=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="student")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class File(db.Model):
    __tablename__ = "file"

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(512), nullable=False)
    storage_path = db.Column(db.String(1024), nullable=False)
    mimetype = db.Column(db.String(255))
    size = db.Column(db.Integer)
    uploaded_by = db.Column(db.Integer, db.ForeignKey("user.id"))
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    content_text = db.Column(db.Text)

    user = db.relationship("User", backref=db.backref("files", lazy="dynamic"))
