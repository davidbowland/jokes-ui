import React from 'react'
import { createPortal } from 'react-dom'

export const PunchlineLogo = ({ className = '' }: { className?: string }): React.ReactNode => (
  <svg aria-hidden="true" className={className} fill="none" viewBox="2 0 52 62" xmlns="http://www.w3.org/2000/svg">
    {/* P stem doubling as the mic body */}
    <rect fill="currentColor" height="45" rx="4.5" width="9" x="17" y="9" />
    {/* Mic capsule forming the bowl of the P */}
    <ellipse cx="34" cy="21" fill="none" rx="13" ry="14" stroke="currentColor" strokeWidth="8" />
    {/* Cord flick */}
    <path d="M18 53 Q8 57 11 47" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="5" />
  </svg>
)

export const NavBar = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <nav className="fixed left-0 right-0 top-0 z-40 border-b border-coal bg-surface/96 backdrop-blur-md">
    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">{children}</div>
  </nav>
)

export const NavTitle = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <span className="font-display text-xl font-bold tracking-tight text-cream">{children}</span>
)

export const SideMenu = ({
  children,
  isOpen,
  onClose,
}: {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}): React.ReactNode =>
  createPortal(
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className={`absolute right-0 top-0 h-full w-72 border-l border-coal bg-surface shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
