from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)

    CORS(app)

    app.config["SECRET_KEY"] = "super_secret_key_for_games_legend"

    from .auth import auth_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    from .admin import admin_bp

    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    from .products import products_bp

    app.register_blueprint(products_bp, url_prefix="/api/products")

    from .categories import categories_bp

    app.register_blueprint(categories_bp, url_prefix="/api/categories")

    return app
