import React from 'react'
import { Link } from 'react-router-dom'
import { X, Sparkles } from 'lucide-react'
import { Logo } from '../common/Logo'
import { AuthImageCarousel } from './AuthImageCarousel'

const CURRENT_YEAR = 2026

/**
 * Higgsfield-Inspired Split-Screen Authentication Layout (Light Theme)
 *
 * Left Panel (~48% Desktop Width):
 *   - Full-height cinematic image carousel with 4 rotating creative visual themes.
 *   - Auto-advance (5s) with manual progress bar selectors and creative title overlays.
 *   - Hidden on mobile/tablet to ensure clean single-column focus.
 *
 * Right Panel (~52% Desktop Width):
 *   - Crisp, light-themed authentication forms (white/off-white background, deep black typography).
 *   - Top exit 'X' button linking back to home (/).
 *   - Centered form area with soft borders and subtle violet accents.
 */
export function AuthLayout({
  children,
  title,
  subtitle,
  badgeText = 'Creator Workstation',
  showLogo = true
}) {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row overflow-x-hidden selection:bg-violet-100 selection:text-violet-900">
      {/* LEFT PANEL (~48% Desktop Width) — Full-Height Cinematic Image Presentation */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[46%] p-3.5 lg:p-4.5 sticky top-0 self-start h-screen items-center justify-center bg-neutral-950">
        <AuthImageCarousel />
      </div>

      {/* RIGHT PANEL (~52% Desktop Width) — Polished Light Theme Form Area */}
      <div className="w-full lg:w-[52%] xl:w-[54%] min-h-screen flex flex-col justify-between px-5 sm:px-10 lg:px-12 xl:px-16 py-6 sm:py-8 relative overflow-y-auto">
        {/* Top Header Row: Brand Logo + Quick Exit 'X' Button */}
        <div className="w-full max-w-lg mx-auto flex items-center justify-between pb-6 pt-1">
          {showLogo ? (
            <Logo to="/" theme="light" size="md" showBadge={false} />
          ) : (
            <div />
          )}

          <Link
            to="/"
            className="w-9 h-9 rounded-full border border-neutral-200 hover:border-neutral-300 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer"
            title="Return to Home"
            aria-label="Return to Home"
          >
            <X className="w-4 h-4" />
          </Link>
        </div>

        {/* Main Center Content Container */}
        <div className="w-full max-w-lg mx-auto space-y-6 my-auto py-4">
          {/* Section Header */}
          {(title || subtitle) && (
            <div className="space-y-2">
              {badgeText && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200/70 text-xs font-semibold text-violet-700">
                  <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                  <span>{badgeText}</span>
                </div>
              )}
              {title && (
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight leading-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Form and Action Controls */}
          {children}
        </div>

        {/* Bottom Platform Disclaimer */}
        <div className="w-full max-w-lg mx-auto pt-6 pb-2 text-center text-xs text-neutral-400">
          <p>&copy; {CURRENT_YEAR} Kiaan Studio &bull; Create Beyond Imagination.</p>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
