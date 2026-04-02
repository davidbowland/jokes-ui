import React from 'react'

export const NavBar = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <nav className="flex items-center justify-between border-b border-coal bg-background/95 px-5 py-3 backdrop-blur-sm">
    {children}
  </nav>
)

export const NavTitle = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <span className="flex-grow font-display text-xl font-semibold tracking-wide text-gold">{children}</span>
)

export const SideMenu = ({
  children,
  isOpen,
  onClose,
}: {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}): React.ReactNode => (
  <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'hidden'}`}>
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div className="absolute right-0 top-0 h-full w-64 border-l border-coal bg-surface shadow-2xl">{children}</div>
  </div>
)
