from functools import wraps

from flask import g, request, session

from .permissions import ROLE_PERMISSIONS, get_permissions
from .responses import error


def current_user_payload(user):
    if not user:
        return None
    return {
        "id": user["id"],
        "username": user["username"],
        "role": user["role"],
        "permissions": get_permissions(user["role"]),
    }


def load_user(app):
    @app.before_request
    def _load_user():
        g.user = None
        if "user" in session:
            g.user = session["user"]


def login_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if not g.get("user"):
            return error("请先登录", 401)
        return view(*args, **kwargs)

    return wrapped


def permission_required(permission):
    def decorator(view):
        @wraps(view)
        def wrapped(*args, **kwargs):
            user = g.get("user")
            if not user:
                return error("请先登录", 401)
            if permission not in ROLE_PERMISSIONS.get(user["role"], set()):
                return error("没有操作权限", 403)
            return view(*args, **kwargs)

        return wrapped

    return decorator


def get_json():
    return request.get_json(silent=True) or {}
