import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Badge } from '../ui/Badge'
import { cn } from '../../utils/cn'

export function ProfileMenu({ variant = 'customer', theme = 'dark', className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const isLight = theme === 'light'

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleLogout = () => {
    setIsOpen(false)
    logout()
    navigate('/login')
  }

  // If user is logged out, show clean login link
  if (!user) {
    return (
      <Link
        to="/login"
        className={cn(
          'text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors',
          isLight
            ? 'text-neutral-800 hover:text-neutral-950 border-neutral-200 bg-neutral-50 hover:bg-neutral-100'
            : 'text-neutral-300 hover:text-white border-neutral-800 bg-neutral-900 hover:bg-neutral-850'
        )}
      >
        Sign In
      </Link>
    )
  }

  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  const profilePath = variant === 'admin' ? '/admin/settings' : '/dashboard/settings'
  const settingsPath = variant === 'admin' ? '/admin/settings' : '/dashboard/settings'

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={cn(
          'flex items-center gap-2 p-1.5 rounded-xl border border-transparent transition-all text-left focus:outline-none focus:ring-2 focus:ring-violet-500',
          isLight
            ? 'hover:bg-neutral-100 hover:border-neutral-200'
            : 'hover:bg-neutral-900 hover:border-neutral-800'
        )}
      >
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm',
            variant === 'admin'
              ? 'bg-gradient-to-tr from-amber-600 to-rose-600'
              : 'bg-gradient-to-tr from-violet-600 to-cyan-500'
          )}
        >
          {initials}
        </div>

        <div className="hidden md:block leading-tight text-left pr-1">
          <div
            className={cn(
              'text-xs font-semibold truncate max-w-[110px]',
              isLight ? 'text-neutral-900' : 'text-neutral-200'
            )}
          >
            {user.fullName}
          </div>
          <div
            className={cn(
              'text-[10px] capitalize',
              isLight ? 'text-neutral-500' : 'text-neutral-400'
            )}
          >
            {user.role === 'super_admin' ? 'Super Admin' : 'Creator Studio'}
          </div>
        </div>

        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 transition-transform duration-200 hidden sm:block',
            isLight ? 'text-neutral-500' : 'text-neutral-400',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={cn(
            'absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100',
            isLight
              ? 'bg-white border border-neutral-200 text-neutral-700 shadow-neutral-300/50'
              : 'bg-neutral-900/95 backdrop-blur-md border border-neutral-800 text-neutral-300 shadow-black/80'
          )}
        >
          {/* User Header */}
          <div
            className={cn(
              'px-4 py-3 border-b',
              isLight ? 'border-neutral-100' : 'border-neutral-800/80'
            )}
          >
            <div
              className={cn(
                'font-semibold truncate text-sm',
                isLight ? 'text-neutral-950' : 'text-white'
              )}
            >
              {user.fullName}
            </div>
            <div
              className={cn(
                'truncate text-[11px] mt-0.5',
                isLight ? 'text-neutral-500' : 'text-neutral-400'
              )}
            >
              {user.email}
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <Badge variant={variant === 'admin' ? 'warning' : 'primary'} size="sm">
                {variant === 'admin' ? 'Administrator' : 'Creator'}
              </Badge>
              {user.credits !== undefined && (
                <span
                  className={cn(
                    'text-[10px] font-mono px-1.5 py-0.5 rounded',
                    isLight
                      ? 'bg-neutral-100 text-neutral-600'
                      : 'bg-neutral-800 text-neutral-300'
                  )}
                >
                  {user.credits.toLocaleString()} credits
                </span>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="py-1">
            <Link
              to={profilePath}
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center gap-2.5 px-4 py-2 transition-colors',
                isLight
                  ? 'hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950'
                  : 'hover:bg-neutral-800/80 text-neutral-300 hover:text-white'
              )}
            >
              <User className="w-4 h-4 text-neutral-400" />
              <span>Profile &amp; Account</span>
            </Link>

            <Link
              to={settingsPath}
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center gap-2.5 px-4 py-2 transition-colors',
                isLight
                  ? 'hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950'
                  : 'hover:bg-neutral-800/80 text-neutral-300 hover:text-white'
              )}
            >
              <Settings className="w-4 h-4 text-neutral-400" />
              <span>Workspace Preferences</span>
            </Link>
          </div>

          {/* Sign Out Action */}
          <div
            className={cn(
              'pt-1 mt-1 border-t',
              isLight ? 'border-neutral-100' : 'border-neutral-800/80'
            )}
          >
            <button
              onClick={handleLogout}
              className={cn(
                'w-full flex items-center gap-2.5 px-4 py-2 text-rose-500 transition-colors text-left',
                isLight
                  ? 'hover:bg-rose-50 hover:text-rose-600'
                  : 'hover:bg-rose-950/40 hover:text-rose-400'
              )}
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu
