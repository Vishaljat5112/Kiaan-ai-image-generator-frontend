import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  Edit3,
  Film,
  Coins,
  ArrowRight,
  FolderKanban,
  Zap
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../services/api'

export function DashboardOverviewPage() {
  const { user } = useAuth()
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchOverview() {
      try {
        const res = await api.get('/customer/dashboard/overview')
        if (isMounted && res.data?.success) {
          setOverview(res.data.data)
        }
      } catch (err) {
        // Handled gracefully, default values applied
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchOverview()
    return () => { isMounted = false }
  }, [])

  const creditBalance = overview?.stats?.creditBalance ?? user?.creditBalance ?? 0
  const totalProjects = overview?.stats?.totalProjects ?? 0

  const quickActions = [
    {
      title: 'Text-to-Image',
      desc: 'Synthesize 1024×1024 visuals with FLUX.2 Klein flow matching',
      icon: Sparkles,
      to: '/dashboard/image-generator',
      color: 'text-indigo-400',
      bg: 'bg-indigo-950/80',
      border: 'border-indigo-800/60',
      badge: 'FLUX.2'
    },
    {
      title: 'Text-to-Video',
      desc: 'Cinematic 5s video sequences with Wan 2.1 3D DiT',
      icon: Video,
      to: '/dashboard/video-generator',
      color: 'text-violet-400',
      bg: 'bg-violet-950/80',
      border: 'border-violet-800/60',
      badge: 'Wan 2.1'
    },
    {
      title: 'Image-to-Image',
      desc: 'Remix, transform, and restyle reference imagery',
      icon: ImageIcon,
      to: '/dashboard/image-to-image',
      color: 'text-cyan-400',
      bg: 'bg-cyan-950/80',
      border: 'border-cyan-800/60',
      badge: 'Multimodal'
    },
    {
      title: 'Image-to-Video',
      desc: 'Animate still photographs with fluid temporal dynamics',
      icon: Film,
      to: '/dashboard/image-to-video',
      color: 'text-amber-400',
      bg: 'bg-amber-950/80',
      border: 'border-amber-800/60',
      badge: 'Animation'
    },
    {
      title: 'Inpainting Canvas',
      desc: 'Context-aware visual fills and brush mask replacement',
      icon: Edit3,
      to: '/dashboard/image-editor',
      color: 'text-pink-400',
      bg: 'bg-pink-950/80',
      border: 'border-pink-800/60',
      badge: 'Canvas'
    },
    {
      title: 'My Projects',
      desc: `${totalProjects} active workspace${totalProjects === 1 ? '' : 's'} organized`,
      icon: FolderKanban,
      to: '/dashboard/projects',
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/80',
      border: 'border-emerald-800/60',
      badge: 'Library'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-7">
      {/* Welcome Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-indigo-950/20 to-neutral-900 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 shadow-sm">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Kiaan AI Studio</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
            Welcome back, {overview?.user?.fullName || user?.fullName || 'Creator'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Create Beyond Imagination. • {overview?.user?.tier || user?.tier || 'Creator Tier'}
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 bg-neutral-950/80 border border-neutral-800/80 p-3 sm:p-3.5 rounded-xl shrink-0 w-full sm:w-auto justify-between sm:justify-start">
          <div className="w-9 h-9 rounded-lg bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-cyan-400 shrink-0">
            <Coins className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400">Available Credits</div>
            <div className="text-base sm:text-lg font-bold text-white leading-tight">{creditBalance} Credits</div>
          </div>
          <Link to="/dashboard/credits">
            <Button variant="primary" size="sm">
              Add Credits
            </Button>
          </Link>
        </div>
      </div>

      {/* Creation Tools */}
      <div className="space-y-3 sm:space-y-3.5">
        <h2 className="text-sm sm:text-base font-semibold text-neutral-100 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Generative Creation Studio</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4.5">
          {quickActions.map((action, idx) => {
            const Icon = action.icon
            return (
              <Card
                key={idx}
                hover
                className="h-full flex flex-col justify-between border-neutral-800/80 bg-neutral-900/40 hover:bg-neutral-900/70 hover:border-neutral-700/80 transition-all"
              >
                <CardHeader className="p-4 sm:p-5 pb-2">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className={`w-9 h-9 rounded-lg ${action.bg} ${action.border} border flex items-center justify-center ${action.color} shrink-0`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 px-2 py-0.5 rounded bg-neutral-800/90 border border-neutral-700/40">
                      {action.badge}
                    </span>
                  </div>
                  <CardTitle className="text-sm sm:text-base font-semibold text-neutral-100">{action.title}</CardTitle>
                  <CardDescription className="text-xs text-neutral-400 min-h-[2.25rem] line-clamp-2 mt-1">{action.desc}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 pt-0 mt-auto">
                  <Link to={action.to} className="block w-full">
                    <Button variant="secondary" size="sm" className="w-full justify-between" rightIcon={ArrowRight}>
                      Launch Tool
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DashboardOverviewPage
