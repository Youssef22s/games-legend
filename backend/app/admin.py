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

        cursor.execute("SELECT COUNT(*) as products_count FROM products")
        products_count = cursor.fetchone()["products_count"]

        cursor.execute(
            "SELECT COUNT(*) as vendors_count FROM users WHERE role = 'vendor'"
        )
        vendors_count = cursor.fetchone()["vendors_count"]

        cursor.execute(
            "SELECT COUNT(*) as buyers_count FROM users WHERE role = 'buyer'"
        )
        buyers_count = cursor.fetchone()["buyers_count"]

        cursor.execute("SELECT COUNT(*) as orders_count FROM orders")
        orders_count = cursor.fetchone()["orders_count"]

        return (
            jsonify(
                {
                    "products_count": products_count,
                    "vendors_count": vendors_count,
                    "buyers_count": buyers_count,
                    "orders_count": orders_count,
                }
            ),
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


@admin_bp.route("/orders", methods=["GET"])
@admin_required
def get_all_orders():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT o.id, o.total_amount, o.status, o.created_at, u.username as buyer_name
            FROM orders o
            JOIN users u ON o.buyer_id = u.id
            ORDER BY o.created_at DESC
        """
        )
        orders = cursor.fetchall()
        return jsonify(orders), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()


@admin_bp.route("/orders/<int:order_id>", methods=["GET"])
@admin_required
def get_order_details(order_id):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT o.id, o.total_amount, o.status, o.created_at, 
                   u.username as buyer_name, u.email as buyer_email
            FROM orders o
            JOIN users u ON o.buyer_id = u.id
            WHERE o.id = %s
        """,
            (order_id,),
        )

        order = cursor.fetchone()

        if not order:
            return jsonify({"error": "Order not found"}), 404

        cursor.execute(
            """
            SELECT p.title, oi.quantity, oi.price_at_purchase
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = %s
        """,
            (order_id,),
        )

        items = cursor.fetchall()

        order["items"] = items

        return jsonify(order), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        db.close()
