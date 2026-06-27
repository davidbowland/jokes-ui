import React from 'react'

export const AdminAlert = ({
  children,
  severity,
}: {
  children: React.ReactNode
  severity: 'error' | 'warning' | 'info' | 'success'
}): React.ReactNode => {
  const config: Record<string, { border: string; left: string; text: string }> = {
    error: { border: 'border-red-800/50', left: 'bg-red-500', text: 'text-red-300' },
    info: { border: 'border-blue-800/50', left: 'bg-blue-400', text: 'text-blue-300' },
    success: { border: 'border-emerald-800/50', left: 'bg-emerald-400', text: 'text-emerald-300' },
    warning: { border: 'border-amber-800/50', left: 'bg-amber-400', text: 'text-amber-300' },
  }
  const c = config[severity] ?? config.info
  return (
    <div
      className={`mb-4 flex items-start gap-3 rounded-lg border ${c.border} bg-card/60 px-4 py-3 text-sm ${c.text}`}
      role="alert"
    >
      <span className={`mt-0.5 h-4 w-1 flex-shrink-0 rounded-sm ${c.left}`} />
      {children}
    </div>
  )
}

export const TabBar = ({
  activeTab,
  onTabChange,
  tabs,
}: {
  activeTab: string
  onTabChange: (value: string) => void
  tabs: { label: string; value: string }[]
}): React.ReactNode => (
  <div aria-label="Administration tabs" className="mb-5 flex border-b border-coal" role="tablist">
    {tabs.map((tab) => (
      <button
        aria-selected={activeTab === tab.value}
        className={`-mb-px border-b-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
          activeTab === tab.value ? 'border-gold text-cream' : 'border-transparent text-muted hover:text-cream'
        }`}
        key={tab.value}
        onClick={() => onTabChange(tab.value)}
        role="tab"
      >
        {tab.label}
      </button>
    ))}
  </div>
)

export const TabPanel = ({
  activeTab,
  children,
  value,
}: {
  activeTab: string
  children: React.ReactNode
  value: string
}): React.ReactNode => (
  <div className={activeTab === value ? 'py-1' : 'hidden'} role="tabpanel">
    {children}
  </div>
)

export const JokeCard = ({
  buttonLabel,
  children,
  onSubmit,
}: {
  buttonLabel: string
  children: React.ReactNode
  onSubmit: () => void
}): React.ReactNode => (
  <div className="rounded-xl border border-coal bg-card/70 p-5">
    {children}
    <div className="mt-5">
      <button
        className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-background shadow-[0_2px_12px_rgba(224,74,87,0.25)] transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
        onClick={onSubmit}
        type="button"
      >
        {buttonLabel}
      </button>
    </div>
  </div>
)

export const LoadingOverlay = (): React.ReactNode => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
    <div className="relative h-10 w-10">
      <div className="absolute inset-0 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
      <div className="spin-reverse absolute inset-2 rounded-full border border-gold/30 border-b-gold" />
    </div>
  </div>
)
