import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Coins,
  Sparkles,
  Video,
  Cpu,
  Server,
  Layers,
  DollarSign,
  BarChart3,
  AlertOctagon,
  LifeBuoy,
  ShieldCheck,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  LogOut
} from 'lucide-react'
import { Logo } from '../components/common/Logo'
import { ProfileMenu } from '../components/navigation/ProfileMenu'
import { Badge } from '../components/ui/Badge'
import { useAuth } from '../hooks/useAuth'
import { cn } from '../utils/cn'

export function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const adminNavGroups = [
    {
      group: 'Core Administration',
      items: [
        { label: 'Overview', to: '/admin', icon: LayoutDashboard },
        { label: 'Users', to: '/admin/users', icon: Users },
        { label: 'Security & Audit Logs', to: '/admin/audit-logs', icon: ShieldCheck },
      ]
    },
    {
      group: 'Generative AI Fleet',
      items: [
        { label: 'Image Generations', to: '/admin/image-jobs', icon: Sparkles },
        { label: 'Video Generations', to: '/admin/video-jobs', icon: Video },
        { label: 'AI Models', to: '/admin/models', icon: Cpu },
        { label: 'GPU Monitoring', to: '/admin/gpu', icon: Server },
        { label: 'Job Queue', to: '/admin/queue', icon: Layers },
        { label: 'Failed Jobs', to: '/admin/failed-jobs', icon: AlertOctagon },
      ]
    },
    {
      group: 'Commercial & Finance',
      items: [
        { label: 'Subscription Plans', to: '/admin/plans', icon: CreditCard },
        { label: 'Credit Management', to: '/admin/credits', icon: Coins },
        { label: 'Payments & Revenue', to: '/admin/revenue', icon: DollarSign },
        { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
      ]
    },
    {
      group: 'System & Support',
      items: [
        { label: 'Support Requests', to: '/admin/support', icon: LifeBuoy },
        { label: 'Settings', to: '/admin/settings', icon: Settings },
      ]
    }
  ]

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex bg-[#06080F] text-white selection:bg-pink-500/30 selection:text-pink-200 relative overflow-x-hidden">
      {/* Background Ambient Glows (Landing Page signature theme) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[150px]" />
        <div className="absolute top-2/3 left-10 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-neutral-800/80 bg-[#0B0F19]/95 backdrop-blur-md transition-all duration-300',
          sidebarCollapsed ? 'w-20' : 'w-64',
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-800/80 shrink-0">
          {!sidebarCollapsed ? (
            <Logo to="/admin" theme="dark" badgeText="Admin" />
          ) : (
            <div className="mx-auto">
              <Logo to="/admin" theme="dark" showWordmark={false} size="sm" />
            </div>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Status Indicator (Clean, non-misleading) */}
        <div className="px-4 py-2 bg-[#0D111C]/60 border-b border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-xs shadow-cyan-400/50 shrink-0" />
            {!sidebarCollapsed && <span className="text-neutral-300 font-medium">System Ready</span>}
          </div>
          {!sidebarCollapsed && <span className="text-neutral-500 font-mono text-[10px]">v1.0-alpha</span>}
        </div>

        {/* Admin Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {adminNavGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!sidebarCollapsed && (
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  {group.group}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon
                const active = isActive(item.to)
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group select-none',
                      active
                        ? 'bg-gradient-to-r from-pink-500/20 via-pink-500/10 to-transparent text-white border border-pink-500/40 shadow-sm shadow-pink-500/15'
                        : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50 border border-transparent',
                      sidebarCollapsed && 'justify-center px-2'
                    )}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className={cn('w-4 h-4 shrink-0 transition-colors', active ? 'text-pink-400' : 'text-neutral-400 group-hover:text-cyan-400')} />
                    {!sidebarCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                    {!sidebarCollapsed && item.badge && (
                      <span className={cn(
                        'text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border',
                        active
                          ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white border-pink-400/40 shadow-xs'
                          : 'bg-neutral-800 text-neutral-400 border-neutral-700/60'
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer: Return to Customer Studio & Logout */}
        <div className="p-3 border-t border-neutral-800/80 shrink-0 space-y-1">
          <Link
            to="/dashboard"
            className={cn(
              'flex items-center gap-2 p-2 rounded-lg text-xs text-neutral-400 hover:text-cyan-300 hover:bg-neutral-800/50 transition-colors',
              sidebarCollapsed && 'justify-center'
            )}
            title="Return to Customer Studio"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            {!sidebarCollapsed && <span>Return to Customer Studio</span>}
          </Link>

          <button
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center gap-2 p-2 rounded-lg text-xs text-rose-400/90 hover:text-rose-300 hover:bg-rose-950/20 transition-colors font-medium',
              sidebarCollapsed && 'justify-center'
            )}
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {!sidebarCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={cn(
          'relative z-10 flex-1 flex flex-col min-w-0 transition-all duration-300',
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 border-b border-neutral-800/80 bg-[#06080F]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/60"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs text-neutral-400 hidden sm:block">
              <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-300 bg-clip-text text-transparent font-semibold uppercase tracking-wider">
                Kiaan Admin /
              </span>{' '}
              <span className="text-neutral-200 font-medium capitalize">
                {location.pathname.replace('/admin', '').replace('/', '') || 'Overview'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ProfileMenu variant="admin" theme="dark" />
          </div>
        </header>

        {/* Admin Main View */}
        <main className="relative z-10 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
