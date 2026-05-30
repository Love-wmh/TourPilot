from ..database import insert_returning, transaction


def cancel_group(group_id):
    with transaction() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE tour_groups SET status = '已取消' WHERE id = %s RETURNING *",
                (group_id,),
            )
            group = cur.fetchone()
            cur.execute(
                "UPDATE orders SET order_status = '已取消', balance = 0 WHERE group_id = %s",
                (group_id,),
            )
            return group


def change_guide(group_id, guide_id):
    return insert_returning(
        "UPDATE tour_groups SET guide_id = %s WHERE id = %s RETURNING *",
        (guide_id or None, group_id),
    )
