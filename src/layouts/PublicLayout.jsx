import React, { useState, useRef, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight, Sparkles, ChevronDown } from 'lucide-react'
import { Logo } from '../components/common/Logo'
import { ProfileMenu } from '../components/navigation/ProfileMenu'
import { PremiumFooter } from '../components/landing/PremiumFooter'
import { DesktopMegaMenu, MobileMegaMenuAccordion } from '../components/navigation/NavbarMegaMenu'
import { useAuth } from '../hooks/useAuth'
import { cn } from '../utils/cn'

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const timeoutRef = useRef(null)
  const location = useLocation()
  const { user } = useAuth()

  // 5 Public Mega Menu Categories
  const navCategories = [
    { id: 'ai-image', label: 'AI Image' },
    { id: 'ai-video', label: 'AI Video' },
    { id: 'ai-editor', label: 'AI Editor' },
    { id: 'explore', label: 'Explore' },
    { id: 'pricing', label: 'Pricing' }
  ]

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Close menus on route location change
  const [prevLocationKey, setPrevLocationKey] = useState(location.key)
  if (location.key !== prevLocationKey) {
    setPrevLocationKey(location.key)
    setActiveMenu(null)
    setMobileMenuOpen(false)
  }

  // Desktop Hover Bridge Handlers
  const handleTriggerEnter = (menuId) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveMenu(menuId)
  }

  const handleTriggerLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
    }, 180)
  }

  const handlePanelEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  const handlePanelLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
    }, 180)
  }

  const handleCloseMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveMenu(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-violet-100 selection:text-violet-900">
      {/* Platform Preview Developer Bar */}
      <div className="bg-neutral-50 border-b border-neutral-200/80 px-4 py-1.5 text-center text-xs text-neutral-600 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-violet-600 shrink-0" />
        <span>
          <strong>Kiaan Studio Preview:</strong> Explore the workstation via{' '}
          <Link to="/dashboard" className="text-violet-700 underline hover:text-violet-800 font-semibold">Customer Studio</Link> or{' '}
          <Link to="/admin" className="text-neutral-900 underline hover:text-neutral-700 font-semibold">Admin Portal</Link>.
        </span>
      </div>

      {/* Main Responsive Sticky Navbar (Screenshot 1 & Mega Menu Architecture) */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-100 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Logo to="/" theme="light" size="md" showBadge={false} />

          {/* Desktop Navigation Triggers with Mega Menu Hover/Click */}
          <nav
            className="hidden md:flex items-center gap-1 lg:gap-1.5"
            onMouseLeave={handleTriggerLeave}
          >
            {navCategories.map((cat) => {
              const isOpen = activeMenu === cat.id
              return (
                <div
                  key={cat.id}
                  className="relative py-2"
                  onMouseEnter={() => handleTriggerEnter(cat.id)}
                >
                  <button
                    type="button"
                    onClick={() => setActiveMenu(isOpen ? null : cat.id)}
                    className={cn(
                      'px-3.5 py-2 rounded-full text-sm font-semibold transition-all inline-flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer select-none',
                      isOpen
                        ? 'text-neutral-950 font-bold bg-neutral-100/90 shadow-2xs'
                        : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
                    )}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                  >
                    <span>{cat.label}</span>
                    <ChevronDown
                      className={cn(
                        'w-3.5 h-3.5 text-neutral-400 transition-transform duration-200',
                        isOpen && 'rotate-180 text-violet-600'
                      )}
                    />
                  </button>
                </div>
              )
            })}
          </nav>

          {/* Header Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-900 transition-colors"
                >
                  Open Studio
                </Link>
                <ProfileMenu variant="customer" theme="light" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  state={{ background: location }}
                  className="px-3.5 py-2 text-sm font-semibold text-neutral-700 hover:text-neutral-950 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  state={{ background: location }}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold bg-neutral-950 text-white hover:bg-neutral-800 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Try it free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            {user && <ProfileMenu variant="customer" theme="light" />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Mega Menu Dropdown Panel */}
        <DesktopMegaMenu
          activeMenu={activeMenu}
          onClose={handleCloseMenu}
          onMouseEnter={handlePanelEnter}
          onMouseLeave={handlePanelLeave}
        />

        {/* Mobile Navigation Drawer with Accordion Mega Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
            {/* Mobile Accordion */}
            <MobileMegaMenuAccordion onItemClick={() => setMobileMenuOpen(false)} />

            {/* Studio & Auth Action Controls */}
            <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2.5">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-900 transition-colors"
              >
                Customer Studio
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-semibold border border-neutral-300 hover:bg-neutral-50 text-neutral-800 transition-colors"
              >
                Admin Portal
              </Link>
              {!user && (
                <>
                  <Link
                    to="/login"
                    state={{ background: location }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl text-sm font-medium text-neutral-800 hover:bg-neutral-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    state={{ background: location }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold bg-neutral-950 text-white hover:bg-neutral-800 shadow-md transition-all"
                  >
                    <span>Try it free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Outside Click Backdrop Overlay (Dismisses Mega Menu when clicking outside) */}
      {activeMenu && (
        <div
          className="fixed inset-0 top-20 z-40 bg-neutral-950/5 backdrop-blur-[1px] transition-opacity"
          onClick={handleCloseMenu}
          aria-hidden="true"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>

      {/* Premium Dark Multi-Column Mega Footer (Screenshot 9) */}
      <PremiumFooter />
    </div>
  )
}

export default PublicLayout
