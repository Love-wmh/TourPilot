from flask import jsonify


def success(data=None, message="ok"):
    return jsonify({"code": 0, "message": message, "data": data})


def error(message, status=400, code=None):
    return jsonify({"code": code or status, "message": message, "data": None}), status
