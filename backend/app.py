from flask import Flask
from flask_cors import CORS

from .auth import load_user
from .config import Config
from .responses import error
from .routes.api import bp as api_bp
from .routes.auth import bp as auth_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, origins=Config.CORS_ORIGINS.split(","), supports_credentials=True)
    load_user(app)
    app.register_blueprint(auth_bp)
    app.register_blueprint(api_bp)

    @app.get("/api/health")
    def health():
        return {"code": 0, "message": "ok", "data": {"status": "healthy"}}

    @app.errorhandler(Exception)
    def handle_exception(exc):
        return error(str(exc), 500)

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
