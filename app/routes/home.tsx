import { ArrowRight, CalendarClock, CheckCircle2, CircleAlert, UsersRound } from 'lucide-react'
import { Link } from 'react-router'

import { Badge, Card, DataTable, PageHeader, SectionTitle, StatCard } from '~/components/page'
import { canAccess, counts, groups, orders } from '~/data'

export function meta() {
  return [
    { title: '首页 - 旅行社团队管理系统' },
    { name: 'description', content: '旅行社团队、订单、客户与费用管理看板' },
  ]
}

const modules = [
  { label: '客户信息管理', href: '/customers', permission: 'customers' as const, description: '客户档案、联系人与偏好' },
  { label: '旅游线路管理', href: '/routes', permission: 'routes' as const, description: '价格、天数与线路状态' },
  { label: '导游管理', href: '/guides', permission: 'guides' as const, description: '导游资源和带团明细' },
  { label: '团队管理', href: '/groups', permission: 'groups' as const, description: '成团、排期和换导游' },
  { label: '报名与订单管理', href: '/orders', permission: 'orders' as const, description: '报名、收款和退团' },
  { label: '费用管理', href: '/expenses', permission: 'expenses' as const, description: '支出登记和分类汇总' },
  { label: '统计报表', href: '/reports', permission: 'reports' as const, description: '收入、利润与排行' },
  { label: '用户与角色管理', href: '/users', permission: 'users' as const, description: '账号与权限角色' },
]

export default function Home() {
  const recentOrders = orders.slice(0, 5)
  const groupAlerts = groups.filter((group) => group.total_people < group.min_people || group.status === '待成团').slice(0, 5)

  return (
    <>
      <PageHeader
        eyebrow="Operation Center"
        title="一体化旅行社团队管理看板"
        description="集中掌握客户、线路、导游、团队、报名订单与费用数据，让销售、计调和财务协同更清晰。"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="客户" value={counts.customers} tone="blue" />
        <StatCard label="线路" value={counts.routes} tone="emerald" />
        <StatCard label="导游" value={counts.guides} tone="amber" />
        <StatCard label="团队" value={counts.groups} tone="violet" />
        <StatCard label="订单" value={counts.orders} tone="rose" />
      </div>

      <Card className="mt-6">
        <SectionTitle title="常用功能" description="按当前角色展示可访问模块" />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {modules
            .filter((item) => canAccess(item.permission))
            .map((item) => (
              <Link key={item.href} to={item.href} className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-950">{item.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                  </div>
                  <ArrowRight className="size-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-950" />
                </div>
              </Link>
            ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <SectionTitle title="近期订单" description="最新报名与付款状态" />
          <DataTable headers={['编号', '客户', '线路', '人数', '状态', '实收']}>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-medium">#{order.id}</td>
                <td className="px-4 py-3">{order.customer_name}</td>
                <td className="px-4 py-3">{order.destination}</td>
                <td className="px-4 py-3">{order.people_count}</td>
                <td className="px-4 py-3"><Badge tone={order.order_status === '已取消' ? 'red' : order.order_status === '已支付' ? 'green' : 'amber'}>{order.order_status}</Badge></td>
                <td className="px-4 py-3">¥{order.amount_paid.toLocaleString()}</td>
              </tr>
            ))}
          </DataTable>
        </Card>

        <Card>
          <SectionTitle title="待处理团队" description="人数不足或待成团提醒" />
          <DataTable headers={['团队', '线路', '人数', '最低', '状态']}>
            {groupAlerts.map((group) => (
              <tr key={group.id}>
                <td className="px-4 py-3 font-medium">#{group.id}</td>
                <td className="px-4 py-3">{group.destination}</td>
                <td className="px-4 py-3">{group.total_people}</td>
                <td className="px-4 py-3">{group.min_people}</td>
                <td className="px-4 py-3"><Badge tone="amber">{group.status}</Badge></td>
              </tr>
            ))}
          </DataTable>
        </Card>
      </div>

      <Card className="mt-6">
        <SectionTitle title="业务流程" description="从客户登记到利润统计的闭环" />
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {['客户登记', '选择线路', '生成团队', '报名下单', '费用登记', '统计利润'].map((step, index) => (
            <div key={step} className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-3 flex size-9 items-center justify-center rounded-full bg-white shadow-sm">
                {index < 3 ? <CheckCircle2 className="size-4 text-emerald-500" /> : index === 3 ? <CalendarClock className="size-4 text-blue-500" /> : <CircleAlert className="size-4 text-amber-500" />}
              </div>
              <p className="font-medium text-slate-900">{step}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}
