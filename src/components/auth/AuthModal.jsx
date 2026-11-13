import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { X, User, Shield, Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles, Key, CheckCircle2 } from 'lucide-react'
import { Logo } from '../common/Logo'
import { Input } from '../ui/Input'
import { AuthImageCarousel } from './AuthImageCarousel'
import { DemoAccess } from './DemoAccess'
import { useAuth } from '../../hooks/useAuth'

export function AuthModal({ initialMode = 'login', initialRole = 'customer', onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { loginAsMockUser } = useAuth()

  // Modal active mode: 'login' | 'signup' | 'forgot-password'
  const [mode, setMode] = useState(initialMode)
  // Active role inside login: 'customer' | 'admin'
  const [role, setRole] = useState(initialRole)

  // Form states
  const [email, setEmail] = useState(role === 'admin' ? 'admin@studio.com' : 'artist@studio.com')
  const [password, setPassword] = useState(role === 'admin' ? 'admin_secure_pass' : 'password123')
  const [securityPin, setSecurityPin] = useState('000000')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  // Signup fields
  const [fullName, setFullName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreedTerms, setAgreedTerms] = useState(false)

  // Validation & feedback
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mockResetToken, setMockResetToken] = useState(null)

  // Focus trap and accessibility refs
  const modalRef = useRef(null)
  const triggerElementRef = useRef(null)

  // Store trigger element and lock body scroll on mount
  useEffect(() => {
    triggerElementRef.current = document.activeElement
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Focus first input or modal container
    const firstInput = modalRef.current?.querySelector('input, button')
    firstInput?.focus()

    return () => {
      document.body.style.overflow = originalOverflow
      triggerElementRef.current?.focus?.()
    }
  }, [])

  // Close modal and return to background location or '/'
  const handleClose = React.useCallback(() => {
    if (onClose) {
      onClose()
    } else {
      const returnTo = location.state?.background?.pathname || '/'
      navigate(returnTo, { replace: true })
    }
  }, [location.state?.background?.pathname, navigate, onClose])

  // Keyboard navigation: Escape key closes modal; Tab traps focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose()
        return
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleClose])

  // Switch modes inside modal without closing or resetting the carousel
  const switchMode = (newMode, newRole = 'customer') => {
    setMode(newMode)
    setErrors({})
    setFeedback(null)
    setMockResetToken(null)

    if (newMode === 'login') {
      setRole(newRole)
      if (newRole === 'admin') {
        setEmail('admin@studio.com')
        setPassword('admin_secure_pass')
      } else {
        setEmail('artist@studio.com')
        setPassword('password123')
      }
      navigate('/login', { replace: true, state: location.state })
    } else if (newMode === 'signup') {
      navigate('/register', { replace: true, state: location.state })
    } else if (newMode === 'forgot-password') {
      navigate('/forgot-password', { replace: true, state: location.state })
    }
  }

  // Switch role inside Login mode
  const handleRoleSwitch = (newRole) => {
    setRole(newRole)
    setErrors({})
    setFeedback(null)
    if (newRole === 'admin') {
      setEmail('admin@studio.com')
      setPassword('admin_secure_pass')
    } else {
      setEmail('artist@studio.com')
      setPassword('password123')
    }
  }

  // Handle Login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (role === 'admin') {
      setFeedback('Authenticating System Administrator...')
      loginAsMockUser('super_admin', { email, fullName: 'System Administrator' })
      setTimeout(() => {
        navigate('/admin')
      }, 200)
    } else {
      setFeedback('Signing in to Creator Studio...')
      loginAsMockUser('creator', { email, fullName: email.split('@')[0] || 'Jane Doe' })
      const redirectUrl = location.state?.redirect || '/dashboard'
      setTimeout(() => {
        navigate(redirectUrl)
      }, 200)
    }
  }

  // Handle Signup submission
  const handleSignupSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (!password || password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.'
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    if (!agreedTerms) {
      newErrors.terms = 'Please accept the Terms to continue.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setFeedback(`Demo session initialized for ${fullName.trim()}. Loading studio...`)

    loginAsMockUser('creator', {
      fullName: fullName.trim(),
      email: email.trim(),
      tier: 'Free Tier',
      creditBalance: 250
    })

    setTimeout(() => {
      navigate('/dashboard')
    }, 300)
  }

  // Quick 1-click Demo Fill for Signup
  const handleQuickDemoFill = () => {
    setFullName('Sarah Connor')
    setEmail('sarah.connor@creative.ai')
    setPassword('neural_art_2026')
    setConfirmPassword('neural_art_2026')
    setAgreedTerms(true)
    setErrors({})
  }

  // Handle Forgot Password submission
  const handleForgotSubmit = (e) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrors({ email: 'Please enter a valid email address.' })
      return
    }

    setErrors({})
    setIsSubmitting(true)

    setTimeout(() => {
      const token = 'rst_' + Math.random().toString(36).substring(2, 9).toUpperCase()
      setMockResetToken(token)
      setIsSubmitting(false)
    }, 250)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Dark Translucent Backdrop Overlay (Allows landing page to stay visible behind) */}
      <div
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Centered Premium Modal Card (Constrained to ~85-90vh, fits 1366x768 without scrolling) */}
      <div
        ref={modalRef}
        className="relative w-full max-w-[980px] bg-white rounded-3xl shadow-2xl shadow-neutral-950/40 border border-neutral-200/90 overflow-hidden flex flex-col md:flex-row max-h-[88vh] animate-in zoom-in-95 fade-in duration-200 z-10"
      >
        {/* LEFT COLUMN: ~45% Cinematic Gallery (Hidden on mobile/tablet) */}
        <div className="hidden md:flex md:w-[45%] bg-neutral-950 relative overflow-hidden select-none">
          <AuthImageCarousel compact={true} />
        </div>

        {/* RIGHT COLUMN: ~55% Compact Authentication Form Area */}
        <div className="w-full md:w-[55%] flex flex-col justify-between p-5 sm:p-6 lg:p-7 overflow-y-auto bg-white">
          {/* Header Row: Logo & Close Button */}
          <div className="flex items-center justify-between pb-3">
            <Logo to="/" theme="light" size="sm" showBadge={false} />

            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-full border border-neutral-200 hover:border-neutral-300 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Content Area */}
          <div className="space-y-4 my-auto">
            {/* Title & Short Subtitle */}
            <div className="space-y-0.5">
              <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-extrabold text-neutral-950 tracking-tight leading-tight">
                {mode === 'login' && (role === 'admin' ? 'Admin Portal Sign In' : 'Welcome to Kiaan Studio')}
                {mode === 'signup' && 'Create Your Account'}
                {mode === 'forgot-password' && 'Reset Password'}
              </h2>
              <p className="text-xs text-neutral-500 leading-normal">
                {mode === 'login' && (role === 'admin' ? 'Authorized access for GPU allocation & model oversight' : 'Sign in to access your creative workstation & projects')}
                {mode === 'signup' && 'Initialize your creative workspace with 250 evaluation credits'}
                {mode === 'forgot-password' && 'Enter your registered email to receive simulated recovery instructions'}
              </p>
            </div>

            {/* Temporary Feedback Banner */}
            {feedback && (
              <div className="p-2.5 rounded-xl bg-violet-50 border border-violet-200 text-xs text-violet-800 flex items-center gap-2 animate-in fade-in duration-150">
                <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            {/* ============================================================== */}
            {/* MODE 1: LOGIN MODE                                             */}
            {/* ============================================================== */}
            {mode === 'login' && (
              <div className="space-y-3.5">
                {/* Segmented Role Switcher: Customer vs Admin */}
                <div className="p-1 rounded-xl bg-neutral-100 border border-neutral-200/80 grid grid-cols-2 gap-1 select-none">
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('customer')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      role === 'customer'
                        ? 'bg-white text-neutral-950 shadow-2xs'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <User className="w-3 h-3 text-violet-600" />
                    <span>User Login</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('admin')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      role === 'admin'
                        ? 'bg-white text-neutral-950 shadow-2xs'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <Shield className="w-3 h-3 text-amber-500" />
                    <span>Admin Login</span>
                  </button>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-2.5" noValidate>
                  <Input
                    label={role === 'admin' ? 'Administrator Email' : 'Email Address'}
                    type="email"
                    theme="light"
                    leftIcon={Mail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === 'admin' ? 'admin@studio.com' : 'artist@studio.com'}
                    required
                  />

                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      theme="light"
                      leftIcon={Lock}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-8 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {role === 'admin' && (
                    <Input
                      label="Hardware Security PIN (Mock)"
                      type="text"
                      theme="light"
                      leftIcon={Key}
                      value={securityPin}
                      onChange={(e) => setSecurityPin(e.target.value)}
                      placeholder="000000"
                      helperText="Default mock evaluation PIN: 000000"
                      required
                    />
                  )}

                  <div className="flex items-center justify-between text-xs text-neutral-600 pt-0.5">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-neutral-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                      />
                      <span>Remember session</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => switchMode('forgot-password')}
                      className="font-semibold text-violet-700 hover:text-violet-800 transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-400 text-white shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <span>
                      {isSubmitting
                        ? 'Signing in...'
                        : role === 'admin'
                          ? 'Sign In to Admin Portal'
                          : 'Sign In to Creator Studio'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Instant 1-Click Demo Access */}
                <DemoAccess compact={true} />

                {/* Switch to Signup */}
                <div className="pt-2 text-center text-xs text-neutral-500">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="font-bold text-violet-700 hover:text-violet-800 transition-colors cursor-pointer"
                  >
                    Sign Up &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* MODE 2: SIGNUP MODE                                            */}
            {/* ============================================================== */}
            {mode === 'signup' && (
              <div className="space-y-3">
                {/* Demo Preview Badge & Auto-fill Action */}
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 font-semibold text-[10px] border border-violet-200/60">
                    <Sparkles className="w-3 h-3" />
                    <span>Demo Preview</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleQuickDemoFill}
                    className="text-violet-700 hover:text-violet-800 font-bold underline text-xs cursor-pointer inline-flex items-center gap-1"
                  >
                    Auto-Fill Demo Info
                  </button>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSignupSubmit} className="space-y-2.5" noValidate>
                  <Input
                    label="Full Name"
                    type="text"
                    theme="light"
                    placeholder="Jane Doe"
                    leftIcon={User}
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value)
                      if (errors.fullName) setErrors({ ...errors, fullName: null })
                    }}
                    error={errors.fullName}
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    theme="light"
                    placeholder="jane@studio.com"
                    leftIcon={Mail}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({ ...errors, email: null })
                    }}
                    error={errors.email}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      label="Password"
                      type="password"
                      theme="light"
                      placeholder="Min 8 chars"
                      leftIcon={Lock}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (errors.password) setErrors({ ...errors, password: null })
                      }}
                      error={errors.password}
                      required
                    />

                    <Input
                      label="Confirm Password"
                      type="password"
                      theme="light"
                      placeholder="Repeat password"
                      leftIcon={Lock}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null })
                      }}
                      error={errors.confirmPassword}
                      required
                    />
                  </div>

                  {/* Terms Checkbox */}
                  <div className="space-y-1">
                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreedTerms}
                        onChange={(e) => {
                          setAgreedTerms(e.target.checked)
                          if (errors.terms) setErrors({ ...errors, terms: null })
                        }}
                        className="w-3.5 h-3.5 mt-0.5 rounded border-neutral-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                      />
                      <span className="text-[11px] text-neutral-600 leading-snug">
                        I agree to the{' '}
                        <Link to="/terms" onClick={handleClose} className="font-semibold text-violet-700 hover:underline">
                          Terms
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" onClick={handleClose} className="font-semibold text-violet-700 hover:underline">
                          Privacy Policy
                        </Link>
                        .
                      </span>
                    </label>
                    {errors.terms && (
                      <p className="text-[10px] text-rose-600 font-medium pl-5">{errors.terms}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-400 text-white shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Creating Studio Account...' : 'Create Studio Account'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Instant 1-Click Demo Access */}
                <DemoAccess compact={true} />

                {/* Switch to Login */}
                <div className="pt-2 text-center text-xs text-neutral-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="font-bold text-violet-700 hover:text-violet-800 transition-colors cursor-pointer"
                  >
                    Sign In &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* MODE 3: FORGOT PASSWORD MODE                                   */}
            {/* ============================================================== */}
            {mode === 'forgot-password' && (
              <div className="space-y-3.5">
                {mockResetToken ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-emerald-950">Instructions Dispatched</h4>
                      <p className="text-xs text-emerald-800">
                        Simulated recovery token generated for <strong className="text-emerald-950">{email}</strong>:
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-emerald-300 text-center font-mono font-bold text-violet-700 text-xs select-all">
                      {mockResetToken}
                    </div>

                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="w-full py-2 px-3 rounded-xl bg-neutral-950 text-white font-semibold text-xs hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-3" noValidate>
                    <Input
                      label="Account Email Address"
                      type="email"
                      theme="light"
                      placeholder="artist@studio.com"
                      leftIcon={Mail}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errors.email) setErrors({})
                      }}
                      error={errors.email}
                      required
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-400 text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{isSubmitting ? 'Dispatching...' : 'Dispatch Reset Link'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}

                {/* Instant 1-Click Demo Access */}
                <DemoAccess compact={true} />

                {/* Back to Login */}
                <div className="pt-2 text-center text-xs text-neutral-500">
                  Remembered your password?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="font-bold text-violet-700 hover:text-violet-800 transition-colors cursor-pointer"
                  >
                    Back to Sign In &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Micro Footer */}
          <div className="pt-4 text-center text-[10px] text-neutral-400 select-none">
            &copy; 2026 Kiaan Studio &bull; Creative Workstation &bull; Evaluation Preview
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
