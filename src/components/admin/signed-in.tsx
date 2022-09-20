import React, { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TextField from '@mui/material/TextField'
import jsonpatch from 'fast-json-patch'

import { DisplayedJoke, RemoveOperation } from '@types'
import { patchJoke, postJoke } from '@services/jokes'

export interface SignedInProps {
  joke?: DisplayedJoke
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

const SignedIn = ({ joke, setJoke }: SignedInProps): JSX.Element => {
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

  const updateJoke = async (joke: DisplayedJoke): Promise<void> => {
    setIsLoading(true)
    try {
      const newJoke = { ...joke, contents: editJoke }
      const jsonPatchOperations = jsonpatch.compare(joke, newJoke, true)
      await patchJoke(
        joke.index,
        joke.audio ? [...jsonPatchOperations, { op: 'remove', path: '/audio' } as RemoveOperation] : jsonPatchOperations
      )
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
    return (
      <Alert severity={'error'} variant="filled">
        Unable to load jokes
      </Alert>
    )
  }

  return (
    <div>
      {adminNotice.severity && (
        <Alert severity={adminNotice.severity} variant="filled">
          {adminNotice.text}
        </Alert>
      )}
      <TabContext value={adminView}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList aria-label="Administration tabs" onChange={updateAdminView}>
            <Tab label="Edit joke" value={AdminView.EDIT_JOKE} />
            <Tab label="Add joke" value={AdminView.ADD_JOKE} />
          </TabList>
        </Box>
        <TabPanel value={AdminView.EDIT_JOKE}>
          <Card variant="outlined">
            <CardContent>
              <label>
                <TextField
                  fullWidth
                  label={`Joke #${joke.index}`}
                  name="update-joke-text"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEditJoke(event.target.value)}
                  type="text"
                  value={editJoke}
                  variant="filled"
                />
              </label>
            </CardContent>
            <CardActions sx={{ p: 2 }}>
              <Button
                onClick={() => joke && updateJoke(joke)}
                sx={{ width: { sm: 'auto', xs: '100%' } }}
                variant="contained"
              >
                Update joke
              </Button>
            </CardActions>
          </Card>
        </TabPanel>
        <TabPanel value={AdminView.ADD_JOKE}>
          <Card variant="outlined">
            <CardContent>
              <label>
                <TextField
                  fullWidth
                  label="Joke to add"
                  name="add-joke-text"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAddJokeText(event.target.value)}
                  type="text"
                  value={addJokeText}
                  variant="filled"
                />
              </label>
            </CardContent>
            <CardActions sx={{ p: 2 }}>
              <Button onClick={addJoke} sx={{ width: { sm: 'auto', xs: '100%' } }} variant="contained">
                Add joke
              </Button>
            </CardActions>
          </Card>
        </TabPanel>
      </TabContext>
      <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme: any) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}

export default SignedIn
