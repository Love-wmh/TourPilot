from ..database import fetch_one, insert_returning, serialize, transaction


def create_order(data):
    receivable = float(data["amount_receivable"])
    paid = float(data.get("amount_paid", 0))
    people_count = int(data.get("people_count", 1))
    group_id = int(data["group_id"])
    status = data.get("order_status", "待支付")

    with transaction() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO orders
                    (customer_id, group_id, people_count, order_status,
                     amount_receivable, amount_paid, balance)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (
                    data["customer_id"],
                    group_id,
                    people_count,
                    status,
                    receivable,
                    paid,
                    max(receivable - paid, 0),
                ),
            )
            order = cur.fetchone()
            if status != "已取消":
                cur.execute(
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
            return serialize(order)


def delete_order(order_id):
    from ..database import execute

    execute("DELETE FROM orders WHERE id = %s", (order_id,))


def cancel_order(order_id, deduct_fee=0):
    order = fetch_one(
        "SELECT group_id, people_count, order_status FROM orders WHERE id = %s",
        (order_id,),
    )
    with transaction() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE orders
                SET order_status = '已取消', amount_paid = %s, balance = 0
                WHERE id = %s
                RETURNING *
                """,
                (deduct_fee, order_id),
            )
            updated = cur.fetchone()
            if order and order["order_status"] != "已取消":
                cur.execute(
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
            return serialize(updated)
