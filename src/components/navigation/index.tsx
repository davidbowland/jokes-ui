import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react'
import React, { useEffect } from 'react'

import { ErrorToast, NavButtonRow, NavIconButton, NavigationContainer } from './elements'
import Joke from '@components/joke'
import { useJoke } from '@hooks/useJoke'

export interface NavigationProps {
  initialCount?: number
  initialIndex?: number
}

const Navigation = ({ initialCount, initialIndex }: NavigationProps): React.ReactNode => {
  const {
    addJoke,
    count,
    errorMessage,
    getTtsUrl,
    hasNextJoke,
    hasPreviousJoke,
    index,
    joke,
    nextJoke,
    nextRandomJoke,
    previousJoke,
    resetErrorMessage,
    updateJoke,
  } = useJoke(initialIndex, initialCount)

  useEffect(() => {
    if (index) {
      window.history.replaceState(null, '', `/j/${index}`)
    }
  }, [index])

  return (
    <NavigationContainer>
      <Joke
        addJoke={addJoke}
        count={count}
        getTtsUrl={getTtsUrl}
        index={index}
        joke={joke}
        key={index}
        updateJoke={updateJoke}
      />
      <NavButtonRow>
        <NavIconButton aria-label="Previous joke" disabled={!joke || !hasPreviousJoke} onClick={previousJoke}>
          <ChevronLeft size={18} />
          <span className="text-sm">Prev</span>
        </NavIconButton>
        <NavIconButton aria-label="Random joke" disabled={!joke} onClick={nextRandomJoke} variant="random">
          <Shuffle size={18} />
        </NavIconButton>
        <NavIconButton aria-label="Next joke" disabled={!joke || !hasNextJoke} onClick={nextJoke}>
          <span className="text-sm">Next</span>
          <ChevronRight size={18} />
        </NavIconButton>
      </NavButtonRow>
      <ErrorToast onClose={resetErrorMessage} open={errorMessage !== undefined}>
        {errorMessage}
      </ErrorToast>
    </NavigationContainer>
  )
}

export default Navigation
