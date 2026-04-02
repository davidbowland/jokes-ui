import { Button, Card, CardContent } from '@heroui/react'
import React from 'react'

export const AdminAlert = ({
  children,
  severity,
}: {
  children: React.ReactNode
  severity: 'error' | 'warning' | 'info' | 'success'
}): React.ReactNode => {
  const colorMap: Record<string, string> = {
    error: 'border-red-800/50 bg-red-950/80 text-red-300',
    info: 'border-blue-800/50 bg-blue-950/80 text-blue-300',
    success: 'border-green-800/50 bg-green-950/80 text-green-300',
    warning: 'border-orange-800/50 bg-orange-950/80 text-orange-300',
  }
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${colorMap[severity] ?? ''}`} role="alert">
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
  <div aria-label="Administration tabs" className="flex border-b border-coal" role="tablist">
    {tabs.map((tab) => (
      <button
        aria-selected={activeTab === tab.value}
        className={`px-4 py-2.5 text-sm font-medium transition-colors ${
          activeTab === tab.value ? 'border-b-2 border-gold text-gold' : 'text-muted hover:text-cream'
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
  <div className={activeTab === value ? 'py-4' : 'hidden'} role="tabpanel">
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
  <Card className="border border-coal bg-card">
    <CardContent>
      {children}
      <div className="p-2 pt-4">
        <Button className="w-full bg-gold font-semibold text-background sm:w-auto" onPress={onSubmit} variant="primary">
          {buttonLabel}
        </Button>
      </div>
    </CardContent>
  </Card>
)

export const LoadingOverlay = (): React.ReactNode => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/20 border-t-gold" role="status" />
  </div>
)
