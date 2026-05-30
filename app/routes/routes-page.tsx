import { Trash2 } from 'lucide-react'

import { Badge, Card, DataTable, FormGrid, PageHeader, SectionTitle, SelectInput, TextInput } from '~/components/page'
import { Button } from '~/components/ui/button'
import { groups, routes } from '~/data'

export function meta() {
  return [{ title: '旅游线路管理' }]
}

export default function RoutesPage() {
  return (
    <>
      <PageHeader eyebrow="Travel Products" title="旅游线路管理" description="配置目的地、行程天数、景点、价格与启停状态，支撑后续团队排期。" />

      <Card>
        <SectionTitle title="新增线路" description="维护可售旅游产品信息" />
        <FormGrid>
          <TextInput name="destination" placeholder="目的地" required />
          <TextInput name="days" type="number" min={1} placeholder="天数" required />
          <TextInput name="attractions" placeholder="景点" />
          <TextInput name="adult_price" type="number" min={0} step="0.01" placeholder="成人价" required />
          <TextInput name="child_price" type="number" min={0} step="0.01" placeholder="儿童价" required />
          <SelectInput name="status"><option>启用</option><option>停用</option></SelectInput>
          <Button type="button" className="h-11 rounded-2xl xl:col-span-2">新增线路</Button>
        </FormGrid>
        <DataTable headers={['编号', '目的地', '天数', '景点', '成人价', '儿童价', '状态', '操作']}>
          {routes.map((route) => (
            <tr key={route.id}>
              <td className="px-4 py-3 font-medium">#{route.id}</td>
              <td className="px-4 py-3 font-semibold text-slate-900">{route.destination}</td>
              <td className="px-4 py-3">{route.days} 天</td>
              <td className="px-4 py-3">{route.attractions}</td>
              <td className="px-4 py-3">¥{route.adult_price.toLocaleString()}</td>
              <td className="px-4 py-3">¥{route.child_price.toLocaleString()}</td>
              <td className="px-4 py-3"><Badge tone={route.status === '启用' ? 'green' : 'slate'}>{route.status}</Badge></td>
              <td className="px-4 py-3"><Button type="button" variant="destructive" size="sm"><Trash2 className="size-3.5" />删除</Button></td>
            </tr>
          ))}
        </DataTable>
      </Card>

      <Card className="mt-6">
        <SectionTitle title="线路出团记录" description="查看线路对应的团队、导游与人数状态" />
        <DataTable headers={['线路', '出发日期', '返回日期', '导游', '人数', '状态']}>
          {groups.map((group) => (
            <tr key={group.id}>
              <td className="px-4 py-3 font-medium">{group.destination}</td>
              <td className="px-4 py-3">{group.departure_date}</td>
              <td className="px-4 py-3">{group.return_date}</td>
              <td className="px-4 py-3">{group.guide_name || '未安排'}</td>
              <td className="px-4 py-3">{group.total_people}</td>
              <td className="px-4 py-3"><Badge tone={group.status === '已成团' ? 'green' : 'amber'}>{group.status}</Badge></td>
            </tr>
          ))}
        </DataTable>
      </Card>
    </>
  )
}
