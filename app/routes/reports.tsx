import { Badge, Card, DataTable, PageHeader, SectionTitle, StatCard } from '~/components/page'
import { customerRank, monthlyGroups, profit, reportCards, routeHot } from '~/data'

export function meta() {
  return [{ title: '统计报表' }]
}

export default function ReportsPage() {
  return (
    <>
      <PageHeader eyebrow="Business Intelligence" title="统计报表" description="从收入、支出、有效团队、余款、线路热度和客户消费维度掌握经营表现。" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="总实收" value={`¥${reportCards.income.toLocaleString()}`} tone="emerald" />
        <StatCard label="总支出" value={`¥${reportCards.expense.toLocaleString()}`} tone="rose" />
        <StatCard label="有效团队" value={reportCards.active_groups} tone="blue" />
        <StatCard label="待收余款" value={`¥${reportCards.unpaid.toLocaleString()}`} tone="amber" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <SectionTitle title="月度出团统计" />
          <DataTable headers={['月份', '出团数']}>
            {monthlyGroups.map((row) => <tr key={row.month}><td className="px-4 py-3 font-medium">{row.month}</td><td className="px-4 py-3">{row.group_count}</td></tr>)}
          </DataTable>
        </Card>
        <Card>
          <SectionTitle title="线路热度排行" />
          <DataTable headers={['线路', '订单数', '人数']}>
            {routeHot.map((row) => <tr key={row.destination}><td className="px-4 py-3 font-medium">{row.destination}</td><td className="px-4 py-3">{row.order_count}</td><td className="px-4 py-3">{row.people_count}</td></tr>)}
          </DataTable>
        </Card>
        <Card>
          <SectionTitle title="客户消费排行" />
          <DataTable headers={['客户', '电话', '消费金额']}>
            {customerRank.map((row) => <tr key={row.name}><td className="px-4 py-3 font-medium">{row.name}</td><td className="px-4 py-3">{row.phone}</td><td className="px-4 py-3">¥{row.total_paid.toLocaleString()}</td></tr>)}
          </DataTable>
        </Card>
        <Card>
          <SectionTitle title="团队利润统计" />
          <DataTable headers={['团队', '线路', '收入', '支出', '利润']}>
            {profit.map((row) => <tr key={row.group_id}><td className="px-4 py-3 font-medium">#{row.group_id}</td><td className="px-4 py-3">{row.destination}</td><td className="px-4 py-3">¥{row.income.toLocaleString()}</td><td className="px-4 py-3">¥{row.expense.toLocaleString()}</td><td className="px-4 py-3"><Badge tone={row.profit >= 0 ? 'green' : 'red'}>¥{row.profit.toLocaleString()}</Badge></td></tr>)}
          </DataTable>
        </Card>
      </div>

      <Card className="mt-6">
        <SectionTitle title="报表说明" description="帮助业务、计调和财务理解各指标用途" />
        <div className="grid gap-3 md:grid-cols-3">
          {['月度出团用于观察业务高峰', '线路热度用于调整产品投放', '客户排行用于识别高价值客户', '利润统计用于财务核算', '待收余款用于销售催收', '支出汇总用于控制成本'].map((note) => (
            <div key={note} className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-700">{note}</div>
          ))}
        </div>
      </Card>
    </>
  )
}
