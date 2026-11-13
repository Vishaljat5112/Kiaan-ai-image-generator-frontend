import React from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Home, LayoutDashboard } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center p-8">
        <div className="w-14 h-14 rounded-2xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-cyan-400 mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">404</h1>
        <h2 className="text-lg font-semibold text-neutral-200 mt-1">Page Not Found</h2>
        <p className="text-sm text-neutral-400 mt-2 mb-6">
          The view or route you requested in Kiaan AI Studio does not exist or has moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="secondary" size="sm" className="w-full" leftIcon={Home}>
              Return Home
            </Button>
          </Link>
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button variant="primary" size="sm" className="w-full" leftIcon={LayoutDashboard}>
              Open Studio
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default NotFoundPage
