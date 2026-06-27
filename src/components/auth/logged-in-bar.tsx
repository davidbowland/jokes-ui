import { AmplifyUser } from '@aws-amplify/ui'
import { Auth } from 'aws-amplify'
import { CircleUserRound, LogOut, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

import { NavTitle, PunchlineLogo, SideMenu } from './elements'

export interface LoggedInBarProps {
  setLoggedInUser: (user: AmplifyUser | undefined) => void
}

const LoggedInBar = ({ setLoggedInUser }: LoggedInBarProps): React.ReactNode => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const closeMenu = (): void => setIsDrawerOpen(false)
  const openMenu = (): void => setIsDrawerOpen(true)

  return (
    <>
      <Link className="flex items-center gap-2.5 no-underline" href="/">
        <PunchlineLogo className="h-7 w-auto text-gold" />
        <NavTitle>Punchline</NavTitle>
      </Link>
      <div className="flex items-center gap-3">
        <span className="rounded border border-gold/25 bg-gold/8 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-gold">
          admin
        </span>
        <button
          aria-controls="menu-appbar"
          aria-haspopup="true"
          aria-label="Account menu"
          className="rounded p-1.5 text-muted transition-colors duration-200 hover:bg-card hover:text-cream"
          onClick={openMenu}
        >
          <CircleUserRound size={20} strokeWidth={1.5} />
        </button>
      </div>
      <SideMenu isOpen={isDrawerOpen} onClose={closeMenu}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-coal px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Account</p>
            <button
              className="rounded p-1 text-muted transition-colors duration-200 hover:text-cream"
              onClick={closeMenu}
            >
              <X size={15} />
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-3">
            <button
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-cream transition-colors duration-200 hover:bg-card hover:text-gold"
              onClick={() => {
                closeMenu()
                setLoggedInUser(undefined)
                Auth.signOut().then(() => window.location.reload())
              }}
            >
              <LogOut size={14} strokeWidth={1.5} />
              Sign out
            </button>
          </nav>
        </div>
      </SideMenu>
    </>
  )
}

export default LoggedInBar
