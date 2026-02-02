from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Single shared instances (VERY IMPORTANT)
db = SQLAlchemy()
migrate = Migrate()
