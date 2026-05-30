from ..database import execute, insert_returning


def create_user(data):
    return insert_returning(
        """
        INSERT INTO users (username, password, role)
        VALUES (%s, %s, %s)
        RETURNING id, username, role
        """,
        (data["username"], data["password"], data["role"]),
    )


def delete_user(user_id):
    execute("DELETE FROM users WHERE id = %s", (user_id,))


def create_customer(data):
    return insert_returning(
        """
        INSERT INTO customers (name, id_card, phone, emergency_contact, travel_preference)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING *
        """,
        (
            data["name"],
            data["id_card"],
            data.get("phone", ""),
            data.get("emergency_contact", ""),
            data.get("travel_preference", ""),
        ),
    )


def delete_customer(customer_id):
    execute("DELETE FROM customers WHERE id = %s", (customer_id,))


def create_route(data):
    return insert_returning(
        """
        INSERT INTO routes (destination, days, attractions, adult_price, child_price, status)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING *
        """,
        (
            data["destination"],
            data["days"],
            data.get("attractions", ""),
            data["adult_price"],
            data["child_price"],
            data.get("status", "启用"),
        ),
    )


def delete_route(route_id):
    execute("DELETE FROM routes WHERE id = %s", (route_id,))


def create_guide(data):
    return insert_returning(
        """
        INSERT INTO guides (name, phone, experience_years, description)
        VALUES (%s, %s, %s, %s)
        RETURNING *
        """,
        (data["name"], data.get("phone", ""), data.get("experience_years", 0), data.get("description", "")),
    )


def delete_guide(guide_id):
    execute("DELETE FROM guides WHERE id = %s", (guide_id,))


def create_group(data):
    return insert_returning(
        """
        INSERT INTO tour_groups (route_id, guide_id, departure_date, return_date, total_people, min_people, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING *
        """,
        (
            data["route_id"],
            data.get("guide_id") or None,
            data["departure_date"],
            data["return_date"],
            data.get("total_people", 0),
            data.get("min_people", 10),
            data.get("status", "待成团"),
        ),
    )


def delete_group(group_id):
    execute("DELETE FROM tour_groups WHERE id = %s", (group_id,))


def create_expense(data):
    return insert_returning(
        """
        INSERT INTO expenses (group_id, expense_type, amount, description)
        VALUES (%s, %s, %s, %s)
        RETURNING *
        """,
        (data["group_id"], data["expense_type"], data["amount"], data.get("description", "")),
    )


def delete_expense(expense_id):
    execute("DELETE FROM expenses WHERE id = %s", (expense_id,))
