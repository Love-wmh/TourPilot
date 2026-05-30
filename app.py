from functools import wraps

from flask import Flask, g, redirect, render_template, request, session, url_for

from db import get_conn

app = Flask(__name__)
app.secret_key = "travel-agency-system"


def query_all(sql, params=None):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(sql, params or ())
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows


def execute(sql, params=None):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(sql, params or ())
    conn.commit()
    cur.close()
    conn.close()


def query_one(sql, params=None):
    rows = query_all(sql, params)
    return rows[0] if rows else None


def login_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("login"))
        return view(*args, **kwargs)

    return wrapped_view


ROLE_PERMISSIONS = {
    "管理员": {
        "index",
        "users",
        "delete_user",
        "customers",
        "delete_customer",
        "routes",
        "delete_route",
        "guides",
        "delete_guide",
        "groups",
        "delete_group",
        "cancel_group",
        "change_guide",
        "orders",
        "delete_order",
        "cancel_order",
        "expenses",
        "delete_expense",
        "reports",
    },
    "销售": {
        "index",
        "customers",
        "delete_customer",
        "orders",
        "delete_order",
        "cancel_order",
        "reports",
    },
    "计调": {
        "index",
        "routes",
        "delete_route",
        "guides",
        "delete_guide",
        "groups",
        "delete_group",
        "cancel_group",
        "change_guide",
        "reports",
    },
    "财务": {
        "index",
        "orders",
        "expenses",
        "delete_expense",
        "reports",
    },
    "导游": {
        "index",
        "guides",
        "groups",
        "reports",
    },
}


def permission_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        role = session.get("role")
        allowed = ROLE_PERMISSIONS.get(role, set())
        if view.__name__ not in allowed:
            return redirect(url_for("index"))
        return view(*args, **kwargs)

    return wrapped_view


def can_access(endpoint):
    if not g.user:
        return False
    return endpoint in ROLE_PERMISSIONS.get(g.user["role"], set())


@app.before_request
def load_logged_in_user():
    g.user = None
    if "user_id" in session:
        g.user = {
            "id": session["user_id"],
            "username": session["username"],
            "role": session["role"],
        }
    g.can_access = can_access


@app.route("/login", methods=["GET", "POST"])
def login():
    error = ""
    if request.method == "POST":
        user = query_one(
            "SELECT * FROM users WHERE username = %s AND password = %s",
            (request.form["username"], request.form["password"]),
        )
        if user:
            session.clear()
            session["user_id"] = user["id"]
            session["username"] = user["username"]
            session["role"] = user["role"]
            return redirect(url_for("index"))
        error = "用户名或密码错误"
    return render_template("login.html", error=error)


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.route("/")
@login_required
def index():
    counts = {
        "customers": query_all("SELECT COUNT(*) AS total FROM customers")[0]["total"],
        "routes": query_all("SELECT COUNT(*) AS total FROM routes")[0]["total"],
        "guides": query_all("SELECT COUNT(*) AS total FROM guides")[0]["total"],
        "groups": query_all("SELECT COUNT(*) AS total FROM tour_groups")[0]["total"],
        "orders": query_all("SELECT COUNT(*) AS total FROM orders")[0]["total"],
    }
    recent_orders = query_all(
        """
        SELECT o.id, c.name AS customer_name, r.destination, o.people_count,
               o.order_status, o.amount_paid
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        JOIN tour_groups g ON o.group_id = g.id
        JOIN routes r ON g.route_id = r.id
        ORDER BY o.id DESC
        LIMIT 5
        """
    )
    group_alerts = query_all(
        """
        SELECT g.id, r.destination, g.total_people, g.min_people, g.status
        FROM tour_groups g
        JOIN routes r ON g.route_id = r.id
        WHERE g.total_people < g.min_people OR g.status = '待成团'
        ORDER BY g.departure_date
        LIMIT 5
        """
    )
    return render_template(
        "index.html",
        counts=counts,
        recent_orders=recent_orders,
        group_alerts=group_alerts,
    )


