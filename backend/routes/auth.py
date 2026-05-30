from flask import Blueprint, session

from ..auth import current_user_payload, get_json
from ..database import fetch_one
from ..responses import error, success

bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@bp.post("/login")
def login():
    data = get_json()
    user = fetch_one(
        "SELECT id, username, role FROM users WHERE username = %s AND password = %s",
        (data.get("username"), data.get("password")),
    )
    if not user:
        return error("用户名或密码错误", 401)
    session.clear()
    session["user"] = user
    return success(current_user_payload(user))


@bp.post("/logout")
def logout():
    session.clear()
    return success(True)


@bp.get("/me")
def me():
    user = session.get("user")
    return success(current_user_payload(user))
