import { ChevronLeft, Shuffle } from 'lucide-react'
import React, { useCallback, useEffect } from 'react'

import { ErrorToast, NavButtonRow, NavIconButton, NavigationContainer } from './elements'
import Joke from '@components/joke'
import { useJokeMutations } from '@hooks/useJokeMutations'
import { useJokeNavigation } from '@hooks/useJokeNavigation'
import { useJokeQuery } from '@hooks/useJokeQuery'

export interface NavigationProps {
  initialId?: string
}

const Navigation = ({ initialId }: NavigationProps): React.ReactNode => {
  const {
    canGoBack,
    count,
    errorMessage: navError,
    goBack,
    goRandom,
    id,
    resetErrorMessage: resetNavError,
  } = useJokeNavigation(initialId)
  const { error: queryError, joke } = useJokeQuery(id)
  const {
    addJoke,
    errorMessage: mutationError,
    resetErrorMessage: resetMutationError,
    updateJoke,
  } = useJokeMutations(id)

  const errorMessage =
    navError ?? mutationError ?? (queryError ? 'Error fetching joke. Please reload to try again.' : undefined)
  const resetErrorMessage = useCallback(() => {
    resetNavError()
    resetMutationError()
  }, [resetNavError, resetMutationError])

  useEffect(() => {
    if (id) {
      window.history.replaceState(null, '', `/j/${id}`)
    }
  }, [id])

  return (
    <NavigationContainer>
      <Joke addJoke={addJoke} count={count} id={id} joke={joke} updateJoke={updateJoke} />
      <NavButtonRow>
        <NavIconButton aria-label="Go back" disabled={!joke || !canGoBack} onClick={goBack}>
          <ChevronLeft size={18} />
          <span className="text-sm">Back</span>
        </NavIconButton>
        <NavIconButton aria-label="Random joke" disabled={!joke} onClick={goRandom} variant="random">
          <Shuffle size={18} />
        </NavIconButton>
      </NavButtonRow>
      <ErrorToast onClose={resetErrorMessage} open={errorMessage !== undefined}>
        {errorMessage}
      </ErrorToast>
    </NavigationContainer>
  )
}

export default Navigation
