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
import { Button } from '~/components/ui/button'
import { customers, groups, orders } from '~/data'

export function meta() {
  return [{ title: '报名与订单管理' }]
}

export default function OrdersPage() {
  const receivable = orders.reduce((total, order) => total + order.amount_receivable, 0)
  const paid = orders.reduce((total, order) => total + order.amount_paid, 0)
  const balance = orders.reduce((total, order) => total + order.balance, 0)
  const unpaidOrders = orders.filter(
    (order) => order.balance > 0 && order.order_status !== '已取消'
  )

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
        <FormGrid>
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
          <Button type="button" className="h-9 xl:col-span-2">
            新增订单
          </Button>
        </FormGrid>
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
                    <Button type="button" variant="outline" size="sm">
                      <ReceiptText className="size-3.5" />
                      退团扣费
                    </Button>
                  )}
                  <Button type="button" variant="destructive" size="sm">
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
