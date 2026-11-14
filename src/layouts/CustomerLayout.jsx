import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Sparkles,
  Video,
  Image as ImageIcon,
  Edit3,
  Film,
  Clock,
  FolderKanban,
  Download,
  Coins,
  CreditCard,
  Settings,
  HelpCircle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  Plus,
  LogOut
} from 'lucide-react'
import { Logo } from '../components/common/Logo'
import { ProfileMenu } from '../components/navigation/ProfileMenu'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { cn } from '../utils/cn'

export function CustomerLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const customerNavGroups = [
    {
      group: 'Creation Studio',
      items: [
        { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
        { label: 'AI Image Generator', to: '/dashboard/image-generator', icon: Sparkles, badge: 'FLUX.2' },
        { label: 'AI Video Generator', to: '/dashboard/video-generator', icon: Video, badge: 'Wan 2.1' },
        { label: 'Image-to-Image', to: '/dashboard/image-to-image', icon: ImageIcon },
        { label: 'Image-to-Video', to: '/dashboard/image-to-video', icon: Film },
        { label: 'Image Editor', to: '/dashboard/image-editor', icon: Edit3 },
      ]
    },
    {
      group: 'Asset Management',
      items: [
        { label: 'My Generations', to: '/dashboard/generations', icon: Clock },
        { label: 'My Projects', to: '/dashboard/projects', icon: FolderKanban },
        { label: 'Downloads', to: '/dashboard/downloads', icon: Download },
      ]
    },
    {
      group: 'Account & Billing',
      items: [
        { label: 'Credits & Usage', to: '/dashboard/credits', icon: Coins },
        { label: 'Subscription', to: '/dashboard/subscription', icon: CreditCard },
        { label: 'Profile & Settings', to: '/dashboard/settings', icon: Settings },
        { label: 'Help & Support', to: '/dashboard/support', icon: HelpCircle },
      ]
    }
  ]

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex bg-[#06080F] text-neutral-100">
      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-neutral-800/90 bg-[#0A0E17]/95 backdrop-blur-md transition-all duration-300',
          sidebarCollapsed ? 'w-20' : 'w-64',
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-800/90 shrink-0">
          {!sidebarCollapsed ? (
            <Logo to="/dashboard" badgeText="Studio" />
          ) : (
            <div className="mx-auto">
              <Logo to="/dashboard" showWordmark={false} size="sm" />
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 transition-colors cursor-pointer"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {customerNavGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!sidebarCollapsed && (
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
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
                        ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.12)]'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60',
                      sidebarCollapsed && 'justify-center px-2'
                    )}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className={cn('w-4 h-4 shrink-0 transition-colors', active ? 'text-cyan-400' : 'text-neutral-400 group-hover:text-neutral-200')} />
                    {!sidebarCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {!sidebarCollapsed && item.badge && (
                      <Badge variant={active ? 'primary' : 'default'} size="sm">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Bottom Section (Account & Logout) */}
        <div className="p-3 border-t border-neutral-800/90 shrink-0 space-y-2">
          {/* Quick link to Admin Portal for review */}
          <Link
            to="/admin"
            className={cn(
              'flex items-center gap-2 p-2 rounded-lg text-xs text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 transition-colors',
              sidebarCollapsed && 'justify-center'
            )}
            title="Switch to Admin Portal"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            {!sidebarCollapsed && <span>Admin Portal Switch</span>}
          </Link>

          {/* Sidebar Logout Button */}
          <button
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center gap-2 p-2 rounded-lg text-xs text-rose-400/90 hover:text-rose-300 hover:bg-rose-950/20 transition-colors font-medium cursor-pointer',
              sidebarCollapsed && 'justify-center'
            )}
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {!sidebarCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 transition-all duration-300',
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 border-b border-neutral-800/80 bg-[#06080F]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs text-neutral-400 hidden sm:block">
              <span className="text-neutral-500">Kiaan AI Studio /</span>{' '}
              <span className="text-neutral-200 font-medium capitalize">
                {location.pathname.replace('/dashboard', '').replace('/', '') || 'Overview'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/dashboard/credits" className="hidden sm:flex">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D111C] border border-neutral-800 text-xs hover:border-cyan-500/40 transition-colors">
                <Coins className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-neutral-400">Balance:</span>
                <span className="text-white font-semibold">{user?.creditBalance ?? 0} cr</span>
              </div>
            </Link>

            {/* Profile Menu with functional dropdown & logout */}
            <ProfileMenu variant="customer" />
          </div>
        </header>

        {/* Customer Main View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default CustomerLayout
