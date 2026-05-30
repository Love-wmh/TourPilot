import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  route('login', 'routes/login.tsx'),
  layout('components/layout.tsx', [
    index('routes/home.tsx'),
    route('customers', 'routes/customers.tsx'),
    route('routes', 'routes/routes-page.tsx'),
    route('guides', 'routes/guides.tsx'),
    route('groups', 'routes/groups.tsx'),
    route('orders', 'routes/orders.tsx'),
    route('expenses', 'routes/expenses.tsx'),
    route('reports', 'routes/reports.tsx'),
    route('users', 'routes/users.tsx'),
  ]),
] satisfies RouteConfig
