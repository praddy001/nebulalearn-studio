from app import create_app
from flask_cors import CORS

app = create_app()

# ✅ Allow React frontend (localhost:8080) to call Flask API
CORS(app, resources={
    r"/api/*": {
        "origins": "http://localhost:8080"
    }
})

if __name__ == "__main__":
    app.run(debug=True)
