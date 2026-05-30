import { Trash2 } from 'lucide-react'

import { Badge, Card, DataTable, FormGrid, PageHeader, SectionTitle, TextInput } from '~/components/page'
import { Button } from '~/components/ui/button'
import { groups, guides } from '~/data'

export function meta() {
  return [{ title: '导游管理' }]
}

export default function GuidesPage() {
  const guideGroups = groups.filter((group) => group.guide_name)

  return (
    <>
      <PageHeader eyebrow="Guide Resources" title="导游管理" description="统一维护导游资料、经验说明和带团明细，方便计调排团。" />

      <Card>
        <SectionTitle title="新增导游" description="录入导游联系方式与带团经验" />
        <FormGrid>
          <TextInput name="name" placeholder="姓名" required />
          <TextInput name="phone" placeholder="电话" />
          <TextInput name="experience_years" type="number" min={0} placeholder="带团经验/年" defaultValue={0} />
          <TextInput name="description" placeholder="说明" />
          <Button type="button" className="h-11 rounded-2xl xl:col-span-4">新增导游</Button>
        </FormGrid>
        <DataTable headers={['编号', '姓名', '电话', '带团经验', '所带团队数', '说明', '操作']}>
          {guides.map((guide) => (
            <tr key={guide.id}>
              <td className="px-4 py-3 font-medium">#{guide.id}</td>
              <td className="px-4 py-3 font-semibold text-slate-900">{guide.name}</td>
              <td className="px-4 py-3">{guide.phone}</td>
              <td className="px-4 py-3">{guide.experience_years} 年</td>
              <td className="px-4 py-3"><Badge tone="blue">{guide.group_count}</Badge></td>
              <td className="px-4 py-3">{guide.description}</td>
              <td className="px-4 py-3"><Button type="button" variant="destructive" size="sm"><Trash2 className="size-3.5" />删除</Button></td>
            </tr>
          ))}
        </DataTable>
      </Card>

      <Card className="mt-6">
        <SectionTitle title="导游带团明细" description="展示导游当前和未来排团" />
        <DataTable headers={['导游', '线路', '出发日期', '返回日期', '团队人数', '团队状态']}>
          {guideGroups.map((group) => (
            <tr key={group.id}>
              <td className="px-4 py-3 font-medium">{group.guide_name}</td>
              <td className="px-4 py-3">{group.destination}</td>
              <td className="px-4 py-3">{group.departure_date}</td>
              <td className="px-4 py-3">{group.return_date}</td>
              <td className="px-4 py-3">{group.total_people}</td>
              <td className="px-4 py-3"><Badge tone={group.status === '已成团' ? 'green' : 'amber'}>{group.status}</Badge></td>
            </tr>
          ))}
        </DataTable>
      </Card>
    </>
  )
}
