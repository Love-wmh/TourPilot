import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight, Compass, LockKeyhole, UserRound } from 'lucide-react'

import { GlobalLoadingOverlay } from '~/components/global-loading-overlay'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { authApi } from '~/lib/api'
import { formDataToObject } from '~/lib/actions'

export function meta() {
  return [{ title: '登录 - 旅行社团队管理系统' }]
}

export default function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const data = formDataToObject(event.currentTarget) as { username: string; password: string }
      await authApi.login(data)
      await navigate('/')
    } catch (error) {
      setError(error instanceof Error ? error.message : '登录失败')
      setBusy(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <GlobalLoadingOverlay show={busy} />
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border bg-card shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-between border-b bg-muted/40 p-8 lg:border-b-0 lg:border-r lg:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium">
              <Compass className="size-4" />
              旅团通运营平台
            </div>
            <h1 className="mt-8 max-w-xl text-4xl font-semibold tracking-tight text-foreground">
              旅行社团队管理系统
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
              销售、计调、财务与导游多角色协同，统一处理客户、线路、团队、报名、费用与报表。
            </p>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {['多角色权限', '团队排期', '利润报表'].map((item) => (
              <div
                key={item}
                className="rounded-md border bg-background p-3.5 text-sm font-medium text-muted-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <Card className="border-0 shadow-none ring-0">
          <CardHeader className="p-8 pb-2 lg:p-10 lg:pb-2">
            <CardTitle className="text-2xl">登录系统</CardTitle>
            <CardDescription>使用演示账号进入管理后台</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4 lg:p-10 lg:pt-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block space-y-2">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <UserRound className="size-4" />
                  用户名
                </span>
                <Input name="username" required placeholder="admin" className="h-10" />
              </label>
              <label className="block space-y-2">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <LockKeyhole className="size-4" />
                  密码
                </span>
                <Input
                  name="password"
                  type="password"
                  required
                  placeholder="123456"
                  className="h-10"
                />
              </label>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button className="h-10 w-full" size="lg" disabled={busy}>
                {busy ? '登录中...' : '登录系统'}
                <ArrowRight className="size-4" />
              </Button>
            </form>
            <div className="mt-5 rounded-md border bg-muted/50 p-4 text-sm leading-6 text-muted-foreground">
              可用账号：admin / sales / planner / finance / guide01，密码均为 123456
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
