import {
  customers as mockCustomers,
  customerRank as mockCustomerRank,
  expenses as mockExpenses,
  groups as mockGroups,
  guides as mockGuides,
  monthlyGroups as mockMonthlyGroups,
  orders as mockOrders,
  profit as mockProfit,
  reportCards as mockReportCards,
  roleSummary as mockRoleSummary,
  routes as mockRoutes,
  routeHot as mockRouteHot,
  users as mockUsers,
  counts as mockCounts,
} from '~/data'
import {
  customersApi,
  dashboardApi,
  expensesApi,
  groupsApi,
  guidesApi,
  ordersApi,
  reportsApi,
  routesApi,
  usersApi,
} from './api'

async function withFallback<T>(load: () => Promise<T>, fallback: T) {
  try {
    return await load()
  } catch (error) {
    if (error instanceof Error && error.message.includes('请先登录')) {
      window.location.href = '/login'
      throw error
    }
    console.warn(error)
    return fallback
  }
}

export function loadDashboardData() {
  return withFallback(dashboardApi.get, {
    counts: mockCounts,
    recent_orders: mockOrders.slice(0, 5),
    group_alerts: mockGroups.filter((group) => group.total_people < group.min_people || group.status === '待成团').slice(0, 5),
    user: { id: 1, username: 'admin', role: '管理员' as const, permissions: ['index', 'users', 'customers', 'routes', 'guides', 'groups', 'orders', 'expenses', 'reports'] },
  })
}

export function loadCustomersData() {
  return withFallback(customersApi.list, { customers: mockCustomers, orders: mockOrders })
}

export function loadRoutesData() {
  return withFallback(routesApi.list, { routes: mockRoutes, groups: mockGroups })
}

export function loadGuidesData() {
  return withFallback(guidesApi.list, { guides: mockGuides, groups: mockGroups.filter((group) => group.guide_name) })
}

export function loadGroupsData() {
  const statusSummary = Array.from(new Set(mockGroups.map((group) => group.status))).map((status) => ({
    status,
    group_count: mockGroups.filter((group) => group.status === status).length,
    people_count: mockGroups.filter((group) => group.status === status).reduce((total, group) => total + group.total_people, 0),
  }))
  return withFallback(groupsApi.list, { groups: mockGroups, routes: mockRoutes, guides: mockGuides, status_summary: statusSummary })
}

export function loadOrdersData() {
  return withFallback(ordersApi.list, { orders: mockOrders, customers: mockCustomers, groups: mockGroups, unpaid_orders: mockOrders.filter((order) => order.balance > 0 && order.order_status !== '已取消') })
}

export function loadExpensesData() {
  const expenseSummary = Array.from(new Set(mockExpenses.map((expense) => `${expense.destination}-${expense.expense_type}`))).map((key) => {
    const [destination, expense_type] = key.split('-')
    return {
      destination,
      expense_type,
      total_amount: mockExpenses.filter((expense) => expense.destination === destination && expense.expense_type === expense_type).reduce((total, expense) => total + expense.amount, 0),
    }
  })
  return withFallback(expensesApi.list, { expenses: mockExpenses, groups: mockGroups, expense_summary: expenseSummary })
}

export function loadReportsData() {
  return withFallback(reportsApi.get, {
    report_cards: mockReportCards,
    monthly_groups: mockMonthlyGroups,
    route_hot: mockRouteHot,
    customer_rank: mockCustomerRank,
    profit: mockProfit,
  })
}

export function loadUsersData() {
  return withFallback(usersApi.list, { users: mockUsers, role_summary: mockRoleSummary })
}
