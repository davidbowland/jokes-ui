import Alert from '@mui/material/Alert'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TextField from '@mui/material/TextField'
import jsonpatch from 'fast-json-patch'
import React, { useEffect, useState } from 'react'

import { patchJoke, postJoke } from '@services/jokes'
import { DisplayedJoke } from '@types'

export interface SignedInProps {
  joke?: DisplayedJoke
  signOut: () => void
  setJoke: (joke: DisplayedJoke | undefined) => void
}

interface AdminNotice {
  severity?: 'error' | 'warning' | 'info' | 'success'
  text: string
}

enum AdminView {
  ADD_JOKE = 'add',
  EDIT_JOKE = 'edit',
}

const SignedIn = ({ joke, signOut, setJoke }: SignedInProps): JSX.Element => {
  const [editJoke, setEditJoke] = useState(joke?.contents ?? '')

  const [adminView, setAdminView] = useState(AdminView.EDIT_JOKE)
  const [adminNotice, setAdminNotice] = useState({ text: '' } as AdminNotice)
  const [addJokeText, setAddJokeText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const addJoke = async (): Promise<void> => {
    setIsLoading(true)
    try {
      const response = await postJoke({ contents: addJokeText })
      setAdminNotice({ severity: 'success', text: `Created joke #${response.index}` })
    } catch (error) {
      setAdminNotice({ severity: 'error', text: (error as any).response })
    }
    setIsLoading(false)
  }

  const updateJoke = async (): Promise<void> => {
    setIsLoading(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const newJoke = { ...joke!, contents: editJoke }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await patchJoke(joke!.index, jsonpatch.compare(joke!, newJoke, true))
      setJoke(newJoke)
      setAdminNotice({ severity: 'success', text: 'Joke successfully updated!' })
    } catch (error) {
      setAdminNotice({ severity: 'error', text: (error as any).response })
    }
    setIsLoading(false)
  }

  const updateAdminView = (event: React.SyntheticEvent<Element, Event>, newValue: AdminView) => {
    setAdminNotice({ text: '' })
    setAdminView(newValue)
  }

  useEffect(() => {
    setEditJoke(joke?.contents ?? '')
  }, [joke])

  if (joke === undefined) {
    return <Alert severity={'error'}>Unable to load jokes</Alert>
  }

  return (
    <div>
      {adminNotice.severity && <Alert severity={adminNotice.severity}>{adminNotice.text}</Alert>}
      <TabContext value={adminView}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={updateAdminView} aria-label="Administration tabs">
            <Tab label="Edit joke" value={AdminView.EDIT_JOKE} />
            <Tab label="Add joke" value={AdminView.ADD_JOKE} />
          </TabList>
        </Box>
        <TabPanel value={AdminView.EDIT_JOKE}>
          <label>
            <TextField
              variant="filled"
              type="text"
              fullWidth
              label={`Joke #${joke.index}`}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEditJoke(event.target.value)}
              name="update-joke-text"
              value={editJoke}
            />
          </label>
          <p>
            <Button variant="contained" onClick={updateJoke}>
              Update joke
            </Button>
          </p>
        </TabPanel>
        <TabPanel value={AdminView.ADD_JOKE}>
          <label>
            <TextField
              variant="filled"
              type="text"
              fullWidth
              label="Joke to add"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAddJokeText(event.target.value)}
              name="add-joke-text"
              value={addJokeText}
            />
          </label>
          <p>
            <Button variant="contained" onClick={addJoke}>
              Add joke
            </Button>
          </p>
        </TabPanel>
      </TabContext>
      <div>
        <Button variant="outlined" color="error" onClick={signOut}>
          Sign out
        </Button>
      </div>
      <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme: any) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}

export default SignedIn
