import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Radio from '@mui/material/Radio'
import React, { useEffect, useState } from 'react'

import JokeService, { JokeResponse, JokeType } from '@services/jokes'

export interface JokeProps {
  initialize?: boolean
}

export interface Client {
  endpoint: string
  fetchOptions: Record<string, unknown>
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

  const [adminView, setAdminView] = useState(AdminView.ADD_JOKE)
  const [adminNotice, setAdminNotice] = useState('')
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
    setAdminNotice(`Created joke #${response.id}`)
  }

  const updateJoke = async (): Promise<void> => {
    await JokeService.putJoke(joke.index, { joke: joke.joke })
    setAdminNotice('Joke successfully updated!')
  }

  const updateAdminView = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdminNotice('')
    setAdminView(event.target.value as AdminView)
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
      <Authenticator className="amplify-authenticator">
        {({ signOut }) => (
          <div>
            <p>{adminNotice}</p>
            <div>
              <label>
                <Radio
                  onChange={updateAdminView}
                  name="admin-view"
                  value={AdminView.ADD_JOKE}
                  checked={adminView == AdminView.ADD_JOKE}
                />
                Add joke
              </label>
              <br />
              <label>
                <Radio
                  onChange={updateAdminView}
                  name="admin-view"
                  value={AdminView.EDIT_JOKE}
                  checked={adminView == AdminView.EDIT_JOKE}
                />
                Edit joke
              </label>
            </div>
            {adminView == AdminView.ADD_JOKE ? (
              <div>
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
              </div>
            ) : (
              <div>
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
              </div>
            )}
            <div>
              <Button variant="outlined" color="error" onClick={signOut}>
                Sign out
              </Button>
            </div>
          </div>
        )}
      </Authenticator>
    </>
  )
}

export default Joke
