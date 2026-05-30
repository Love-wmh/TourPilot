import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate, useNavigation } from 'react-router'
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

import { GlobalLoadingOverlay } from '~/components/global-loading-overlay'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { authApi, type Permission, type User } from '~/lib/api'
import { cn } from '~/lib/utils'

const navigation: Array<{
  label: string
  href: string
  permission: Permission
  icon: React.ComponentType<{ className?: string }>
}> = [
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

export default function AppLayout() {
  const navigate = useNavigate()
  const navigationState = useNavigation()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    authApi.me()
      .then((currentUser) => {
        if (!currentUser) {
          navigate('/login')
          return
        }
        setUser(currentUser)
      })
      .catch(() => navigate('/login'))
  }, [navigate])

  const visibleNavigation = navigation.filter((item) => user?.permissions?.includes(item.permission))
  const isPageLoading = navigationState.state === 'loading'

  async function handleLogout() {
    await authApi.logout()
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-muted/20 text-foreground">
      <GlobalLoadingOverlay show={isPageLoading} />
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 border-r bg-background lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-3 px-5">
          <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Landmark className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">旅团通</p>
            <p className="mt-1 text-xs text-muted-foreground">旅行社团队管理</p>
          </div>
        </div>
        <Separator />

        <nav className="flex-1 space-y-1 p-3">
          {visibleNavigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Separator />
        <div className="p-4">
          <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
            <Avatar>
              <AvatarFallback>{user.username.slice(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.username}</p>
              <p className="truncate text-xs text-muted-foreground">{user.role}</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="退出登录" onClick={handleLogout}>
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-10 border-b bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Landmark className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-none">旅团通</p>
                <p className="mt-1 text-xs text-muted-foreground">旅行社团队管理</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              退出
            </Button>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {visibleNavigation.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-muted-foreground ring-1 ring-border'
                  )
                }
              >
                <item.icon className="size-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-[1180px] px-5 py-6 sm:px-6 lg:px-8 lg:py-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
