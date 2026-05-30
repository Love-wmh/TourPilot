import { RefreshCw, Trash2, TriangleAlert } from 'lucide-react'

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
import { groups, guides, routes } from '~/data'

export function meta() {
  return [{ title: '团队管理' }]
}

export default function GroupsPage() {
  const statusSummary = Array.from(new Set(groups.map((group) => group.status))).map((status) => ({
    status,
    group_count: groups.filter((group) => group.status === status).length,
    people_count: groups
      .filter((group) => group.status === status)
      .reduce((total, group) => total + group.total_people, 0),
  }))

  return (
    <>
      <PageHeader
        eyebrow="Tour Group Ops"
        title="团队管理"
        description="管理线路团队、导游安排、成团人数与异常取消处理。"
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {statusSummary.map((item, index) => (
          <StatCard
            key={item.status}
            label={`${item.status}团队`}
            value={`${item.group_count} / ${item.people_count}人`}
            tone={index === 0 ? 'emerald' : index === 1 ? 'amber' : 'violet'}
          />
        ))}
      </div>

      <Card>
        <SectionTitle title="新增团队" description="选择线路、导游和出行日期" />
        <FormGrid>
          <SelectInput name="route_id" required>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.destination}
              </option>
            ))}
          </SelectInput>
          <SelectInput name="guide_id">
            <option value="">暂不指定导游</option>
            {guides.map((guide) => (
              <option key={guide.id} value={guide.id}>
                {guide.name}
              </option>
            ))}
          </SelectInput>
          <TextInput name="departure_date" type="date" required />
          <TextInput name="return_date" type="date" required />
          <TextInput
            name="total_people"
            type="number"
            min={0}
            placeholder="总人数"
            defaultValue={0}
          />
          <TextInput
            name="min_people"
            type="number"
            min={1}
            placeholder="最低成团人数"
            defaultValue={10}
          />
          <SelectInput name="status">
            <option>待成团</option>
            <option>已成团</option>
            <option>已取消</option>
            <option>已结束</option>
          </SelectInput>
          <Button type="button" className="h-9">
            新增团队
          </Button>
        </FormGrid>
        <DataTable
          headers={[
            '编号',
            '线路',
            '导游',
            '出发',
            '返回',
            '人数',
            '最低',
            '状态',
            '异常提示',
            '操作',
          ]}
        >
          {groups.map((group) => {
            const insufficient = group.total_people < group.min_people
            return (
              <TableRow key={group.id}>
                <Td className="font-medium text-foreground">#{group.id}</Td>
                <Td className="font-semibold text-foreground">{group.destination}</Td>
                <Td>{group.guide_name || '未安排'}</Td>
                <Td>{group.departure_date}</Td>
                <Td>{group.return_date}</Td>
                <Td>{group.total_people}</Td>
                <Td>{group.min_people}</Td>
                <Td>
                  <Badge tone={group.status === '已成团' ? 'green' : 'amber'}>{group.status}</Badge>
                </Td>
                <Td>
                  {insufficient ? (
                    <Badge tone="red">
                      <TriangleAlert className="mr-1 size-3" />
                      成团人数不足
                    </Badge>
                  ) : (
                    <Badge tone="green">正常</Badge>
                  )}
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm">
                      <RefreshCw className="size-3.5" />
                      更换导游
                    </Button>
                    {insufficient && group.status !== '已取消' && (
                      <Button type="button" variant="outline" size="sm">
                        人数不足取消
                      </Button>
                    )}
                    <Button type="button" variant="destructive" size="sm">
                      <Trash2 className="size-3.5" />
                      删除
                    </Button>
                  </div>
                </Td>
              </TableRow>
            )
          })}
        </DataTable>
      </Card>

      <Card className="mt-5">
        <SectionTitle title="导游排团看板" description="快速查看导游、线路和未来排期" />
        <DataTable headers={['导游', '线路', '出发', '返回', '人数', '状态']}>
          {groups.map((group) => (
            <TableRow key={group.id}>
              <Td className="font-medium text-foreground">{group.guide_name || '未安排'}</Td>
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
