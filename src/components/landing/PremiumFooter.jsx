import React from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../common/Logo'

const CURRENT_YEAR = 2026

export function PremiumFooter() {
  const footerGroups = [
    {
      title: 'Product',
      links: [
        { label: 'AI Image Generator', to: '/dashboard/image-generator' },
        { label: 'AI Video Generator', to: '/dashboard/video-generator' },
        { label: 'AI Image Editor', to: '/dashboard/image-editor' },
        { label: 'Platform Features', to: '/features' },
        { label: 'Subscription Plans', to: '/pricing' }
      ]
    },
    {
      title: 'Platform',
      links: [
        { label: 'Creator Studio', to: '/dashboard' },
        { label: 'Admin Portal', to: '/admin' },
        { label: 'Sign In', to: '/login' },
        { label: 'Create Account', to: '/register' },
        { label: 'Help & Support', to: '/dashboard/support' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '/about' },
        { label: 'Contact Team', to: '/contact' },
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Terms of Service', to: '/terms' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Model Specifications', to: '/features' },
        { label: 'Commercial Open Weights', to: '/features' },
        { label: 'Project Roadmap', to: '/about' },
        { label: 'Asset Attribution', to: '/terms' }
      ]
    }
  ]

  return (
    <footer className="relative bg-[#06080F] text-neutral-300 pt-16 sm:pt-20 pb-12 overflow-hidden border-t border-neutral-900">
      {/* Subtle Purple Glow Gradient near bottom */}
      <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-pink-950/20 via-cyan-950/10 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top: Brand Info + Multi-Column Links Grid (Screenshot 9) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Brand Presentation */}
          <div className="lg:col-span-2 space-y-4">
            <Logo to="/" theme="dark" size="md" showBadge={false} />
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Create Beyond Imagination. High-performance, self-hosted generative visual AI
              workstation powered by state-of-the-art open-weight models.
            </p>
            <div className="pt-2 text-xs text-neutral-500 font-mono">
              <span>FLUX.2 Klein 4B &bull; Z-Image Turbo &bull; Wan 2.1</span>
            </div>
          </div>

          {/* Link Columns */}
          {footerGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
                {group.title}
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="hover:text-white transition-colors block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Oversized Brand Typography (Screenshot 9) */}
        <div className="pt-10 border-t border-neutral-900/80 overflow-hidden select-none">
          <div className="text-center font-black tracking-tighter text-white/[0.05] hover:text-cyan-400 hover:drop-shadow-[0_0_45px_rgba(6,182,212,0.65)] text-5xl sm:text-7xl md:text-9xl lg:text-[145px] leading-none uppercase transition-all duration-500 cursor-pointer select-none">
            Kiaan Studio
          </div>
        </div>

        {/* Bottom Metadata & Copyright Line */}
        <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>&copy; {CURRENT_YEAR} Kiaan Studio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-neutral-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-neutral-300 transition-colors">Terms</Link>
            <Link to="/dashboard" className="text-cyan-400 hover:text-cyan-300 font-medium">Customer Studio</Link>
            <Link to="/admin" className="text-amber-400 hover:text-amber-300 font-medium">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default PremiumFooter

