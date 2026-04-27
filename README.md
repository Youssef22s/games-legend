<h1 align="center">Games Legend 🎮</h1>

<p align="center">
  <strong>A full-stack e-commerce platform for buying, selling, and trading games.</strong>
</p>

## 📝 About The Project

Games Legend is a comprehensive web application built to connect game vendors with buyers. It features a robust Role-Based Access Control (RBAC) system, dynamic storefronts, and dedicated dashboards for different user roles (Admins, Vendors, and Buyers).

The backend is powered by Python (Flask) with a MySQL database, while the frontend is built using HTML, CSS, Vanilla JavaScript, and Bootstrap for a fully responsive, Single Page Application (SPA) experience.

## ✨ Features

- **User Authentication & Security:** Secure login and registration using JWT (JSON Web Tokens) and bcrypt for password hashing.
- **Role-Based Access Control (RBAC):**
  - **Admin:** \* Exclusive SPA-like dashboard with mobile-friendly navigation.
    - **Vendor Management:** Add, delete, and view comprehensive vendor profiles (including their specific products and sales history).
    - **Order Management:** Global directory for all platform orders with inline details.
    - **Category Management:** Full CRUD operations (Create, Read, Update, Delete) for platform categories using elegant SweetAlert2 prompts.
    - **Real-time Notifications:** Dynamic alerts for new orders with quick redirection.
  - **Vendor:** \* Personalized dashboard with full CRUD capabilities for their own products.
    - **Sales Tracking:** Dedicated orders section to track their sold products, order statuses, and calculate total earnings.
  - **Buyer/Guest:** \* Dynamic public storefront to explore products by category.
    - Shopping cart system and secure checkout process.
- **Dynamic Content:** Categories, products, vendors, and orders are fetched dynamically from the RESTful API.
- **Secure API Endpoints:** Protected routes using custom middleware decorators to ensure only authorized roles can perform specific actions.

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript, Bootstrap 5, SweetAlert2.
- **Backend:** Python, Flask, Flask-CORS.
- **Security:** PyJWT (Authentication), bcrypt (Password Hashing).
- **Database:** MySQL.

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- Python 3.x installed
- MySQL Server running (e.g., via XAMPP, WAMP, or standalone)
- Node.js / Live Server extension (optional, for running the frontend easily)

### 1. Database Setup (Easy Setup)

We have provided a ready-to-use database dump to get you started immediately without manual table creation.

1. Open your MySQL management tool (e.g., phpMyAdmin, MySQL Workbench).
2. Create a new empty database named `games_legend` (or your preferred name).
3. Import the provided SQL file located at `database/game_legend.sql` into your new database.
4. Update the database connection credentials in your backend configuration file (e.g., `backend/app/db.py`).

### 2. Backend Setup

Navigate to the backend directory and set up the virtual environment:

```bash
cd backend
python -m venv venv
```
