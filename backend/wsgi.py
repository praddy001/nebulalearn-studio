import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, ".env")

load_dotenv(ENV_PATH)   # 🔥 FORCE LOAD .env

# 🔍 DEBUG (TEMPORARY – KEEP FOR NOW)
print("GEMINI_API_KEY:", os.getenv("GEMINI_API_KEY"))

from app import create_app
from flask_cors import CORS

app = create_app()

CORS(app, resources={
    r"/api/*": {
        "origins": "http://localhost:8080"
    }
})

if __name__ == "__main__":
    app.run(debug=True)
