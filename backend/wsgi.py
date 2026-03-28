import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, ".env")

load_dotenv(ENV_PATH)   


from app import create_app
from flask_cors import CORS

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
