<h1 align="center">Games Legend 🎮</h1>

<p align="center">
  <strong>A full-stack e-commerce platform for buying, selling, and trading games.</strong>
</p>

## 📝 About The Project

Games Legend is a comprehensive web application built to connect game vendors with buyers. It features a robust Role-Based Access Control (RBAC) system, dynamic storefronts, and dedicated dashboards for different user roles (Admins, Vendors, and Buyers). 

The backend is powered by Python (Flask) with a MySQL database, while the frontend is built using HTML, CSS, JavaScript, and Bootstrap for a fully responsive experience.

## ✨ Features

* **User Authentication & Authorization:** Secure login and registration using JWT (JSON Web Tokens) and bcrypt for password hashing.
* **Role-Based Access Control:**
  * **Admin:** Access to an exclusive dashboard to view platform statistics and manage (add/view/delete) vendors.
  * **Vendor:** Access to a personalized dashboard with full CRUD capabilities (Create, Read, Update, Delete) for their own products.
  * **Buyer/Guest:** Access to the public storefront to explore products, with dynamic UI elements adapting to their login state.
* **Dynamic Content:** Categories and products are fetched dynamically from the RESTful API.
* **Secure API Endpoints:** Protected routes using custom middleware decorators to ensure only authorized roles can perform specific actions.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript, Bootstrap 5.
* **Backend:** Python, Flask, Flask-CORS.
* **Security:** PyJWT (Authentication), bcrypt (Password Hashing).
* **Database:** MySQL.

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
* Python 3.x installed
* MySQL Server running
* Node.js / Live Server (optional, for running the frontend easily)

### 1. Database Setup
1. Open your MySQL management tool (e.g., phpMyAdmin, MySQL Workbench).
2. Create a new database.
3. Update the database connection credentials in your `backend/app/db.py` file.
4. Run the SQL queries to create the necessary tables (`users`, `categories`, `products`) and insert initial categories.

### 2. Backend Setup
Navigate to the backend directory and set up the virtual environment:
```bash
cd backend
python -m venv venv