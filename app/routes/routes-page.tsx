import { Trash2 } from 'lucide-react'

import {
  Badge,
  Card,
  DataTable,
  FormGrid,
  PageHeader,
  SectionTitle,
  SelectInput,
  TableRow,
  Td,
  TextInput,
} from '~/components/page'
import { Button } from '~/components/ui/button'
import { loadRoutesData } from '~/lib/data-loader'

export function meta() {
  return [{ title: '旅游线路管理' }]
}

export async function clientLoader() {
  return loadRoutesData()
}

export default function RoutesPage({ loaderData }: { loaderData: Awaited<ReturnType<typeof clientLoader>> }) {
  const { routes, groups } = loaderData

  return (
    <>
      <PageHeader
        eyebrow="Travel Products"
        title="旅游线路管理"
        description="配置目的地、行程天数、景点、价格与启停状态，支撑后续团队排期。"
      />

      <Card>
        <SectionTitle title="新增线路" description="维护可售旅游产品信息" />
        <FormGrid>
          <TextInput name="destination" placeholder="目的地" required />
          <TextInput name="days" type="number" min={1} placeholder="天数" required />
          <TextInput name="attractions" placeholder="景点" />
          <TextInput
            name="adult_price"
            type="number"
            min={0}
            step="0.01"
            placeholder="成人价"
            required
          />
          <TextInput
            name="child_price"
            type="number"
            min={0}
            step="0.01"
            placeholder="儿童价"
            required
          />
          <SelectInput name="status">
            <option>启用</option>
            <option>停用</option>
          </SelectInput>
          <Button type="button" className="h-9 xl:col-span-2">
            新增线路
          </Button>
        </FormGrid>
        <DataTable headers={['编号', '目的地', '天数', '景点', '成人价', '儿童价', '状态', '操作']}>
          {routes.map((route) => (
            <TableRow key={route.id}>
              <Td className="font-medium text-foreground">#{route.id}</Td>
              <Td className="font-semibold text-foreground">{route.destination}</Td>
              <Td>{route.days} 天</Td>
              <Td>{route.attractions}</Td>
              <Td>¥{route.adult_price.toLocaleString()}</Td>
              <Td>¥{route.child_price.toLocaleString()}</Td>
              <Td>
                <Badge tone={route.status === '启用' ? 'green' : 'slate'}>{route.status}</Badge>
              </Td>
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
        <SectionTitle title="线路出团记录" description="查看线路对应的团队、导游与人数状态" />
        <DataTable headers={['线路', '出发日期', '返回日期', '导游', '人数', '状态']}>
          {groups.map((group) => (
            <TableRow key={group.id}>
              <Td className="font-medium text-foreground">{group.destination}</Td>
              <Td>{group.departure_date}</Td>
              <Td>{group.return_date}</Td>
              <Td>{group.guide_name || '未安排'}</Td>
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
