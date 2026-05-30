import { Trash2 } from 'lucide-react'

import {
  Badge,
  Card,
  DataTable,
  FormGrid,
  PageHeader,
  SectionTitle,
  TableRow,
  Td,
  TextInput,
} from '~/components/page'
import { StatusMessage } from '~/components/status-message'
import { Button } from '~/components/ui/button'
import { customersApi } from '~/lib/api'
import { formDataToObject, useMutation } from '~/lib/actions'
import { loadCustomersData } from '~/lib/data-loader'

export function meta() {
  return [{ title: '客户信息管理' }]
}

export async function clientLoader() {
  return loadCustomersData()
}

export default function CustomersPage({ loaderData }: { loaderData: Awaited<ReturnType<typeof clientLoader>> }) {
  const { customers, orders } = loaderData
  const mutation = useMutation()

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = formDataToObject(form) as Parameters<typeof customersApi.create>[0]
    mutation.run(() => customersApi.create(data), '客户新增成功', form)
  }

  function handleRemove(id: number) {
    if (!window.confirm('确认删除该客户吗？')) return
    mutation.run(() => customersApi.remove(id), '客户删除成功')
  }

  return (
    <>
      <PageHeader
        eyebrow="Customer CRM"
        title="客户信息管理"
        description="维护客户基础档案、紧急联系人、旅游偏好，并快速查看客户报名记录。"
      />

      <Card>
        <SectionTitle title="新增客户" description="录入客户身份、联系方式与出游偏好" />
        <FormGrid onSubmit={handleCreate}>
          <TextInput name="name" placeholder="姓名" required />
          <TextInput name="id_card" placeholder="身份证号" required />
          <TextInput name="phone" placeholder="电话" />
          <TextInput name="emergency_contact" placeholder="紧急联系人" />
          <TextInput name="travel_preference" placeholder="旅游偏好" className="xl:col-span-3" />
          <Button className="h-9" disabled={mutation.busy}>
            新增客户
          </Button>
        </FormGrid>
        <StatusMessage message={mutation.message} error={mutation.error} />
        <DataTable headers={['编号', '姓名', '身份证号', '电话', '紧急联系人', '旅游偏好', '操作']}>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <Td className="font-medium text-foreground">#{customer.id}</Td>
              <Td className="font-semibold text-foreground">{customer.name}</Td>
              <Td>{customer.id_card}</Td>
              <Td>{customer.phone}</Td>
              <Td>{customer.emergency_contact}</Td>
              <Td>
                <Badge tone="blue">{customer.travel_preference}</Badge>
              </Td>
              <Td>
                <Button type="button" variant="destructive" size="sm" onClick={() => handleRemove(customer.id)} disabled={mutation.busy}>
                  <Trash2 className="size-3.5" />
                  删除
                </Button>
              </Td>
            </TableRow>
          ))}
        </DataTable>
      </Card>

      <Card className="mt-5">
        <SectionTitle title="客户报名记录" description="跟踪客户出游线路、付款状态与余款" />
        <DataTable headers={['客户', '线路', '出发日期', '人数', '订单状态', '实收', '余款']}>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <Td className="font-medium text-foreground">{order.customer_name}</Td>
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
              <Td>¥{order.amount_paid.toLocaleString()}</Td>
              <Td>¥{order.balance.toLocaleString()}</Td>
            </TableRow>
          ))}
        </DataTable>
      </Card>
    </>
  )
}
