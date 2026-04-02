import { Button } from '@heroui/react'
import React from 'react'

export const DrawerContainer = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <div className="fixed inset-x-0 bottom-0 z-50 border-t border-coal bg-surface/95 p-5 shadow-[0_-8px_40px_rgba(0,0,0,0.6)] backdrop-blur-md">
    {children}
  </div>
)

export const DrawerTitle = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <h6 className="text-base font-semibold text-cream">{children}</h6>
)

export const DrawerBody = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <p className="text-sm text-muted">{children}</p>
)

export const AcceptButton = ({ onPress }: { onPress: () => void }): React.ReactNode => (
  <Button className="w-full bg-gold font-semibold text-background" onPress={onPress} variant="primary">
    Accept &amp; continue
  </Button>
)
