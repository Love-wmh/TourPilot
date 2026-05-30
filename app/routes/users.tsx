import { Trash2 } from 'lucide-react'

import { Badge, Card, DataTable, FormGrid, PageHeader, SectionTitle, SelectInput, TextInput } from '~/components/page'
import { Button } from '~/components/ui/button'
import { currentUser, roleSummary, users } from '~/data'

export function meta() {
  return [{ title: '用户与角色管理' }]
}

export default function UsersPage() {
  return (
    <>
      <PageHeader eyebrow="Access Control" title="用户与角色管理" description="维护系统账号和角色分工，让不同岗位只看到需要处理的业务模块。" />

      <Card>
        <SectionTitle title="新增用户" description="创建账号并分配业务角色" />
        <FormGrid>
          <TextInput name="username" placeholder="用户名" required />
          <TextInput name="password" placeholder="密码" required />
          <SelectInput name="role" required><option>管理员</option><option>销售</option><option>计调</option><option>财务</option><option>导游</option></SelectInput>
          <Button type="button" className="h-11 rounded-2xl">新增用户</Button>
        </FormGrid>
        <DataTable headers={['编号', '用户名', '角色', '操作']}>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-3 font-medium">#{user.id}</td>
              <td className="px-4 py-3 font-semibold text-slate-900">{user.username}</td>
              <td className="px-4 py-3"><Badge tone={user.role === '管理员' ? 'red' : 'blue'}>{user.role}</Badge></td>
              <td className="px-4 py-3">{currentUser.id !== user.id ? <Button type="button" variant="destructive" size="sm"><Trash2 className="size-3.5" />删除</Button> : <Badge tone="green">当前登录用户</Badge>}</td>
            </tr>
          ))}
        </DataTable>
      </Card>

      <Card className="mt-6">
        <SectionTitle title="角色账号统计" description="不同角色的账号数量和主要职责" />
        <DataTable headers={['角色', '账号数量', '主要职责']}>
          {roleSummary.map((item) => (
            <tr key={item.role}>
              <td className="px-4 py-3 font-medium">{item.role}</td>
              <td className="px-4 py-3">{item.user_count}</td>
              <td className="px-4 py-3">{item.duty}</td>
            </tr>
          ))}
        </DataTable>
      </Card>
    </>
  )
}