@app.route("/users", methods=["GET", "POST"])
@login_required
@permission_required
def users():
    if request.method == "POST":
        execute(
            """
            INSERT INTO users (username, password, role)
            VALUES (%s, %s, %s)
            """,
            (
                request.form["username"],
                request.form["password"],
                request.form["role"],
            ),
        )
        return redirect(url_for("users"))

    user_list = query_all("SELECT id, username, role FROM users ORDER BY id")
    role_summary = query_all(
        """
        SELECT role, COUNT(*) AS user_count
        FROM users
        GROUP BY role
        ORDER BY role
        """
    )
    return render_template("users.html", users=user_list, role_summary=role_summary)


@app.route("/users/<int:user_id>/delete", methods=["POST"])
@login_required
@permission_required
def delete_user(user_id):
    if user_id != session["user_id"]:
        execute("DELETE FROM users WHERE id = %s", (user_id,))
    return redirect(url_for("users"))


@app.route("/customers", methods=["GET", "POST"])
@login_required
@permission_required
def customers():
    if request.method == "POST":
        execute(
            """
            INSERT INTO customers (name, id_card, phone, emergency_contact, travel_preference)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                request.form["name"],
                request.form["id_card"],
                request.form["phone"],
                request.form["emergency_contact"],
                request.form["travel_preference"],
            ),
        )
        return redirect(url_for("customers"))

    customer_list = query_all("SELECT * FROM customers ORDER BY id")
    customer_orders = query_all(
        """
        SELECT c.name AS customer_name, r.destination, g.departure_date,
               o.people_count, o.order_status, o.amount_paid, o.balance
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        JOIN tour_groups g ON o.group_id = g.id
        JOIN routes r ON g.route_id = r.id
        ORDER BY o.id DESC
        """
    )
    return render_template(
        "customers.html", customers=customer_list, customer_orders=customer_orders
    )


@app.route("/customers/<int:customer_id>/delete", methods=["POST"])
@login_required
@permission_required
def delete_customer(customer_id):
    execute("DELETE FROM customers WHERE id = %s", (customer_id,))
    return redirect(url_for("customers"))


@app.route("/routes", methods=["GET", "POST"])
@login_required
@permission_required
def routes():
    if request.method == "POST":
        execute(
            """
            INSERT INTO routes (destination, days, attractions, adult_price, child_price, status)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                request.form["destination"],
                request.form["days"],
                request.form["attractions"],
                request.form["adult_price"],
                request.form["child_price"],
                request.form["status"],
            ),
        )
        return redirect(url_for("routes"))

    route_list = query_all("SELECT * FROM routes ORDER BY id")
    route_groups = query_all(
        """
        SELECT r.destination, g.departure_date, g.return_date,
               d.name AS guide_name, g.total_people, g.status
        FROM tour_groups g
        JOIN routes r ON g.route_id = r.id
        LEFT JOIN guides d ON g.guide_id = d.id
        ORDER BY g.departure_date DESC
        """
    )
    return render_template("routes.html", routes=route_list, route_groups=route_groups)


@app.route("/routes/<int:route_id>/delete", methods=["POST"])
@login_required
@permission_required
def delete_route(route_id):
    execute("DELETE FROM routes WHERE id = %s", (route_id,))
    return redirect(url_for("routes"))


