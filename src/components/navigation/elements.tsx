import React from 'react'

export const NavigationContainer = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div className="flex flex-col gap-2">{children}</div>
)

export const NavButtonRow = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div className="flex items-center justify-center gap-3">{children}</div>
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
  const baseClasses = 'flex items-center justify-center gap-1.5 rounded-full transition-all duration-200 font-medium'
  const variantClasses =
    variant === 'random'
      ? 'w-12 h-12 bg-gold-dim border border-gold/20 text-gold hover:bg-gold hover:text-background hover:border-gold hover:scale-105'
      : 'w-24 h-10 border border-coal text-muted hover:border-gold/40 hover:text-cream'
  const disabledClasses = disabled ? 'opacity-20 pointer-events-none' : ''

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
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-red-800/50 bg-red-950 px-5 py-3 text-sm text-red-300 shadow-xl"
      role="alert"
    >
      <div className="flex items-center gap-3">
        <span>{children}</span>
        <button aria-label="Close" className="font-bold text-red-400 hover:text-red-200" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  )
}
