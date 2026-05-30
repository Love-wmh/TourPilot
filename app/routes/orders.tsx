import { ReceiptText, Trash2 } from 'lucide-react'

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
import { StatusMessage } from '~/components/status-message'
import { Button } from '~/components/ui/button'
import { ordersApi } from '~/lib/api'
import { formDataToObject, numberValue, useMutation } from '~/lib/actions'
import { loadOrdersData } from '~/lib/data-loader'

export function meta() {
  return [{ title: '报名与订单管理' }]
}

export async function clientLoader() {
  return loadOrdersData()
}

export default function OrdersPage({ loaderData }: { loaderData: Awaited<ReturnType<typeof clientLoader>> }) {
  const { orders, customers, groups, unpaid_orders: unpaidOrders } = loaderData
  const mutation = useMutation()
  const receivable = orders.reduce((total, order) => total + order.amount_receivable, 0)
  const paid = orders.reduce((total, order) => total + order.amount_paid, 0)
  const balance = orders.reduce((total, order) => total + order.balance, 0)

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const values = formDataToObject(form)
    const data = {
      customer_id: numberValue(values.customer_id),
      group_id: numberValue(values.group_id),
      people_count: numberValue(values.people_count, 1),
      order_status: String(values.order_status || '待支付'),
      amount_receivable: numberValue(values.amount_receivable),
      amount_paid: numberValue(values.amount_paid),
    }
    mutation.run(() => ordersApi.create(data), '订单新增成功', form)
  }

  function handleRemove(id: number) {
    if (!window.confirm('确认删除该订单吗？')) return
    mutation.run(() => ordersApi.remove(id), '订单删除成功')
  }

  function handleCancel(id: number) {
    const input = window.prompt('请输入退团扣费金额', '0')
    if (input === null) return
    const deductFee = Number(input)
    if (!Number.isFinite(deductFee) || deductFee < 0) return
    mutation.run(() => ordersApi.cancel(id, deductFee), '退团扣费处理成功')
  }

  return (
    <>
      <PageHeader
        eyebrow="Booking Center"
        title="报名与订单管理"
        description="处理客户报名、收款、余款跟进与退团扣费异常流程。"
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <StatCard label="应收金额" value={`¥${receivable.toLocaleString()}`} tone="blue" />
        <StatCard label="实收金额" value={`¥${paid.toLocaleString()}`} tone="emerald" />
        <StatCard label="待收余款" value={`¥${balance.toLocaleString()}`} tone="amber" />
      </div>

      <Card>
        <SectionTitle title="新增订单" description="选择客户和团队后录入报名人数与收款信息" />
        <FormGrid onSubmit={handleCreate}>
          <SelectInput name="customer_id" required>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </SelectInput>
          <SelectInput name="group_id" required>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.destination} {group.departure_date}
              </option>
            ))}
          </SelectInput>
          <TextInput
            name="people_count"
            type="number"
            min={1}
            placeholder="报名人数"
            defaultValue={1}
            required
          />
          <SelectInput name="order_status">
            <option>待支付</option>
            <option>已支付</option>
            <option>已取消</option>
          </SelectInput>
          <TextInput
            name="amount_receivable"
            type="number"
            min={0}
            step="0.01"
            placeholder="应收金额"
            required
          />
          <TextInput
            name="amount_paid"
            type="number"
            min={0}
            step="0.01"
            placeholder="实收金额"
            defaultValue={0}
            required
          />
          <Button className="h-9 xl:col-span-2" disabled={mutation.busy}>
            新增订单
          </Button>
        </FormGrid>
        <StatusMessage message={mutation.message} error={mutation.error} />
        <DataTable
          headers={[
            '编号',
            '客户',
            '线路',
            '出发日期',
            '人数',
            '状态',
            '应收',
            '实收',
            '余款',
            '异常处理',
            '操作',
          ]}
        >
          {orders.map((order) => (
            <TableRow key={order.id}>
              <Td className="font-medium text-foreground">#{order.id}</Td>
              <Td className="font-semibold text-foreground">{order.customer_name}</Td>
              <Td>{order.destination}</Td>
              <Td>{order.departure_date}</Td>
              <Td>{order.people_count}</Td>
              <Td>
                <Badge
                  tone={
                    order.order_status === '已取消'
                      ? 'red'
                      : order.order_status === '已支付'
                        ? 'green'
                        : 'amber'
                  }
                >
                  {order.order_status}
                </Badge>
              </Td>
              <Td>¥{order.amount_receivable.toLocaleString()}</Td>
              <Td>¥{order.amount_paid.toLocaleString()}</Td>
              <Td>¥{order.balance.toLocaleString()}</Td>
              <Td>
                {order.order_status === '已取消' ? (
                  <Badge tone="amber">退团扣费已记录</Badge>
                ) : order.balance > 0 ? (
                  <Badge tone="red">存在余款</Badge>
                ) : (
                  <Badge tone="green">正常</Badge>
                )}
              </Td>
              <Td>
                <div className="flex flex-wrap gap-2">
                  {order.order_status !== '已取消' && (
                    <Button type="button" variant="outline" size="sm" onClick={() => handleCancel(order.id)} disabled={mutation.busy}>
                      <ReceiptText className="size-3.5" />
                      退团扣费
                    </Button>
                  )}
                  <Button type="button" variant="destructive" size="sm" onClick={() => handleRemove(order.id)} disabled={mutation.busy}>
                    <Trash2 className="size-3.5" />
                    删除
                  </Button>
                </div>
              </Td>
            </TableRow>
          ))}
        </DataTable>
      </Card>

      <Card className="mt-5">
        <SectionTitle title="待收余款订单" description="销售可据此进行催收跟进" />
        <DataTable headers={['订单', '客户', '线路', '应收', '实收', '余款']}>
          {unpaidOrders.map((order) => (
            <TableRow key={order.id}>
              <Td className="font-medium text-foreground">#{order.id}</Td>
              <Td>{order.customer_name}</Td>
              <Td>{order.destination}</Td>
              <Td>¥{order.amount_receivable.toLocaleString()}</Td>
              <Td>¥{order.amount_paid.toLocaleString()}</Td>
              <Td>
                <Badge tone="red">¥{order.balance.toLocaleString()}</Badge>
              </Td>
            </TableRow>
          ))}
        </DataTable>
      </Card>
    </>
  )
}
