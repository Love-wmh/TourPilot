import { ArrowRight, Compass, LockKeyhole, UserRound } from 'lucide-react'

import { Button } from '~/components/ui/button'

export function meta() {
  return [{ title: '登录 - 旅行社团队管理系统' }]
}

export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.28),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.22),transparent_26%),radial-gradient(circle_at_50%_90%,rgba(34,197,94,0.18),transparent_28%)]" />
      <section className="relative w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/10 shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-8 sm:p-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-blue-100">
              <Compass className="size-4" />
              ClassTrack Operation Suite
            </div>
            <h1 className="mt-8 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">旅行社团队管理系统</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">销售、计调、财务与导游多角色协同，统一处理客户、线路、团队、报名、费用与报表。</p>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {['多角色权限', '团队排期', '利润报表'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 text-slate-950 sm:p-8 lg:p-10">
            <div className="rounded-[2rem] bg-slate-50 p-6 shadow-inner">
              <h2 className="text-2xl font-semibold tracking-tight">登录系统</h2>
              <p className="mt-2 text-sm text-slate-500">使用演示账号进入管理后台</p>
              <form className="mt-8 space-y-4" action="/" method="get">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"><UserRound className="size-4" />用户名</span>
                  <input name="username" required placeholder="admin" className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200" />
                </label>
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"><LockKeyhole className="size-4" />密码</span>
                  <input name="password" type="password" required placeholder="123456" className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200" />
                </label>
                <Button className="h-12 w-full rounded-2xl" size="lg">
                  登录系统
                  <ArrowRight className="size-4" />
                </Button>
              </form>
              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
                可用账号：admin / sales / planner / finance / guide01，密码均为 123456
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
