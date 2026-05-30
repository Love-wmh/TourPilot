import { Trash2 } from 'lucide-react'

import { Badge, Card, DataTable, FormGrid, PageHeader, SectionTitle, SelectInput, StatCard, TextInput } from '~/components/page'
import { Button } from '~/components/ui/button'
import { expenses, groups } from '~/data'

export function meta() {
  return [{ title: '费用管理' }]
}

export default function ExpensesPage() {
  const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0)
  const expenseSummary = Array.from(new Set(expenses.map((expense) => `${expense.destination}-${expense.expense_type}`))).map((key) => {
    const [destination, expense_type] = key.split('-')
    return {
      destination,
      expense_type,
      total_amount: expenses.filter((expense) => expense.destination === destination && expense.expense_type === expense_type).reduce((total, expense) => total + expense.amount, 0),
    }
  })

  return (
    <>
      <PageHeader eyebrow="Cost Control" title="费用管理" description="登记团队支出、费用类型和说明，支持财务成本归集与利润核算。" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="总支出" value={`¥${totalExpense.toLocaleString()}`} tone="rose" />
        <StatCard label="费用记录" value={expenses.length} tone="blue" />
        <StatCard label="覆盖团队" value={new Set(expenses.map((expense) => expense.group_id)).size} tone="emerald" />
      </div>

      <Card>
        <SectionTitle title="新增费用" description="选择团队并登记费用类型、金额与说明" />
        <FormGrid>
          <SelectInput name="group_id" required>{groups.map((group) => <option key={group.id} value={group.id}>{group.destination} {group.departure_date}</option>)}</SelectInput>
          <SelectInput name="expense_type"><option>地接费</option><option>导游补贴</option><option>保险</option><option>交通</option><option>其他</option></SelectInput>
          <TextInput name="amount" type="number" min={0} step="0.01" placeholder="金额" required />
          <TextInput name="description" placeholder="说明" />
          <Button type="button" className="h-11 rounded-2xl xl:col-span-4">新增费用</Button>
        </FormGrid>
        <DataTable headers={['编号', '团队', '出发日期', '费用类型', '金额', '说明', '日期', '操作']}>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td className="px-4 py-3 font-medium">#{expense.id}</td>
              <td className="px-4 py-3 font-semibold text-slate-900">{expense.destination}</td>
              <td className="px-4 py-3">{expense.departure_date}</td>
              <td className="px-4 py-3"><Badge tone="blue">{expense.expense_type}</Badge></td>
              <td className="px-4 py-3">¥{expense.amount.toLocaleString()}</td>
              <td className="px-4 py-3">{expense.description}</td>
              <td className="px-4 py-3">{expense.expense_date}</td>
              <td className="px-4 py-3"><Button type="button" variant="destructive" size="sm"><Trash2 className="size-3.5" />删除</Button></td>
            </tr>
          ))}
        </DataTable>
      </Card>

      <Card className="mt-6">
        <SectionTitle title="费用分类汇总" description="按线路和费用类型汇总支出" />
        <DataTable headers={['线路', '费用类型', '合计金额']}>
          {expenseSummary.map((item) => (
            <tr key={`${item.destination}-${item.expense_type}`}>
              <td className="px-4 py-3 font-medium">{item.destination}</td>
              <td className="px-4 py-3">{item.expense_type}</td>
              <td className="px-4 py-3">¥{item.total_amount.toLocaleString()}</td>
            </tr>
          ))}
        </DataTable>
      </Card>
    </>
  )
}
