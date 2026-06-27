import React from 'react'

export const PageMain = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <main className="relative flex min-h-[100dvh] flex-col px-4 pb-10 pt-24">{children}</main>
)

export const GradientOverlay = (): React.ReactNode => (
  <>
    {/* Subtle coral ambient from upper-right corner */}
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_55%_45%_at_90%_-10%,rgba(224,74,87,0.07),transparent_60%)]" />
    {/* Soft bottom vignette */}
    <div className="pointer-events-none fixed inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background/55 to-transparent" />
  </>
)

export const ContentContainer = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div className="relative mx-auto w-full max-w-2xl">
    {/* Large decorative opening quotation mark */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-4 -top-12 select-none font-display text-[11rem] font-bold leading-none text-gold/[0.06] sm:-left-8 sm:text-[14rem]"
    >
      &#x201C;
    </div>
    <div className="relative z-10">{children}</div>
  </div>
)

export const FooterContainer = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div className="relative mt-auto pt-14">{children}</div>
)
