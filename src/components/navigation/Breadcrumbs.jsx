import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export function Breadcrumbs({ className = '' }) {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  return (
    <nav className={`flex items-center space-x-1.5 text-xs text-neutral-400 ${className}`} aria-label="Breadcrumb">
      <Link to="/" className="hover:text-neutral-200 transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        const formattedName = name
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
            {isLast ? (
              <span className="font-medium text-neutral-200">{formattedName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-neutral-200 transition-colors">
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

