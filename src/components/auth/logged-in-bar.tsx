import { AmplifyUser } from '@aws-amplify/ui'
import { Auth } from 'aws-amplify'
import { CircleUserRound, LogOut, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

import { NavTitle, SideMenu } from './elements'

export interface LoggedInBarProps {
  setLoggedInUser: (user: AmplifyUser | undefined) => void
}

const LoggedInBar = ({ setLoggedInUser }: LoggedInBarProps): React.ReactNode => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const closeMenu = (): void => {
    setIsDrawerOpen(false)
  }

  const openMenu = (): void => {
    setIsDrawerOpen(true)
  }

  return (
    <>
      <NavTitle>
        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          Humor
        </Link>
      </NavTitle>
      <span className="mr-3 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-xs font-medium tracking-widest text-gold uppercase">
        admin
      </span>
      <button
        aria-controls="menu-appbar"
        aria-haspopup="true"
        aria-label="menu"
        className="rounded-full p-1.5 text-muted transition-colors hover:text-gold"
        onClick={openMenu}
      >
        <CircleUserRound size={22} />
      </button>
      <SideMenu isOpen={isDrawerOpen} onClose={closeMenu}>
        <div className="border-b border-coal p-4">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">Account</p>
        </div>
        <ul className="list-none p-0">
          <li>
            <button
              className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-sm text-cream transition-colors hover:bg-card hover:text-gold"
              onClick={() => {
                closeMenu()
                setLoggedInUser(undefined)
                Auth.signOut().then(() => window.location.reload())
              }}
            >
              <LogOut size={16} />
              Sign out
            </button>
          </li>
          <li>
            <button
              className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-sm text-muted transition-colors hover:bg-card hover:text-cream"
              onClick={closeMenu}
            >
              <X size={16} />
              Close
            </button>
          </li>
        </ul>
      </SideMenu>
    </>
  )
}

export default LoggedInBar
