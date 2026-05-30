export type Role = '管理员' | '销售' | '计调' | '财务' | '导游'

export type Permission =
  | 'index'
  | 'users'
  | 'customers'
  | 'routes'
  | 'guides'
  | 'groups'
  | 'orders'
  | 'expenses'
  | 'reports'

export const currentUser = {
  id: 1,
  username: 'admin',
  role: '管理员' as Role,
}

const rolePermissions: Record<Role, Permission[]> = {
  管理员: ['index', 'users', 'customers', 'routes', 'guides', 'groups', 'orders', 'expenses', 'reports'],
  销售: ['index', 'customers', 'orders', 'reports'],
  计调: ['index', 'routes', 'guides', 'groups', 'reports'],
  财务: ['index', 'orders', 'expenses', 'reports'],
  导游: ['index', 'guides', 'groups', 'reports'],
}

export function canAccess(permission: Permission) {
  return rolePermissions[currentUser.role].includes(permission)
}

export const customers = [
  {
    id: 1,
    name: '王小明',
    id_card: '110101199001011234',
    phone: '13800001111',
    emergency_contact: '王女士 13900001111',
    travel_preference: '亲子游、海岛',
  },
  {
    id: 2,
    name: '李思雨',
    id_card: '310101199205054321',
    phone: '13600002222',
    emergency_contact: '李先生 13700002222',
    travel_preference: '摄影、文化体验',
  },
  {
    id: 3,
    name: '陈浩',
    id_card: '440101198812123333',
    phone: '13500003333',
    emergency_contact: '陈女士 13500004444',
    travel_preference: '户外、轻奢团',
  },
]

export const routes = [
  {
    id: 1,
    destination: '云南大理丽江双飞 6 日',
    days: 6,
    attractions: '洱海、玉龙雪山、束河古镇',
    adult_price: 3980,
    child_price: 2680,
    status: '启用',
  },
  {
    id: 2,
    destination: '三亚亲子海岛 5 日',
    days: 5,
    attractions: '亚龙湾、蜈支洲岛、海昌梦幻城',
    adult_price: 4680,
    child_price: 3280,
    status: '启用',
  },
  {
    id: 3,
    destination: '成都九寨沟深度 7 日',
    days: 7,
    attractions: '宽窄巷子、黄龙、九寨沟',
    adult_price: 5280,
    child_price: 3680,
    status: '停用',
  },
]

export const guides = [
  { id: 1, name: '赵导', phone: '13911112222', experience_years: 8, description: '亲和力强，擅长亲子团', group_count: 2 },
  { id: 2, name: '周导', phone: '13933334444', experience_years: 5, description: '摄影线路经验丰富', group_count: 1 },
  { id: 3, name: '林导', phone: '13955556666', experience_years: 10, description: '擅长高端定制团', group_count: 0 },
]

export const groups = [
  {
    id: 1,
    route_id: 1,
    guide_id: 1,
    destination: '云南大理丽江双飞 6 日',
    guide_name: '赵导',
    departure_date: '2026-06-12',
    return_date: '2026-06-17',
    total_people: 18,
    min_people: 10,
    status: '已成团',
  },
  {
    id: 2,
    route_id: 2,
    guide_id: 2,
    destination: '三亚亲子海岛 5 日',
    guide_name: '周导',
    departure_date: '2026-07-02',
    return_date: '2026-07-06',
    total_people: 7,
    min_people: 12,
    status: '待成团',
  },
  {
    id: 3,
    route_id: 1,
    guide_id: null,
    destination: '云南大理丽江双飞 6 日',
    guide_name: null,
    departure_date: '2026-07-18',
    return_date: '2026-07-23',
    total_people: 0,
    min_people: 10,
    status: '待成团',
  },
]

