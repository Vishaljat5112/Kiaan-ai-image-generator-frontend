import { useState, useEffect } from 'react'

/**
 * Hook to detect active responsive Tailwind breakpoint
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState({
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
    width: window.innerWidth,
  })

  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth
      setBreakpoint({
        isMobile: w < 768,
        isTablet: w >= 768 && w < 1024,
        isDesktop: w >= 1024,
        width: w,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return breakpoint
}

