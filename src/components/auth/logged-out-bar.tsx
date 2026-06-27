import { LogIn } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { NavTitle, PunchlineLogo } from './elements'

export interface LoggedOutBarProps {
  setShowLogin: (state: boolean) => void
}

const LoggedOutBar = ({ setShowLogin }: LoggedOutBarProps): React.ReactNode => {
  return (
    <>
      <Link className="flex items-center gap-2.5 no-underline" href="/">
        <PunchlineLogo className="h-7 w-auto text-gold" />
        <NavTitle>Punchline</NavTitle>
      </Link>
      <button
        className="flex items-center gap-1.5 rounded border border-coal px-3 py-1.5 text-xs font-medium text-muted transition-colors duration-200 hover:border-coal/40 hover:text-cream"
        onClick={() => setShowLogin(true)}
      >
        <LogIn size={12} strokeWidth={2} />
        Admin
      </button>
    </>
  )
}

export default LoggedOutBar
