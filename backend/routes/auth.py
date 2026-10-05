from flask import Blueprint, request, jsonify, session
from config import supabase

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    action = data.get("action")
    email = (data.get("email") or "").strip()
    password = data.get("password") or ""

    # REGISTER
    if action == "register":
        name = (data.get("name") or "").strip()

        if not name or not email or not password:
            return jsonify({"message": "Name, email and password are required"}), 400

        try:
            response = supabase.auth.sign_up({
                "email": email,
                "password": password,
                "options": {"data": {"name": name}}
            })
        except Exception as e:
            msg = str(e)
            if "already" in msg.lower():
                return jsonify({"message": "User already exists. Please sign in."}), 409
            return jsonify({"message": msg}), 400

        user = response.user

        if not user:
            return jsonify({"message": "Registration failed"}), 400

        if not user.identities:
            return jsonify({"message": "User already exists. Please sign in."}), 409

        try:
            supabase.table("users").insert({
                "user_id": user.id,
                "name": name,
                "email": email,
                "rating_score": 0,
                "project_completed": 0
            }).execute()
        except Exception as e:
            print("USERS TABLE INSERT ERROR:", e)
            return jsonify({"message": "Account created, but profile could not be saved"}), 500

        session["user_id"] = user.id

        return jsonify({
            "message": "User created successfully",
            "user_id": user.id
        }), 200

    # LOGIN (Bypassed for testing)
    elif action == "login":
        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400

        # Bypass database check and accept any credentials
        dummy_user_id = "mock-user-12345"
        session["user_id"] = dummy_user_id

        return jsonify({
            "message": "Login successful",
            "user_id": dummy_user_id
        }), 200

    # INVALID ACTION
    return jsonify({"message": "Invalid action"}), 400