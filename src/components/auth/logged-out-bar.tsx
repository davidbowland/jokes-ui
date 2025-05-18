import LoginIcon from '@mui/icons-material/Login'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Link } from 'gatsby'
import React from 'react'

export interface LoggedOutBarProps {
  setShowLogin: (state: boolean) => void
}

const LoggedOutBar = ({ setShowLogin }: LoggedOutBarProps): JSX.Element => {
  const signInClick = () => {
    setShowLogin(true)
  }

  return (
    <>
      <Typography sx={{ flexGrow: 1 }} variant="h6">
        <Link style={{ color: '#fff', textDecoration: 'none' }} to="/">
          Jokes
        </Link>
      </Typography>
      <Button
        onClick={signInClick}
        startIcon={<LoginIcon />}
        sx={{ borderColor: '#fff', color: '#fff' }}
        variant="outlined"
      >
        Admin
      </Button>
    </>
  )
}

export default LoggedOutBar
