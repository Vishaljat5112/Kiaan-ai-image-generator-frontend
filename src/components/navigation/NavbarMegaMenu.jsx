import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { MEGA_MENU_DATA } from './megaMenuData'

/**
 * Desktop Mega Menu Floating Panel
 * Matches ImagineArt's multi-column dropdown architecture with clean white/gray aesthetics.
 */
export function DesktopMegaMenu({
  activeMenu,
  onClose,
  onMouseEnter,
  onMouseLeave
}) {
  const menuData = activeMenu ? MEGA_MENU_DATA[activeMenu] : null
  const panelRef = useRef(null)

  // Escape key closes the dropdown
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (activeMenu) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeMenu, onClose])

  if (!menuData) return null

  const { columns, featured } = menuData
  const hasFeatured = !!featured

  return (
    <div
      ref={panelRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full inset-x-0 pt-2 z-50 pointer-events-auto"
      role="region"
      aria-label={`${menuData.label} navigation menu`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/98 backdrop-blur-xl rounded-[28px] border border-neutral-200/90 shadow-2xl shadow-neutral-950/10 p-6 sm:p-8 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Columns Area (Left side) */}
            <div
              className={`${
                hasFeatured ? 'lg:col-span-8 xl:col-span-8' : 'lg:col-span-12'
              } grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns.length} gap-8`}
            >
              {columns.map((col) => (
                <div key={col.title} className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 select-none">
                    {col.title}
                  </h4>
                  <div className="space-y-1">
                    {col.items.map((item) => (
                      <Link
                        key={item.name}
                        to={item.to}
                        onClick={onClose}
                        className="group block p-2.5 -mx-2 rounded-2xl hover:bg-neutral-50 transition-colors"
                      >
                        <div className="text-sm font-bold text-neutral-900 group-hover:text-violet-700 transition-colors flex items-center justify-between">
                          <span>{item.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-neutral-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Featured Card (Right side, matching ImagineArt screenshot 2) */}
            {hasFeatured && (
              <div className="lg:col-span-4 xl:col-span-4 lg:border-l lg:border-neutral-100 lg:pl-8">
                <div className="rounded-2xl bg-neutral-50/80 border border-neutral-200/70 p-4 flex flex-col justify-between h-full">
                  <div>
                    {featured.image && (
                      <div className="aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-neutral-900 shadow-xs">
                        <img
                          src={featured.image}
                          alt={featured.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-100 text-violet-800">
                        {featured.tag}
                      </span>
                      <h4 className="text-sm font-extrabold text-neutral-950">
                        {featured.title}
                      </h4>
                      <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                        {featured.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Link
                      to={featured.ctaTo}
                      onClick={onClose}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-neutral-950 hover:bg-neutral-800 text-white text-center block transition-colors shadow-xs"
                    >
                      {featured.ctaText}
                    </Link>
                    {featured.linkText && (
                      <Link
                        to={featured.linkTo}
                        onClick={onClose}
                        className="text-xs text-center font-medium text-violet-700 hover:text-violet-800 block transition-colors"
                      >
                        {featured.linkText} &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Mobile Accordion Navigation Menu
 * Handles responsive tap-based expand/collapse with no hover dependency.
 */
export function MobileMegaMenuAccordion({ onItemClick }) {
  const [expandedMenu, setExpandedMenu] = React.useState(null)

  const menuKeys = ['ai-image', 'ai-video', 'ai-editor', 'explore', 'pricing']

  const toggleSection = (key) => {
    setExpandedMenu((prev) => (prev === key ? null : key))
  }

  return (
    <div className="space-y-2 py-2">
      {menuKeys.map((key) => {
        const item = MEGA_MENU_DATA[key]
        const isExpanded = expandedMenu === key

        return (
          <div key={key} className="rounded-2xl border border-neutral-200/80 overflow-hidden bg-neutral-50/50">
            <button
              type="button"
              onClick={() => toggleSection(key)}
              className="w-full flex items-center justify-between p-3.5 text-left text-sm font-bold text-neutral-900 hover:bg-neutral-100/80 transition-colors"
              aria-expanded={isExpanded}
            >
              <span>{item.label}</span>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180 text-violet-600' : ''
                }`}
              />
            </button>

            {isExpanded && (
              <div className="px-3.5 pb-4 pt-1 space-y-4 border-t border-neutral-200/60 bg-white">
                {item.columns.map((col) => (
                  <div key={col.title} className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block px-2">
                      {col.title}
                    </span>
                    <div className="space-y-1">
                      {col.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.to}
                          onClick={onItemClick}
                          className="block px-2.5 py-2 rounded-xl text-xs font-semibold text-neutral-800 hover:bg-neutral-100 hover:text-violet-700 transition-colors"
                        >
                          <div>{subItem.name}</div>
                          <div className="text-[11px] text-neutral-500 font-normal line-clamp-1">
                            {subItem.desc}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                {item.featured && (
                  <div className="pt-2 border-t border-neutral-100">
                    <Link
                      to={item.featured.ctaTo}
                      onClick={onItemClick}
                      className="block p-3 rounded-xl bg-violet-50 text-xs font-bold text-violet-900 border border-violet-100 text-center"
                    >
                      {item.featured.ctaText} &bull; {item.featured.title}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
