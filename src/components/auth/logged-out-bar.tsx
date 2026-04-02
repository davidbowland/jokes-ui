import { LogIn } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { NavTitle } from './elements'

export interface LoggedOutBarProps {
  setShowLogin: (state: boolean) => void
}

const LoggedOutBar = ({ setShowLogin }: LoggedOutBarProps): React.ReactNode => {
  const signInClick = () => {
    setShowLogin(true)
  }

  return (
    <>
      <NavTitle>
        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          Humor
        </Link>
      </NavTitle>
      <button
        className="flex items-center gap-1.5 rounded-full border border-coal px-4 py-1.5 text-sm text-muted transition-all hover:border-gold/50 hover:text-gold"
        onClick={signInClick}
      >
        <LogIn size={14} />
        Admin
      </button>
    </>
  )
}

export default LoggedOutBar