@app.route("/guides", methods=["GET", "POST"])
@login_required
@permission_required
def guides():
    if request.method == "POST":
        execute(
            """
            INSERT INTO guides (name, phone, experience_years, description)
            VALUES (%s, %s, %s, %s)
            """,
            (
                request.form["name"],
                request.form["phone"],
                request.form["experience_years"],
                request.form["description"],
            ),
        )
        return redirect(url_for("guides"))

    guide_list = query_all(
        """
        SELECT d.*,
               COUNT(g.id) AS group_count
        FROM guides d
        LEFT JOIN tour_groups g ON d.id = g.guide_id
        GROUP BY d.id, d.name, d.phone, d.experience_years, d.description
        ORDER BY d.id
        """
    )
    guide_groups = query_all(
        """
        SELECT d.name AS guide_name, r.destination, g.departure_date,
               g.return_date, g.total_people, g.status
        FROM tour_groups g
        JOIN guides d ON g.guide_id = d.id
        JOIN routes r ON g.route_id = r.id
        ORDER BY g.departure_date DESC
        """
    )
    return render_template("guides.html", guides=guide_list, guide_groups=guide_groups)


@app.route("/guides/<int:guide_id>/delete", methods=["POST"])
@login_required
@permission_required
def delete_guide(guide_id):
    execute("DELETE FROM guides WHERE id = %s", (guide_id,))
    return redirect(url_for("guides"))


@app.route("/groups", methods=["GET", "POST"])
@login_required
@permission_required
def groups():
    if request.method == "POST":
        execute(
            """
            INSERT INTO tour_groups
                (route_id, guide_id, departure_date, return_date, total_people, min_people, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                request.form["route_id"],
                request.form["guide_id"] or None,
                request.form["departure_date"],
                request.form["return_date"],
                request.form["total_people"],
                request.form["min_people"],
                request.form["status"],
            ),
        )
        return redirect(url_for("groups"))

    group_list = query_all(
        """
        SELECT g.*, r.destination, d.name AS guide_name
        FROM tour_groups g
        JOIN routes r ON g.route_id = r.id
        LEFT JOIN guides d ON g.guide_id = d.id
        ORDER BY g.id
        """
    )
    route_list = query_all("SELECT id, destination FROM routes ORDER BY id")
    guide_list = query_all("SELECT id, name FROM guides ORDER BY id")
    status_summary = query_all(
        """
        SELECT status, COUNT(*) AS group_count, COALESCE(SUM(total_people), 0) AS people_count
        FROM tour_groups
        GROUP BY status
        ORDER BY status
        """
    )
    guide_schedule = query_all(
        """
        SELECT d.name AS guide_name, r.destination, g.departure_date,
               g.return_date, g.total_people, g.status
        FROM tour_groups g
        LEFT JOIN guides d ON g.guide_id = d.id
        JOIN routes r ON g.route_id = r.id
        ORDER BY g.departure_date DESC
        LIMIT 8
        """
    )
    return render_template(
        "groups.html",
        groups=group_list,
        routes=route_list,
        guides=guide_list,
        status_summary=status_summary,
        guide_schedule=guide_schedule,
    )


@app.route("/groups/<int:group_id>/delete", methods=["POST"])
@login_required
@permission_required
def delete_group(group_id):
    execute("DELETE FROM tour_groups WHERE id = %s", (group_id,))
    return redirect(url_for("groups"))


@app.route("/groups/<int:group_id>/cancel", methods=["POST"])
@login_required
@permission_required
def cancel_group(group_id):
    execute("UPDATE tour_groups SET status = '已取消' WHERE id = %s", (group_id,))
    execute(
        "UPDATE orders SET order_status = '已取消', balance = 0 WHERE group_id = %s",
        (group_id,),
    )
    return redirect(url_for("groups"))


@app.route("/groups/<int:group_id>/change_guide", methods=["POST"])
@login_required
@permission_required
def change_guide(group_id):
    execute(
        "UPDATE tour_groups SET guide_id = %s WHERE id = %s",
        (request.form["guide_id"] or None, group_id),
    )
    return redirect(url_for("groups"))


@app.route("/orders", methods=["GET", "POST"])
@login_required
@permission_required
def orders():
    if request.method == "POST":
        receivable = float(request.form["amount_receivable"])
        paid = float(request.form["amount_paid"])
        people_count = int(request.form["people_count"])
        group_id = int(request.form["group_id"])
        execute(
            """
            INSERT INTO orders
                (customer_id, group_id, people_count, order_status,
                 amount_receivable, amount_paid, balance)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                request.form["customer_id"],
                group_id,
                people_count,
                request.form["order_status"],
                receivable,
                paid,
                max(receivable - paid, 0),
            ),
        )
        if request.form["order_status"] != "已取消":
            execute(
                """
                UPDATE tour_groups
                SET total_people = total_people + %s,
                    status = CASE
                        WHEN total_people + %s >= min_people THEN '已成团'
                        ELSE status
                    END
                WHERE id = %s
                """,
                (people_count, people_count, group_id),
            )
        return redirect(url_for("orders"))

    order_list = query_all(
        """
        SELECT o.*, c.name AS customer_name, r.destination, g.departure_date
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        JOIN tour_groups g ON o.group_id = g.id
        JOIN routes r ON g.route_id = r.id
        ORDER BY o.id
        """
    )
    customer_list = query_all("SELECT id, name FROM customers ORDER BY id")
    group_list = query_all(
        """
        SELECT g.id, r.destination, g.departure_date
        FROM tour_groups g
        JOIN routes r ON g.route_id = r.id
        ORDER BY g.id
        """
    )
    order_summary = query_all(
        """
        SELECT order_status, COUNT(*) AS order_count,
               COALESCE(SUM(amount_receivable), 0) AS receivable,
               COALESCE(SUM(amount_paid), 0) AS paid,
               COALESCE(SUM(balance), 0) AS balance
        FROM orders
        GROUP BY order_status
        ORDER BY order_status
        """
    )
    unpaid_orders = query_all(
        """
        SELECT o.id, c.name AS customer_name, r.destination,
               o.amount_receivable, o.amount_paid, o.balance
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        JOIN tour_groups g ON o.group_id = g.id
        JOIN routes r ON g.route_id = r.id
        WHERE o.balance > 0 AND o.order_status != '已取消'
        ORDER BY o.balance DESC
        LIMIT 8
        """
    )
    return render_template(
        "orders.html",
        orders=order_list,
        customers=customer_list,
        groups=group_list,
        order_summary=order_summary,
        unpaid_orders=unpaid_orders,
    )


