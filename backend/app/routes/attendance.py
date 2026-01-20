from flask import Blueprint, request, jsonify
from ..utils.jwt_utils import (
    create_access_token,
    token_required,
    get_current_user,
)
from datetime import datetime

from models.attendance import Attendance
from models.user import User
from app import db

attendance_bp = Blueprint("attendance", __name__)
