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
import { guidesApi } from '~/lib/api'
import { formDataToObject, numberValue, useMutation } from '~/lib/actions'
import { loadGuidesData } from '~/lib/data-loader'

export function meta() {
  return [{ title: '导游管理' }]
}

export async function clientLoader() {
  return loadGuidesData()
}

export default function GuidesPage({ loaderData }: { loaderData: Awaited<ReturnType<typeof clientLoader>> }) {
  const { guides, groups: guideGroups } = loaderData
  const mutation = useMutation()

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const values = formDataToObject(form)
    const data = {
      name: String(values.name || ''),
      phone: String(values.phone || ''),
      experience_years: numberValue(values.experience_years),
      description: String(values.description || ''),
    }
    mutation.run(() => guidesApi.create(data), '导游新增成功', form)
  }

  function handleRemove(id: number) {
    if (!window.confirm('确认删除该导游吗？')) return
    mutation.run(() => guidesApi.remove(id), '导游删除成功')
  }

  return (
    <>
      <PageHeader
        eyebrow="Guide Resources"
        title="导游管理"
        description="统一维护导游资料、经验说明和带团明细，方便计调排团。"
      />

      <Card>
        <SectionTitle title="新增导游" description="录入导游联系方式与带团经验" />
        <FormGrid onSubmit={handleCreate}>
          <TextInput name="name" placeholder="姓名" required />
          <TextInput name="phone" placeholder="电话" />
          <TextInput
            name="experience_years"
            type="number"
            min={0}
            placeholder="带团经验/年"
            defaultValue={0}
          />
          <TextInput name="description" placeholder="说明" />
          <Button className="h-9 xl:col-span-4" disabled={mutation.busy}>
            新增导游
          </Button>
        </FormGrid>
        <StatusMessage message={mutation.message} error={mutation.error} />
        <DataTable headers={['编号', '姓名', '电话', '带团经验', '所带团队数', '说明', '操作']}>
          {guides.map((guide) => (
            <TableRow key={guide.id}>
              <Td className="font-medium text-foreground">#{guide.id}</Td>
              <Td className="font-semibold text-foreground">{guide.name}</Td>
              <Td>{guide.phone}</Td>
              <Td>{guide.experience_years} 年</Td>
              <Td>
                <Badge tone="blue">{guide.group_count}</Badge>
              </Td>
              <Td>{guide.description}</Td>
              <Td>
                <Button type="button" variant="destructive" size="sm" onClick={() => handleRemove(guide.id)} disabled={mutation.busy}>
                  <Trash2 className="size-3.5" />
                  删除
                </Button>
              </Td>
            </TableRow>
          ))}
        </DataTable>
      </Card>

      <Card className="mt-5">
        <SectionTitle title="导游带团明细" description="展示导游当前和未来排团" />
        <DataTable headers={['导游', '线路', '出发日期', '返回日期', '团队人数', '团队状态']}>
          {guideGroups.map((group) => (
            <TableRow key={group.id}>
              <Td className="font-medium text-foreground">{group.guide_name}</Td>
              <Td>{group.destination}</Td>
              <Td>{group.departure_date}</Td>
              <Td>{group.return_date}</Td>
              <Td>{group.total_people}</Td>
              <Td>
                <Badge tone={group.status === '已成团' ? 'green' : 'amber'}>{group.status}</Badge>
              </Td>
            </TableRow>
          ))}
        </DataTable>
      </Card>
    </>
  )
}
