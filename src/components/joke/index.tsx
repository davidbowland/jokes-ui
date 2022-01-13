import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'

import JokeService, { JokeResponse, JokeType } from '@services/jokes'

export interface JokeProps {
  initialize?: boolean
}

export interface Client {
  endpoint: string
  fetchOptions: Record<string, unknown>
}

export interface AdminNotice {
  severity?: 'error' | 'warning' | 'info' | 'success'
  text: string
}

export enum AdminView {
  ADD_JOKE = 'add',
  EDIT_JOKE = 'edit',
}

export enum AuthState {
  SignedIn = 'signedin',
  SignedOut = 'signedout',
}

export interface DisplayedJoke extends JokeType {
  index: number
}

const Joke = ({ initialize = false }: JokeProps): JSX.Element => {
  const [joke, setJoke] = useState({} as DisplayedJoke)
  const [availableJokes, setAvailableJokes] = useState({} as JokeResponse)
  const [isError, setIsError] = useState(false)
  const jokeList = (Object.keys(availableJokes) as unknown) as number[]
  const isLoading = jokeList.length == 0 || !joke

  const [adminView, setAdminView] = useState(AdminView.EDIT_JOKE)
  const [adminNotice, setAdminNotice] = useState({ text: '' } as AdminNotice)
  const [addJokeText, setAddJokeText] = useState('')

  const fetchJokeList = async (): Promise<void> => {
    try {
      setIsError(false)
      setAvailableJokes(await JokeService.getRandomJokes())
    } catch (error) {
      setIsError(true)
      console.error(error)
    }
  }

  const getRandomJoke = (): DisplayedJoke => {
    const randomIndex = jokeList[Math.floor(Math.random() * jokeList.length)]
    const selectedJoke = availableJokes[randomIndex]
    const { [randomIndex]: _, ...newAvailableJokes } = availableJokes
    setAvailableJokes(newAvailableJokes)

    return { ...selectedJoke, index: randomIndex }
  }

  const nextJoke = async (): Promise<void> => {
    // Setting the joke to empty forces fetchJokeList via useEffect
    setJoke(jokeList.length === 0 ? ({} as DisplayedJoke) : getRandomJoke())
  }

  const addJoke = async (): Promise<void> => {
    const response = await JokeService.postJoke({ joke: addJokeText })
    setAdminNotice({ severity: 'success', text: `Created joke #${response.id}` })
  }

  const updateJoke = async (): Promise<void> => {
    await JokeService.putJoke(joke.index, { joke: joke.joke })
    setAdminNotice({ severity: 'success', text: 'Joke successfully updated!' })
  }

  const updateAdminView = (event: React.SyntheticEvent<Element, Event>, newValue: AdminView) => {
    setAdminNotice({ text: '' })
    setAdminView(newValue)
  }

  const getButtonText = (): string => {
    if (isError) {
      return 'Error! Try again.'
    } else if (isLoading) {
      return 'Loading...'
    }
    return 'Next joke'
  }

  useEffect(() => {
    if (jokeList.length == 0 && (initialize || joke.joke)) {
      fetchJokeList()
    } else if (!joke.joke && jokeList.length > 0) {
      nextJoke()
    }
  }, [availableJokes, joke])

  return (
    <>
      <article className="joke">{joke.joke}</article>
      <Button
        variant="contained"
        onClick={nextJoke}
        disabled={isLoading && !isError}
        color={isError ? 'error' : 'primary'}
      >
        {getButtonText()}
      </Button>
      <section className="site-administration">
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Site Administration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <Authenticator>
                {({ signOut }) => (
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
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                              setJoke({ ...joke, joke: event.target.value })
                            }
                            name="update-joke-text"
                            value={joke.joke}
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
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                              setAddJokeText(event.target.value)
                            }
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
                  </div>
                )}
              </Authenticator>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </section>
    </>
  )
}

export default Joke