export const orders = [
  {
    id: 1,
    customer_id: 1,
    group_id: 1,
    customer_name: '王小明',
    destination: '云南大理丽江双飞 6 日',
    departure_date: '2026-06-12',
    people_count: 3,
    order_status: '已支付',
    amount_receivable: 11240,
    amount_paid: 11240,
    balance: 0,
  },
  {
    id: 2,
    customer_id: 2,
    group_id: 2,
    customer_name: '李思雨',
    destination: '三亚亲子海岛 5 日',
    departure_date: '2026-07-02',
    people_count: 2,
    order_status: '待支付',
    amount_receivable: 7960,
    amount_paid: 3000,
    balance: 4960,
  },
  {
    id: 3,
    customer_id: 3,
    group_id: 1,
    customer_name: '陈浩',
    destination: '云南大理丽江双飞 6 日',
    departure_date: '2026-06-12',
    people_count: 1,
    order_status: '已取消',
    amount_receivable: 3980,
    amount_paid: 500,
    balance: 0,
  },
]

export const expenses = [
  { id: 1, group_id: 1, destination: '云南大理丽江双飞 6 日', departure_date: '2026-06-12', expense_type: '地接费', amount: 32000, description: '当地接待', expense_date: '2026-05-25' },
  { id: 2, group_id: 1, destination: '云南大理丽江双飞 6 日', departure_date: '2026-06-12', expense_type: '导游补贴', amount: 1800, description: '赵导补贴', expense_date: '2026-05-26' },
  { id: 3, group_id: 2, destination: '三亚亲子海岛 5 日', departure_date: '2026-07-02', expense_type: '保险', amount: 560, description: '游客保险', expense_date: '2026-05-28' },
]

export const roleSummary = [
  { role: '管理员', user_count: 1, duty: '系统维护与用户管理' },
  { role: '销售', user_count: 2, duty: '维护客户、处理报名订单' },
  { role: '计调', user_count: 2, duty: '安排线路、团队和导游' },
  { role: '财务', user_count: 1, duty: '登记费用、查看利润报表' },
  { role: '导游', user_count: 3, duty: '查看带团信息' },
]

export const users = [
  { id: 1, username: 'admin', role: '管理员' },
  { id: 2, username: 'sales', role: '销售' },
  { id: 3, username: 'planner', role: '计调' },
  { id: 4, username: 'finance', role: '财务' },
  { id: 5, username: 'guide01', role: '导游' },
]

export const counts = {
  customers: customers.length,
  routes: routes.length,
  guides: guides.length,
  groups: groups.length,
  orders: orders.length,
}

export const reportCards = {
  income: orders.reduce((total, order) => total + order.amount_paid, 0),
  expense: expenses.reduce((total, expense) => total + expense.amount, 0),
  active_groups: groups.filter((group) => group.status !== '已取消').length,
  unpaid: orders.filter((order) => order.order_status !== '已取消').reduce((total, order) => total + order.balance, 0),
}

export const monthlyGroups = [
  { month: '2026-06', group_count: 1 },
  { month: '2026-07', group_count: 2 },
]

export const routeHot = routes.map((route) => {
  const routeGroups = groups.filter((group) => group.route_id === route.id)
  const routeOrders = orders.filter((order) => routeGroups.some((group) => group.id === order.group_id))
  return {
    destination: route.destination,
    order_count: routeOrders.length,
    people_count: routeOrders.reduce((total, order) => total + order.people_count, 0),
  }
})

export const customerRank = customers.map((customer) => ({
  name: customer.name,
  phone: customer.phone,
  total_paid: orders
    .filter((order) => order.customer_id === customer.id)
    .reduce((total, order) => total + order.amount_paid, 0),
}))

export const profit = groups.map((group) => {
  const income = orders.filter((order) => order.group_id === group.id).reduce((total, order) => total + order.amount_paid, 0)
  const expense = expenses.filter((item) => item.group_id === group.id).reduce((total, item) => total + item.amount, 0)
  return { group_id: group.id, destination: group.destination, income, expense, profit: income - expense }
})
