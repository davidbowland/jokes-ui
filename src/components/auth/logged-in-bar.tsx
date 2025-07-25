import { AmplifyUser } from '@aws-amplify/ui'
import { Auth } from 'aws-amplify'
import { Link } from 'gatsby'
import React, { useState } from 'react'

import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import LogoutIcon from '@mui/icons-material/Logout'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Typography from '@mui/material/Typography'

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
      <Typography sx={{ flexGrow: 1 }} variant="h6">
        <Link style={{ color: '#fff', textDecoration: 'none' }} to="/">
          Jokes
        </Link>
      </Typography>
      <Typography component="div">admin</Typography>
      <IconButton
        aria-controls="menu-appbar"
        aria-haspopup="true"
        aria-label="menu"
        color="inherit"
        edge="start"
        onClick={openMenu}
        size="large"
        sx={{ ml: 0.5 }}
      >
        <AccountCircleRoundedIcon />
      </IconButton>
      <SwipeableDrawer anchor="right" onClose={closeMenu} onOpen={openMenu} open={isDrawerOpen}>
        <Box onClick={closeMenu} role="presentation" sx={{ width: 250 }}>
          <List>
            <ListItem
              button
              onClick={() => {
                closeMenu()
                setLoggedInUser(undefined)
                Auth.signOut().then(() => window.location.reload())
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sign out" />
            </ListItem>
          </List>
          <List>
            <ListItem button>
              <ListItemIcon>
                <CloseRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Close" />
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
    </>
  )
}

export default LoggedInBar
