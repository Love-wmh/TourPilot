import { Trash2 } from 'lucide-react'

import { Badge, Card, DataTable, FormGrid, PageHeader, SectionTitle, TextInput } from '~/components/page'
import { Button } from '~/components/ui/button'
import { customers, orders } from '~/data'

export function meta() {
  return [{ title: '客户信息管理' }]
}

export default function CustomersPage() {
  return (
    <>
      <PageHeader eyebrow="Customer CRM" title="客户信息管理" description="维护客户基础档案、紧急联系人、旅游偏好，并快速查看客户报名记录。" />

      <Card>
        <SectionTitle title="新增客户" description="录入客户身份、联系方式与出游偏好" />
        <FormGrid>
          <TextInput name="name" placeholder="姓名" required />
          <TextInput name="id_card" placeholder="身份证号" required />
          <TextInput name="phone" placeholder="电话" />
          <TextInput name="emergency_contact" placeholder="紧急联系人" />
          <TextInput name="travel_preference" placeholder="旅游偏好" className="xl:col-span-3" />
          <Button type="button" className="h-11 rounded-2xl">新增客户</Button>
        </FormGrid>
        <DataTable headers={['编号', '姓名', '身份证号', '电话', '紧急联系人', '旅游偏好', '操作']}>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td className="px-4 py-3 font-medium">#{customer.id}</td>
              <td className="px-4 py-3 font-semibold text-slate-900">{customer.name}</td>
              <td className="px-4 py-3">{customer.id_card}</td>
              <td className="px-4 py-3">{customer.phone}</td>
              <td className="px-4 py-3">{customer.emergency_contact}</td>
              <td className="px-4 py-3"><Badge tone="blue">{customer.travel_preference}</Badge></td>
              <td className="px-4 py-3"><Button type="button" variant="destructive" size="sm"><Trash2 className="size-3.5" />删除</Button></td>
            </tr>
          ))}
        </DataTable>
      </Card>

      <Card className="mt-6">
        <SectionTitle title="客户报名记录" description="跟踪客户出游线路、付款状态与余款" />
        <DataTable headers={['客户', '线路', '出发日期', '人数', '订单状态', '实收', '余款']}>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-4 py-3 font-medium">{order.customer_name}</td>
              <td className="px-4 py-3">{order.destination}</td>
              <td className="px-4 py-3">{order.departure_date}</td>
              <td className="px-4 py-3">{order.people_count}</td>
              <td className="px-4 py-3"><Badge tone={order.order_status === '已取消' ? 'red' : order.order_status === '已支付' ? 'green' : 'amber'}>{order.order_status}</Badge></td>
              <td className="px-4 py-3">¥{order.amount_paid.toLocaleString()}</td>
              <td className="px-4 py-3">¥{order.balance.toLocaleString()}</td>
            </tr>
          ))}
        </DataTable>
      </Card>
    </>
  )
}
