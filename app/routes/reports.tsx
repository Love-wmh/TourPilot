import {
  Badge,
  Card,
  DataTable,
  PageHeader,
  SectionTitle,
  StatCard,
  TableRow,
  Td,
} from '~/components/page'
import { loadReportsData } from '~/lib/data-loader'

export function meta() {
  return [{ title: '统计报表' }]
}

export async function clientLoader() {
  return loadReportsData()
}

export default function ReportsPage({ loaderData }: { loaderData: Awaited<ReturnType<typeof clientLoader>> }) {
  const { report_cards: reportCards, monthly_groups: monthlyGroups, route_hot: routeHot, customer_rank: customerRank, profit } = loaderData

  return (
    <>
      <PageHeader
        eyebrow="Business Intelligence"
        title="统计报表"
        description="从收入、支出、有效团队、余款、线路热度和客户消费维度掌握经营表现。"
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="总实收" value={`¥${reportCards.income.toLocaleString()}`} tone="emerald" />
        <StatCard label="总支出" value={`¥${reportCards.expense.toLocaleString()}`} tone="rose" />
        <StatCard label="有效团队" value={reportCards.active_groups} tone="blue" />
        <StatCard label="待收余款" value={`¥${reportCards.unpaid.toLocaleString()}`} tone="amber" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card>
          <SectionTitle title="月度出团统计" />
          <DataTable headers={['月份', '出团数']}>
            {monthlyGroups.map((row) => (
              <TableRow key={row.month}>
                <Td className="font-medium text-foreground">{row.month}</Td>
                <Td>{row.group_count}</Td>
              </TableRow>
            ))}
          </DataTable>
        </Card>
        <Card>
          <SectionTitle title="线路热度排行" />
          <DataTable headers={['线路', '订单数', '人数']}>
            {routeHot.map((row) => (
              <TableRow key={row.destination}>
                <Td className="font-medium text-foreground">{row.destination}</Td>
                <Td>{row.order_count}</Td>
                <Td>{row.people_count}</Td>
              </TableRow>
            ))}
          </DataTable>
        </Card>
        <Card>
          <SectionTitle title="客户消费排行" />
          <DataTable headers={['客户', '电话', '消费金额']}>
            {customerRank.map((row) => (
              <TableRow key={row.name}>
                <Td className="font-medium text-foreground">{row.name}</Td>
                <Td>{row.phone}</Td>
                <Td>¥{row.total_paid.toLocaleString()}</Td>
              </TableRow>
            ))}
          </DataTable>
        </Card>
        <Card>
          <SectionTitle title="团队利润统计" />
          <DataTable headers={['团队', '线路', '收入', '支出', '利润']}>
            {profit.map((row) => (
              <TableRow key={row.group_id}>
                <Td className="font-medium text-foreground">#{row.group_id}</Td>
                <Td>{row.destination}</Td>
                <Td>¥{row.income.toLocaleString()}</Td>
                <Td>¥{row.expense.toLocaleString()}</Td>
                <Td>
                  <Badge tone={row.profit >= 0 ? 'green' : 'red'}>
                    ¥{row.profit.toLocaleString()}
                  </Badge>
                </Td>
              </TableRow>
            ))}
          </DataTable>
        </Card>
      </div>

      <Card className="mt-5">
        <SectionTitle title="报表说明" description="帮助业务、计调和财务理解各指标用途" />
        <div className="grid gap-3 md:grid-cols-3">
          {[
            '月度出团用于观察业务高峰',
            '线路热度用于调整产品投放',
            '客户排行用于识别高价值客户',
            '利润统计用于财务核算',
            '待收余款用于销售催收',
            '支出汇总用于控制成本',
          ].map((note) => (
            <div
              key={note}
              className="rounded-md border bg-background p-3.5 text-sm font-medium text-muted-foreground"
            >
              {note}
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}
