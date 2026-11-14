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
  Zap,
  Clock,
  Layers,
  Heart
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { MediaThumb } from '../../components/studio/StudioUI'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../services/api'
import { formatDate } from '../../utils/format'

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
  const totalGenerations = overview?.stats?.totalGenerations ?? 0
  const recentGenerations = overview?.recentGenerations || []

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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-indigo-950/20 to-neutral-900 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Kiaan AI Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome back, {overview?.user?.fullName || user?.fullName || 'Creator'}
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Create Beyond Imagination. • {overview?.user?.tier || user?.tier || 'Creator Tier'}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-neutral-950/80 border border-neutral-800/80 p-3 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-cyan-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-neutral-400">Available Credits</div>
            <div className="text-lg font-bold text-white leading-tight">{creditBalance} Credits</div>
          </div>
          <Link to="/dashboard/credits">
            <Button variant="primary" size="sm">
              Add Credits
            </Button>
          </Link>
        </div>
      </div>

      {/* Creation Tools */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Generative Creation Studio</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickActions.map((action, idx) => {
            const Icon = action.icon
            return (
              <Card key={idx} hover className="flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${action.bg} ${action.border} border flex items-center justify-center ${action.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 px-2 py-0.5 rounded bg-neutral-800">
                      {action.badge}
                    </span>
                  </div>
                  <CardTitle>{action.title}</CardTitle>
                  <CardDescription>{action.desc}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link to={action.to} className="block mt-2">
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

      {/* Recent Generations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-400" />
            <span>Recent Generations</span>
          </h2>
          {recentGenerations.length > 0 && (
            <Link to="/dashboard/generations" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium">
              View All ({totalGenerations}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {recentGenerations.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/30 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center text-neutral-400 mb-3">
              <Sparkles className="w-6 h-6 text-neutral-300" />
            </div>
            <h3 className="text-base font-semibold text-neutral-200">No generations yet</h3>
            <p className="text-xs text-neutral-400 max-w-sm mt-1 mb-5">
              When you generate images or videos using the studio tools above, your visual outputs will appear here.
            </p>
            <Link to="/dashboard/image-generator">
              <Button variant="primary" size="sm" rightIcon={ArrowRight}>
                Generate an Image
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentGenerations.map((g) => (
              <Link
                key={g.id}
                to="/dashboard/generations"
                className="group relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 aspect-square block hover:border-cyan-500/50 transition-all shadow-sm"
              >
                <img
                  src={g.src}
                  alt={g.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                  <p className="text-xs font-semibold text-white truncate">{g.title}</p>
                  <p className="text-[10px] text-neutral-400 truncate">{g.model}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardOverviewPage
