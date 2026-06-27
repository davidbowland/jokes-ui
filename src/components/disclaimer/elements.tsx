import React from 'react'

export const DrawerContainer = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-coal bg-surface/98 shadow-[0_-4px_32px_rgba(0,0,0,0.55)] backdrop-blur-xl">
    <div className="mx-auto max-w-5xl px-6 py-6 sm:px-10 sm:py-8">{children}</div>
  </div>
)

export const DrawerTitle = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <h6 className="mb-2 text-sm font-semibold text-cream">{children}</h6>
)

export const DrawerBody = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <p className="text-xs leading-relaxed text-muted">{children}</p>
)

export const AcceptButton = ({ onPress }: { onPress: () => void }): React.ReactNode => (
  <button
    className="rounded-md bg-gold px-6 py-2.5 text-sm font-semibold text-background transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
    onClick={onPress}
    type="button"
  >
    Accept &amp; continue
  </button>
)