@app.route("/orders/<int:order_id>/delete", methods=["POST"])
@login_required
@permission_required
def delete_order(order_id):
    execute("DELETE FROM orders WHERE id = %s", (order_id,))
    return redirect(url_for("orders"))


@app.route("/orders/<int:order_id>/cancel", methods=["POST"])
@login_required
@permission_required
def cancel_order(order_id):
    deduct_fee = float(request.form["deduct_fee"])
    order = query_one(
        "SELECT group_id, people_count, order_status FROM orders WHERE id = %s",
        (order_id,),
    )
    execute(
        """
        UPDATE orders
        SET order_status = '已取消', amount_paid = %s, balance = 0
        WHERE id = %s
        """,
        (deduct_fee, order_id),
    )
    if order and order["order_status"] != "已取消":
        execute(
            """
            UPDATE tour_groups
            SET total_people = GREATEST(total_people - %s, 0),
                status = CASE
                    WHEN GREATEST(total_people - %s, 0) < min_people THEN '待成团'
                    ELSE status
                END
            WHERE id = %s
            """,
            (order["people_count"], order["people_count"], order["group_id"]),
        )
    return redirect(url_for("orders"))


@app.route("/expenses", methods=["GET", "POST"])
@login_required
@permission_required
def expenses():
    if request.method == "POST":
        execute(
            """
            INSERT INTO expenses (group_id, expense_type, amount, description)
            VALUES (%s, %s, %s, %s)
            """,
            (
                request.form["group_id"],
                request.form["expense_type"],
                request.form["amount"],
                request.form["description"],
            ),
        )
        return redirect(url_for("expenses"))

    expense_list = query_all(
        """
        SELECT e.*, r.destination, g.departure_date
        FROM expenses e
        JOIN tour_groups g ON e.group_id = g.id
        JOIN routes r ON g.route_id = r.id
        ORDER BY e.id
        """
    )
    group_list = query_all(
        """
        SELECT g.id, r.destination, g.departure_date
        FROM tour_groups g
        JOIN routes r ON g.route_id = r.id
        ORDER BY g.id
        """
    )
    expense_summary = query_all(
        """
        SELECT r.destination, e.expense_type, SUM(e.amount) AS total_amount
        FROM expenses e
        JOIN tour_groups g ON e.group_id = g.id
        JOIN routes r ON g.route_id = r.id
        GROUP BY r.destination, e.expense_type
        ORDER BY r.destination, e.expense_type
        """
    )
    return render_template(
        "expenses.html",
        expenses=expense_list,
        groups=group_list,
        expense_summary=expense_summary,
    )


