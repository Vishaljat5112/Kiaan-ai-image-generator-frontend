import React from 'react'

export function AuthForm({
  onSubmit,
  children,
  submitText = 'Continue',
  submitIcon: SubmitIcon,
  submitting = false,
  error = null,
  className = ''
}) {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className}`} noValidate>
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 animate-in fade-in duration-150">
          {error}
        </div>
      )}

      {children}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-400 text-white shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        <span>{submitting ? 'Authenticating...' : submitText}</span>
        {SubmitIcon && <SubmitIcon className="w-4 h-4" />}
      </button>
    </form>
  )
}

export default AuthForm

