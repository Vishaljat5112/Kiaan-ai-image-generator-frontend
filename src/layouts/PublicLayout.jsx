import React, { useState, useRef, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react'
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
    <div className="min-h-screen flex flex-col bg-[#06080F] text-white selection:bg-pink-500/30 selection:text-pink-200">
      {/* Main Responsive Sticky Navbar (Screenshot 1 & Mega Menu Architecture) */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-800/80 bg-[#06080F]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Logo to="/" theme="dark" size="md" showBadge={false} />

          {/* Desktop Navigation Triggers with Mega Menu Hover/Click */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {navCategories.map((cat) => {
              const isOpen = activeMenu === cat.id
              return (
                <div key={cat.id} className="relative py-1">
                  <button
                    type="button"
                    onClick={() => setActiveMenu(isOpen ? null : cat.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-semibold transition-all inline-flex items-center gap-1.5 focus:outline-none cursor-pointer select-none',
                      isOpen
                        ? 'text-white font-bold bg-neutral-900 border border-cyan-500/60 shadow-lg shadow-cyan-500/20'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                    )}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                  >
                    <span>{cat.label}</span>
                    <ChevronDown
                      className={cn(
                        'w-3.5 h-3.5 text-neutral-400 transition-transform duration-200',
                        isOpen && 'rotate-180 text-cyan-400'
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
                  className="px-3.5 py-1.5 rounded-full text-sm font-semibold bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 transition-colors"
                >
                  Open Studio
                </Link>
                <ProfileMenu variant="customer" theme="dark" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  state={{ background: location }}
                  className="px-3 py-1.5 text-sm font-semibold text-neutral-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  state={{ background: location }}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25 hover:from-pink-600 hover:to-rose-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Try it free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            {user && <ProfileMenu variant="customer" theme="dark" />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Mega Menu Dropdown Panel */}
        <DesktopMegaMenu
          theme="dark"
          activeMenu={activeMenu}
          onClose={handleCloseMenu}
        />

        {/* Mobile Navigation Drawer with Accordion Mega Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-neutral-800 bg-[#0B0F19] px-4 pt-3 pb-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto text-white">
            {/* Mobile Accordion */}
            <MobileMegaMenuAccordion onItemClick={() => setMobileMenuOpen(false)} />

            {/* Studio & Auth Action Controls */}
            <div className="pt-3 border-t border-neutral-800 flex flex-col gap-2.5">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white transition-colors"
              >
                Customer Studio
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-semibold border border-neutral-700 hover:bg-neutral-800 text-neutral-300 transition-colors"
              >
                Admin Portal
              </Link>
              {!user && (
                <>
                  <Link
                    to="/login"
                    state={{ background: location }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    state={{ background: location }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25 transition-all"
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
          className="fixed inset-0 top-16 z-40 bg-neutral-950/5 backdrop-blur-[1px] transition-opacity"
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
