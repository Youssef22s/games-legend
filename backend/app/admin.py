from flask import Blueprint, request, jsonify
import bcrypt
import mysql.connector
from .db import get_db_connection
from .utils import admin_required

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/dashboard", methods=["GET"])
@admin_required
def get_dashboard_stats():
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        cursor.execute("SELECT COUNT(*) as users_count FROM users")
        users_count = cursor.fetchone()["users_count"]

        cursor.execute("SELECT COUNT(*) as products_count FROM products")
        products_count = cursor.fetchone()["products_count"]

        return (
            jsonify({"users_count": users_count, "products_count": products_count}),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if "cursor" in locals():
            cursor.close()
        if "db" in locals():
            db.close()


@admin_bp.route("/vendors", methods=["GET"])
@admin_required
def get_vendors():
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT id, username, email FROM users WHERE role = 'vendor'")
        vendors = cursor.fetchall()
        return jsonify(vendors), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if "cursor" in locals():
            cursor.close()
        if "db" in locals():
            db.close()


@admin_bp.route("/vendors", methods=["POST"])
@admin_required
def add_vendor():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

    try:
        db = get_db_connection()
        cursor = db.cursor()
        sql = "INSERT INTO users (username, email, password, role) VALUES (%s, %s, %s, 'vendor')"
        val = (username, email, hashed_password)
        cursor.execute(sql, val)
        db.commit()
        return jsonify({"message": "Vendor added successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": "Email or Username already exists"}), 409
    finally:
        if "cursor" in locals():
            cursor.close()
        if "db" in locals():
            db.close()


@admin_bp.route("/vendors/<int:id>", methods=["DELETE"])
@admin_required
def delete_vendor(id):
    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("DELETE FROM users WHERE id = %s AND role = 'vendor'", (id,))
        db.commit()
        return jsonify({"message": "Vendor deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if "cursor" in locals():
            cursor.close()
        if "db" in locals():
            db.close()
