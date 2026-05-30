import axios from 'axios'

export type Role = '管理员' | '销售' | '计调' | '财务' | '导游'
export type Permission = 'index' | 'users' | 'customers' | 'routes' | 'guides' | 'groups' | 'orders' | 'expenses' | 'reports'

export type ApiResponse<T> = {
  code: number
  message: string
  data: T
}

export type User = { id: number; username: string; role: Role; permissions?: Permission[] }
export type Customer = { id: number; name: string; id_card: string; phone: string; emergency_contact?: string; travel_preference?: string }
export type TravelRoute = { id: number; destination: string; days: number; attractions?: string; adult_price: number; child_price: number; status: string }
export type Guide = { id: number; name: string; phone: string; experience_years: number; description?: string; group_count?: number }
export type TourGroup = { id: number; route_id?: number; guide_id?: number | null; destination: string; guide_name?: string | null; departure_date: string; return_date: string; total_people: number; min_people: number; status: string }
export type Order = { id: number; customer_id?: number; group_id?: number; customer_name: string; destination: string; departure_date?: string; people_count: number; order_status: string; amount_receivable: number; amount_paid: number; balance: number }
export type Expense = { id: number; group_id: number; destination: string; departure_date: string; expense_type: string; amount: number; description?: string; expense_date?: string }

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001/api',
  withCredentials: true,
})

apiClient.interceptors.response.use((response) => response, (error) => {
  const message = error.response?.data?.message ?? error.message ?? '请求失败'
  return Promise.reject(new Error(message))
})

async function request<T>(promise: Promise<{ data: ApiResponse<T> }>) {
  const response = await promise
  return response.data.data
}

export const authApi = {
  login: (data: { username: string; password: string }) => request<User>(apiClient.post('/auth/login', data)),
  logout: () => request<boolean>(apiClient.post('/auth/logout')),
  me: () => request<User | null>(apiClient.get('/auth/me')),
}

export const dashboardApi = {
  get: () => request<{ counts: Record<string, number>; recent_orders: Order[]; group_alerts: TourGroup[]; user: User }>(apiClient.get('/dashboard')),
}

export const customersApi = {
  list: () => request<{ customers: Customer[]; orders: Order[] }>(apiClient.get('/customers')),
  create: (data: Omit<Customer, 'id'>) => request<Customer>(apiClient.post('/customers', data)),
  remove: (id: number) => request<boolean>(apiClient.delete(`/customers/${id}`)),
}

export const routesApi = {
  list: () => request<{ routes: TravelRoute[]; groups: TourGroup[] }>(apiClient.get('/routes')),
  create: (data: Omit<TravelRoute, 'id'>) => request<TravelRoute>(apiClient.post('/routes', data)),
  remove: (id: number) => request<boolean>(apiClient.delete(`/routes/${id}`)),
}

export const guidesApi = {
  list: () => request<{ guides: Guide[]; groups: TourGroup[] }>(apiClient.get('/guides')),
  create: (data: Omit<Guide, 'id' | 'group_count'>) => request<Guide>(apiClient.post('/guides', data)),
  remove: (id: number) => request<boolean>(apiClient.delete(`/guides/${id}`)),
}

export const groupsApi = {
  list: () => request<{ groups: TourGroup[]; routes: TravelRoute[]; guides: Guide[]; status_summary: Array<{ status: string; group_count: number; people_count: number }> }>(apiClient.get('/groups')),
  create: (data: Partial<TourGroup>) => request<TourGroup>(apiClient.post('/groups', data)),
  remove: (id: number) => request<boolean>(apiClient.delete(`/groups/${id}`)),
  cancel: (id: number) => request<TourGroup>(apiClient.post(`/groups/${id}/cancel`)),
  changeGuide: (id: number, guide_id: number | null) => request<TourGroup>(apiClient.post(`/groups/${id}/change-guide`, { guide_id })),
}

export const ordersApi = {
  list: () => request<{ orders: Order[]; customers: Customer[]; groups: TourGroup[]; unpaid_orders: Order[] }>(apiClient.get('/orders')),
  create: (data: Partial<Order>) => request<Order>(apiClient.post('/orders', data)),
  remove: (id: number) => request<boolean>(apiClient.delete(`/orders/${id}`)),
  cancel: (id: number, deduct_fee = 0) => request<Order>(apiClient.post(`/orders/${id}/cancel`, { deduct_fee })),
}

export const expensesApi = {
  list: () => request<{ expenses: Expense[]; groups: TourGroup[]; expense_summary: Array<{ destination: string; expense_type: string; total_amount: number }> }>(apiClient.get('/expenses')),
  create: (data: Partial<Expense>) => request<Expense>(apiClient.post('/expenses', data)),
  remove: (id: number) => request<boolean>(apiClient.delete(`/expenses/${id}`)),
}

export const reportsApi = {
  get: () => request<{ report_cards: Record<string, number>; monthly_groups: Array<{ month: string; group_count: number }>; route_hot: Array<{ destination: string; order_count: number; people_count: number }>; customer_rank: Array<{ name: string; phone: string; total_paid: number }>; profit: Array<{ group_id: number; destination: string; income: number; expense: number; profit: number }> }>(apiClient.get('/reports')),
}

export const usersApi = {
  list: () => request<{ users: User[]; role_summary: Array<{ role: Role; user_count: number; duty: string }> }>(apiClient.get('/users')),
  create: (data: { username: string; password: string; role: Role }) => request<User>(apiClient.post('/users', data)),
  remove: (id: number) => request<boolean>(apiClient.delete(`/users/${id}`)),
}
