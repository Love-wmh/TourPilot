import { Trash2 } from 'lucide-react'

import {
  Badge,
  Card,
  DataTable,
  FormGrid,
  PageHeader,
  SectionTitle,
  SelectInput,
  StatCard,
  TableRow,
  Td,
  TextInput,
} from '~/components/page'
import { Button } from '~/components/ui/button'
import { loadExpensesData } from '~/lib/data-loader'

export function meta() {
  return [{ title: '费用管理' }]
}

export async function clientLoader() {
  return loadExpensesData()
}

export default function ExpensesPage({ loaderData }: { loaderData: Awaited<ReturnType<typeof clientLoader>> }) {
  const { expenses, groups, expense_summary: expenseSummary } = loaderData
  const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0)

  return (
    <>
      <PageHeader
        eyebrow="Cost Control"
        title="费用管理"
        description="登记团队支出、费用类型和说明，支持财务成本归集与利润核算。"
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <StatCard label="总支出" value={`¥${totalExpense.toLocaleString()}`} tone="rose" />
        <StatCard label="费用记录" value={expenses.length} tone="blue" />
        <StatCard
          label="覆盖团队"
          value={new Set(expenses.map((expense) => expense.group_id)).size}
          tone="emerald"
        />
      </div>

      <Card>
        <SectionTitle title="新增费用" description="选择团队并登记费用类型、金额与说明" />
        <FormGrid>
          <SelectInput name="group_id" required>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.destination} {group.departure_date}
              </option>
            ))}
          </SelectInput>
          <SelectInput name="expense_type">
            <option>地接费</option>
            <option>导游补贴</option>
            <option>保险</option>
            <option>交通</option>
            <option>其他</option>
          </SelectInput>
          <TextInput name="amount" type="number" min={0} step="0.01" placeholder="金额" required />
          <TextInput name="description" placeholder="说明" />
          <Button type="button" className="h-9 xl:col-span-4">
            新增费用
          </Button>
        </FormGrid>
        <DataTable
          headers={['编号', '团队', '出发日期', '费用类型', '金额', '说明', '日期', '操作']}
        >
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <Td className="font-medium text-foreground">#{expense.id}</Td>
              <Td className="font-semibold text-foreground">{expense.destination}</Td>
              <Td>{expense.departure_date}</Td>
              <Td>
                <Badge tone="blue">{expense.expense_type}</Badge>
              </Td>
              <Td>¥{expense.amount.toLocaleString()}</Td>
              <Td>{expense.description}</Td>
              <Td>{expense.expense_date}</Td>
              <Td>
                <Button type="button" variant="destructive" size="sm">
                  <Trash2 className="size-3.5" />
                  删除
                </Button>
              </Td>
            </TableRow>
          ))}
        </DataTable>
      </Card>

      <Card className="mt-5">
        <SectionTitle title="费用分类汇总" description="按线路和费用类型汇总支出" />
        <DataTable headers={['线路', '费用类型', '合计金额']}>
          {expenseSummary.map((item) => (
            <TableRow key={`${item.destination}-${item.expense_type}`}>
              <Td className="font-medium text-foreground">{item.destination}</Td>
              <Td>{item.expense_type}</Td>
              <Td>¥{item.total_amount.toLocaleString()}</Td>
            </TableRow>
          ))}
        </DataTable>
      </Card>
    </>
  )
}
