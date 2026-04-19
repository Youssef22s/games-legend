import mysql.connector


def get_db_connection():
    return mysql.connector.connect(
        unix_socket="/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock",
        user="root",
        password="",
        database="games_legend",
    )
