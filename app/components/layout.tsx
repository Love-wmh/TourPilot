import { NavLink, Outlet } from 'react-router'
import {
  BarChart3,
  Bus,
  CreditCard,
  Home,
  Landmark,
  LogOut,
  Map,
  ShieldCheck,
  TicketsPlane,
  UserRound,
  UsersRound,
} from 'lucide-react'

import { Button } from '~/components/ui/button'
import { canAccess, currentUser, type Permission } from '~/data'
import { cn } from '~/lib/utils'

const navigation: Array<{ label: string; href: string; permission: Permission; icon: React.ComponentType<{ className?: string }> }> = [
  { label: '首页', href: '/', permission: 'index', icon: Home },
  { label: '客户', href: '/customers', permission: 'customers', icon: UsersRound },
  { label: '线路', href: '/routes', permission: 'routes', icon: Map },
  { label: '导游', href: '/guides', permission: 'guides', icon: UserRound },
  { label: '团队', href: '/groups', permission: 'groups', icon: Bus },
  { label: '订单', href: '/orders', permission: 'orders', icon: TicketsPlane },
  { label: '费用', href: '/expenses', permission: 'expenses', icon: CreditCard },
  { label: '报表', href: '/reports', permission: 'reports', icon: BarChart3 },
  { label: '用户', href: '/users', permission: 'users', icon: ShieldCheck },
]

export function AppLayout() {
  const visibleNavigation = navigation.filter((item) => canAccess(item.permission))

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_32%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_45%,#f8fafc_100%)] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-white/70 bg-white/80 px-5 py-6 shadow-2xl shadow-slate-200/60 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="flex items-center gap-3 rounded-3xl bg-slate-950 p-4 text-white shadow-xl shadow-slate-300/60">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-white/15">
            <Landmark className="size-6" />
          </div>
          <div>
            <p className="text-sm text-white/60">ClassTrack</p>
            <h1 className="text-lg font-semibold tracking-tight">旅行社团队管理</h1>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {visibleNavigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-slate-950 text-white shadow-lg shadow-slate-300/60'
                    : 'text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-sm',
                )
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">当前用户</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900">{currentUser.username}</p>
              <p className="text-sm text-slate-500">{currentUser.role}</p>
            </div>
            <Button variant="outline" size="icon" asChild>
              <a href="/login" aria-label="退出登录">
                <LogOut className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-white/70 bg-white/75 px-4 py-4 shadow-sm backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">ClassTrack</p>
              <h1 className="font-semibold">旅行社团队管理</h1>
            </div>
            <Button variant="outline" asChild>
              <a href="/login">退出</a>
            </Button>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {visibleNavigation.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium',
                    isActive ? 'bg-slate-950 text-white' : 'bg-white text-slate-600',
                  )
                }
              >
                <item.icon className="size-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
