from flask import Blueprint, g

from ..auth import current_user_payload, get_json, login_required, permission_required
from ..repositories import queries
from ..responses import error, success
from ..services import crud
from ..services.groups import cancel_group, change_guide
from ..services.orders import cancel_order, create_order, delete_order

bp = Blueprint("api", __name__, url_prefix="/api")


@bp.get("/dashboard")
@login_required
def dashboard():
    return success(
        {
            "counts": queries.counts(),
            "recent_orders": queries.recent_orders(),
            "group_alerts": queries.group_alerts(),
            "user": current_user_payload(g.user),
        }
    )


@bp.get("/users")
@permission_required("users")
def users():
    return success({"users": queries.users(), "role_summary": queries.role_summary()})


@bp.post("/users")
@permission_required("users")
def create_user():
    return success(crud.create_user(get_json()), "创建成功")


@bp.delete("/users/<int:user_id>")
@permission_required("delete_user")
def remove_user(user_id):
    if g.user and g.user["id"] == user_id:
        return error("不能删除当前登录用户", 400)
    crud.delete_user(user_id)
    return success(True, "删除成功")


@bp.get("/customers")
@permission_required("customers")
def customers():
    return success({"customers": queries.customers(), "orders": queries.customer_orders()})


@bp.post("/customers")
@permission_required("customers")
def create_customer():
    return success(crud.create_customer(get_json()), "创建成功")


@bp.delete("/customers/<int:customer_id>")
@permission_required("delete_customer")
def remove_customer(customer_id):
    crud.delete_customer(customer_id)
    return success(True, "删除成功")


@bp.get("/routes")
@permission_required("routes")
def routes():
    return success({"routes": queries.routes(), "groups": queries.route_groups()})


@bp.post("/routes")
@permission_required("routes")
def create_route():
    return success(crud.create_route(get_json()), "创建成功")


@bp.delete("/routes/<int:route_id>")
@permission_required("delete_route")
def remove_route(route_id):
    crud.delete_route(route_id)
    return success(True, "删除成功")


@bp.get("/guides")
@permission_required("guides")
def guides():
    return success({"guides": queries.guides(), "groups": queries.guide_groups()})


@bp.post("/guides")
@permission_required("guides")
def create_guide():
    return success(crud.create_guide(get_json()), "创建成功")


@bp.delete("/guides/<int:guide_id>")
@permission_required("delete_guide")
def remove_guide(guide_id):
    crud.delete_guide(guide_id)
    return success(True, "删除成功")


@bp.get("/groups")
@permission_required("groups")
def groups():
    return success(
        {
            "groups": queries.groups(),
            "routes": queries.routes(),
            "guides": queries.guides(),
            "status_summary": queries.status_summary(),
            "guide_schedule": queries.groups(),
        }
    )


@bp.post("/groups")
@permission_required("groups")
def create_group():
    return success(crud.create_group(get_json()), "创建成功")


@bp.delete("/groups/<int:group_id>")
@permission_required("delete_group")
def remove_group(group_id):
    crud.delete_group(group_id)
    return success(True, "删除成功")


@bp.post("/groups/<int:group_id>/cancel")
@permission_required("cancel_group")
def cancel_group_api(group_id):
    return success(cancel_group(group_id), "已取消团队")


@bp.post("/groups/<int:group_id>/change-guide")
@permission_required("change_guide")
def change_guide_api(group_id):
    return success(change_guide(group_id, get_json().get("guide_id")), "导游已更新")


@bp.get("/orders")
@permission_required("orders")
def orders():
    return success(
        {
            "orders": queries.orders(),
            "customers": queries.customers(),
            "groups": queries.group_options(),
            "unpaid_orders": queries.unpaid_orders(),
        }
    )


@bp.post("/orders")
@permission_required("orders")
def create_order_api():
    return success(create_order(get_json()), "创建成功")


@bp.delete("/orders/<int:order_id>")
@permission_required("delete_order")
def remove_order(order_id):
    delete_order(order_id)
    return success(True, "删除成功")


@bp.post("/orders/<int:order_id>/cancel")
@permission_required("cancel_order")
def cancel_order_api(order_id):
    return success(cancel_order(order_id, get_json().get("deduct_fee", 0)), "订单已取消")


@bp.get("/expenses")
@permission_required("expenses")
def expenses():
    return success(
        {
            "expenses": queries.expenses(),
            "groups": queries.group_options(),
            "expense_summary": queries.expense_summary(),
        }
    )


@bp.post("/expenses")
@permission_required("expenses")
def create_expense():
    return success(crud.create_expense(get_json()), "创建成功")


@bp.delete("/expenses/<int:expense_id>")
@permission_required("delete_expense")
def remove_expense(expense_id):
    crud.delete_expense(expense_id)
    return success(True, "删除成功")


@bp.get("/reports")
@permission_required("reports")
def reports():
    return success(
        {
            "report_cards": queries.report_cards(),
            "monthly_groups": queries.monthly_groups(),
            "route_hot": queries.route_hot(),
            "customer_rank": queries.customer_rank(),
            "profit": queries.profit(),
        }
    )
