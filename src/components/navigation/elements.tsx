import React from 'react'

export const NavigationContainer = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div className="flex flex-col gap-12">{children}</div>
)

export const NavButtonRow = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div className="flex items-center justify-center">
    <div className="inline-flex divide-x divide-coal overflow-hidden rounded-md border border-coal">{children}</div>
  </div>
)

export const NavIconButton = ({
  'aria-label': ariaLabel,
  children,
  disabled,
  onClick,
  variant,
}: {
  'aria-label': string
  children: React.ReactNode
  disabled?: boolean
  onClick: () => void
  variant?: 'random'
}): React.ReactNode => {
  const baseClasses = 'flex items-center justify-center gap-1.5 h-10 font-medium transition-colors duration-200'

  const variantClasses =
    variant === 'random'
      ? 'px-5 text-gold bg-gold-dim hover:bg-gold/[0.15] font-semibold text-sm'
      : 'px-5 text-sm text-muted hover:bg-card hover:text-cream'

  const disabledClasses = disabled ? 'opacity-25 pointer-events-none' : ''

  return (
    <button
      aria-disabled={disabled}
      aria-label={ariaLabel}
      className={`${baseClasses} ${variantClasses} ${disabledClasses}`}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
  )
}

export const ErrorToast = ({
  children,
  onClose,
  open,
}: {
  children: React.ReactNode
  onClose: () => void
  open: boolean
}): React.ReactNode => {
  React.useEffect(() => {
    if (!open) return
    const timer = setTimeout(onClose, 15_000)
    return () => clearTimeout(timer)
  }, [onClose, open])

  if (!open) return null

  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-red-900/50 bg-red-950/90 px-5 py-3 text-sm text-red-300 shadow-[0_8px_40px_rgba(0,0,0,0.55)] backdrop-blur-md"
      role="alert"
    >
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="h-1.5 w-1.5 flex-shrink-0 rounded-sm bg-red-500" />
        <span>{children}</span>
        <button
          aria-label="Close"
          className="ml-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-xs text-red-400 transition-colors hover:bg-red-900/50 hover:text-red-200"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  )
}
