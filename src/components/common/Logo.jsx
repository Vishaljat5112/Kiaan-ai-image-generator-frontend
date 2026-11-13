import React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

/**
 * Geometric 'K' Symbol for Kiaan Studio.
 * Crafted with violet-to-cyan gradient and clean angular facets.
 */
export function KiaanIcon({ size = 'md', theme = 'dark', className = '' }) {
  const pixelSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  }

  const isLight = theme === 'light'

  return (
    <div
      className={cn(
        'relative shrink-0 flex items-center justify-center rounded-xl p-1.5 overflow-hidden group transition-transform duration-200 group-hover:scale-105',
        isLight
          ? 'bg-neutral-950 border border-neutral-800 shadow-sm shadow-violet-500/10'
          : 'bg-neutral-900 border border-neutral-800 shadow-sm shadow-indigo-950/40',
        pixelSizes[size],
        className
      )}
    >
      {/* Background glow accent */}
      <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/30 via-indigo-500/20 to-cyan-400/20 opacity-90" />

      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
      >
        <defs>
          <linearGradient id="kiaan-stem" x1="6" y1="4" x2="12" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="kiaan-upper" x1="12" y1="16" x2="26" y2="5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id="kiaan-lower" x1="13" y1="14" x2="27" y2="27" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* Vertical Stem of 'K' */}
        <rect x="6" y="5" width="5.5" height="22" rx="2.75" fill="url(#kiaan-stem)" />

        {/* Upper Wing */}
        <path
          d="M13.5 16.5L22.8 6.2C23.5 5.4 24.8 5.6 25.4 6.5C25.9 7.3 25.7 8.4 24.9 9.1L16.2 18.2L13.5 16.5Z"
          fill="url(#kiaan-upper)"
        />

        {/* Lower Wing */}
        <path
          d="M14 15.5L24.5 25.5C25.3 26.3 25.2 27.5 24.4 28.2C23.6 28.8 22.4 28.6 21.7 27.8L12.5 18L14 15.5Z"
          fill="url(#kiaan-lower)"
        />

        {/* Neural Sparkle Core */}
        <circle cx="14" cy="16.5" r="1.5" fill="#ffffff" />
      </svg>
    </div>
  )
}

/**
 * Official Kiaan Studio Logo
 * Includes wordmark and optional badge.
 */
export function Logo({
  to = '/',
  size = 'md',
  theme = 'dark',
  showWordmark = true,
  showBadge = false,
  badgeText = 'Studio',
  className = ''
}) {
  const textSizes = {
    sm: 'text-sm gap-2',
    md: 'text-lg gap-2.5',
    lg: 'text-xl gap-3'
  }

  const isLight = theme === 'light'

  const content = (
    <div
      className={cn(
        'inline-flex items-center font-bold tracking-tight select-none group',
        isLight ? 'text-neutral-900' : 'text-neutral-100',
        textSizes[size],
        className
      )}
    >
      <KiaanIcon size={size} theme={theme} />

      {showWordmark && (
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={cn(
              'font-extrabold tracking-tight transition-colors',
              isLight
                ? 'text-neutral-950 group-hover:text-violet-700'
                : 'bg-gradient-to-r from-white via-neutral-100 to-neutral-300 bg-clip-text text-transparent group-hover:from-white group-hover:to-cyan-200'
            )}
          >
            Kiaan
          </span>
          <span
            className={cn(
              'font-semibold tracking-tight',
              isLight ? 'text-neutral-800' : 'text-neutral-300 font-light'
            )}
          >
            Studio
          </span>

          {showBadge && (
            <span
              className={cn(
                'text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-md ml-1',
                isLight
                  ? 'bg-violet-100 text-violet-800 border border-violet-200'
                  : 'bg-indigo-950/80 text-cyan-300 border border-indigo-800/60'
              )}
            >
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (to) {
    return (
      <Link to={to} className="hover:opacity-95 transition-opacity">
        {content}
      </Link>
    )
  }

  return content
}

export default Logo
