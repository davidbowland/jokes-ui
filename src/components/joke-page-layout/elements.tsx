import React from 'react'

export const PageMain = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <main className="relative flex min-h-[calc(100vh-3.5rem)] flex-col px-4">{children}</main>
)

export const GradientOverlay = (): React.ReactNode => (
  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,rgba(245,197,0,0.055),transparent)]" />
)

export const ContentContainer = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div className="relative mx-auto w-full max-w-2xl pt-[15vh]">{children}</div>
)

export const FooterContainer = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div className="relative mt-auto pb-6 pt-10">{children}</div>
)
