from ..database import fetch_all, fetch_one


def counts():
    return {
        "customers": fetch_one("SELECT COUNT(*) AS total FROM customers")["total"],
        "routes": fetch_one("SELECT COUNT(*) AS total FROM routes")["total"],
        "guides": fetch_one("SELECT COUNT(*) AS total FROM guides")["total"],
        "groups": fetch_one("SELECT COUNT(*) AS total FROM tour_groups")["total"],
        "orders": fetch_one("SELECT COUNT(*) AS total FROM orders")["total"],
    }


def users():
    return fetch_all("SELECT id, username, role FROM users ORDER BY id")


def role_summary():
    return fetch_all(
        """
        SELECT role, COUNT(*) AS user_count,
               CASE role
                   WHEN '管理员' THEN '系统维护与用户管理'
                   WHEN '销售' THEN '维护客户、处理报名订单'
                   WHEN '计调' THEN '安排线路、团队和导游'
                   WHEN '财务' THEN '登记费用、查看利润报表'
                   WHEN '导游' THEN '查看带团信息'
                   ELSE '业务协同'
               END AS duty
        FROM users
        GROUP BY role
        ORDER BY role
        """
    )


def customers():
    return fetch_all("SELECT * FROM customers ORDER BY id")


def customer_orders():
    return fetch_all(
        """
        SELECT o.id, c.name AS customer_name, r.destination, g.departure_date,
               o.people_count, o.order_status, o.amount_paid, o.balance
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        JOIN tour_groups g ON o.group_id = g.id
        JOIN routes r ON g.route_id = r.id
        ORDER BY o.id DESC
        """
    )


def routes():
    return fetch_all("SELECT * FROM routes ORDER BY id")


def route_groups():
    return fetch_all(
        """
        SELECT g.id, r.destination, g.departure_date, g.return_date,
               d.name AS guide_name, g.total_people, g.status
        FROM tour_groups g
        JOIN routes r ON g.route_id = r.id
        LEFT JOIN guides d ON g.guide_id = d.id
        ORDER BY g.departure_date DESC
        """
    )


def guides():
    return fetch_all(
        """
        SELECT d.*, COUNT(g.id) AS group_count
        FROM guides d
        LEFT JOIN tour_groups g ON d.id = g.guide_id
        GROUP BY d.id, d.name, d.phone, d.experience_years, d.description
        ORDER BY d.id
        """
    )


def guide_groups():
    return fetch_all(
        """
        SELECT g.id, d.name AS guide_name, r.destination, g.departure_date,
               g.return_date, g.total_people, g.status
        FROM tour_groups g
        JOIN guides d ON g.guide_id = d.id
        JOIN routes r ON g.route_id = r.id
        ORDER BY g.departure_date DESC
        """
    )


def groups():
    return fetch_all(
        """
        SELECT g.*, r.destination, d.name AS guide_name
        FROM tour_groups g
        JOIN routes r ON g.route_id = r.id
        LEFT JOIN guides d ON g.guide_id = d.id
        ORDER BY g.id
        """
    )


def group_options():
    return fetch_all(
        """
        SELECT g.id, r.destination, g.departure_date
        FROM tour_groups g
        JOIN routes r ON g.route_id = r.id
        ORDER BY g.id
        """
    )


def status_summary():
    return fetch_all(
        """
        SELECT status, COUNT(*) AS group_count, COALESCE(SUM(total_people), 0) AS people_count
        FROM tour_groups
        GROUP BY status
        ORDER BY status
        """
    )


def orders():
    return fetch_all(
        """
        SELECT o.*, c.name AS customer_name, r.destination, g.departure_date
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        JOIN tour_groups g ON o.group_id = g.id
        JOIN routes r ON g.route_id = r.id
        ORDER BY o.id
        """
    )


def unpaid_orders():
    return fetch_all(
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


def expenses():
    return fetch_all(
        """
        SELECT e.*, r.destination, g.departure_date, CURRENT_DATE AS expense_date
        FROM expenses e
        JOIN tour_groups g ON e.group_id = g.id
        JOIN routes r ON g.route_id = r.id
        ORDER BY e.id
        """
    )


def expense_summary():
    return fetch_all(
        """
        SELECT r.destination, e.expense_type, SUM(e.amount) AS total_amount
        FROM expenses e
        JOIN tour_groups g ON e.group_id = g.id
        JOIN routes r ON g.route_id = r.id
        GROUP BY r.destination, e.expense_type
        ORDER BY r.destination, e.expense_type
        """
    )


def recent_orders():
    return fetch_all(
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


def group_alerts():
    return fetch_all(
        """
        SELECT g.id, r.destination, g.total_people, g.min_people, g.status
        FROM tour_groups g
        JOIN routes r ON g.route_id = r.id
        WHERE g.total_people < g.min_people OR g.status = '待成团'
        ORDER BY g.departure_date
        LIMIT 5
        """
    )


def monthly_groups():
    return fetch_all(
        """
        SELECT TO_CHAR(departure_date, 'YYYY-MM') AS month, COUNT(*) AS group_count
        FROM tour_groups
        GROUP BY TO_CHAR(departure_date, 'YYYY-MM')
        ORDER BY month
        """
    )


def route_hot():
    return fetch_all(
        """
        SELECT r.destination, COUNT(o.id) AS order_count, COALESCE(SUM(o.people_count), 0) AS people_count
        FROM routes r
        LEFT JOIN tour_groups g ON r.id = g.route_id
        LEFT JOIN orders o ON g.id = o.group_id
        GROUP BY r.id, r.destination
        ORDER BY people_count DESC, order_count DESC
        """
    )


def customer_rank():
    return fetch_all(
        """
        SELECT c.name, c.phone, COALESCE(SUM(o.amount_paid), 0) AS total_paid
        FROM customers c
        LEFT JOIN orders o ON c.id = o.customer_id
        GROUP BY c.id, c.name, c.phone
        ORDER BY total_paid DESC
        """
    )


def profit():
    return fetch_all(
        """
        SELECT g.id AS group_id, r.destination,
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


def report_cards():
    return {
        "income": fetch_one("SELECT COALESCE(SUM(amount_paid), 0) AS total FROM orders")["total"],
        "expense": fetch_one("SELECT COALESCE(SUM(amount), 0) AS total FROM expenses")["total"],
        "active_groups": fetch_one("SELECT COUNT(*) AS total FROM tour_groups WHERE status != '已取消'")["total"],
        "unpaid": fetch_one("SELECT COALESCE(SUM(balance), 0) AS total FROM orders WHERE order_status != '已取消'")["total"],
    }
