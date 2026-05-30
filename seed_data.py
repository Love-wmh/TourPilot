import psycopg2

conn = psycopg2.connect(
    host="localhost",
    port=54321,
    database="travel_agency",
    user="system",
    password="123456789"
)

cur = conn.cursor()

sql = """
INSERT INTO users (username, password, role) VALUES
('admin', '123456', '管理员'),
('sales', '123456', '销售'),
('planner', '123456', '计调'),
('finance', '123456', '财务'),
('guide01', '123456', '导游');

INSERT INTO customers (name, id_card, phone, emergency_contact, travel_preference) VALUES
('张三', '120101199901010011', '13800000001', '李四 13800000002', '海岛、休闲'),
('王五', '120101199802020022', '13800000003', '赵六 13800000004', '历史文化'),
('刘敏', '120101200003030033', '13800000005', '刘强 13800000006', '亲子游');

INSERT INTO routes (destination, days, attractions, adult_price, child_price, status) VALUES
('北京', 3, '故宫、长城、颐和园', 1880.00, 1280.00, '启用'),
('上海', 4, '外滩、迪士尼、南京路', 2680.00, 1980.00, '启用'),
('三亚', 5, '亚龙湾、蜈支洲岛、南山文化旅游区', 3980.00, 2880.00, '启用');

INSERT INTO guides (name, phone, experience_years, description) VALUES
('李导', '13900000001', 5, '熟悉北京线路'),
('王导', '13900000002', 8, '擅长华东线路'),
('赵导', '13900000003', 3, '适合亲子团队');

INSERT INTO tour_groups (route_id, guide_id, departure_date, return_date, total_people, min_people, status) VALUES
(1, 1, '2026-06-01', '2026-06-03', 12, 10, '已成团'),
(2, 2, '2026-06-10', '2026-06-13', 8, 10, '待成团'),
(3, 3, '2026-07-01', '2026-07-05', 15, 10, '已成团');

INSERT INTO orders (customer_id, group_id, people_count, order_status, amount_receivable, amount_paid, balance) VALUES
(1, 1, 2, '已支付', 3760.00, 3760.00, 0.00),
(2, 1, 1, '已支付', 1880.00, 1880.00, 0.00),
(3, 2, 3, '待支付', 8040.00, 3000.00, 5040.00);

INSERT INTO expenses (group_id, expense_type, amount, description) VALUES
(1, '地接费', 8000.00, '北京三日游地接服务'),
(1, '导游补贴', 1200.00, '李导带团补贴'),
(3, '地接费', 15000.00, '三亚五日游地接服务');
"""

cur.execute(sql)
conn.commit()

cur.close()
conn.close()

print("测试数据插入成功")