@app.route("/expenses/<int:expense_id>/delete", methods=["POST"])
@login_required
@permission_required
def delete_expense(expense_id):
    execute("DELETE FROM expenses WHERE id = %s", (expense_id,))
    return redirect(url_for("expenses"))


@app.route("/reports")
@login_required
@permission_required
def reports():
    monthly_groups = query_all(
        """
        SELECT TO_CHAR(departure_date, 'YYYY-MM') AS month, COUNT(*) AS group_count
        FROM tour_groups
        GROUP BY TO_CHAR(departure_date, 'YYYY-MM')
        ORDER BY month
        """
    )
    route_hot = query_all(
        """
        SELECT r.destination, COUNT(o.id) AS order_count, COALESCE(SUM(o.people_count), 0) AS people_count
        FROM routes r
        LEFT JOIN tour_groups g ON r.id = g.route_id
        LEFT JOIN orders o ON g.id = o.group_id
        GROUP BY r.id, r.destination
        ORDER BY people_count DESC, order_count DESC
        """
    )
    customer_rank = query_all(
        """
        SELECT c.name, c.phone, COALESCE(SUM(o.amount_paid), 0) AS total_paid
        FROM customers c
        LEFT JOIN orders o ON c.id = o.customer_id
        GROUP BY c.id, c.name, c.phone
        ORDER BY total_paid DESC
        """
    )
    profit = query_all(
        """
        SELECT
            g.id AS group_id,
            r.destination,
            COALESCE(i.income, 0) AS income,
            COALESCE(x.expense, 0) AS expense,
            COALESCE(i.income, 0) - COALESCE(x.expense, 0) AS profit
        FROM tour_groups g
        JOIN routes r ON g.route_id = r.id
        LEFT JOIN (
            SELECT group_id, SUM(amount_paid) AS income
            FROM orders
            GROUP BY group_id
        ) i ON g.id = i.group_id
        LEFT JOIN (
            SELECT group_id, SUM(amount) AS expense
            FROM expenses
            GROUP BY group_id
        ) x ON g.id = x.group_id
        ORDER BY g.id
        """
    )
    report_cards = {
        "income": query_all("SELECT COALESCE(SUM(amount_paid), 0) AS total FROM orders")[0]["total"],
        "expense": query_all("SELECT COALESCE(SUM(amount), 0) AS total FROM expenses")[0]["total"],
        "active_groups": query_all("SELECT COUNT(*) AS total FROM tour_groups WHERE status != '已取消'")[0]["total"],
        "unpaid": query_all("SELECT COALESCE(SUM(balance), 0) AS total FROM orders WHERE order_status != '已取消'")[0]["total"],
    }
    return render_template(
        "reports.html",
        monthly_groups=monthly_groups,
        route_hot=route_hot,
        customer_rank=customer_rank,
        profit=profit,
        report_cards=report_cards,
    )


if __name__ == "__main__":
    app.run(debug=True)
