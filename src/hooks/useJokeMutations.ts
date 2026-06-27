import { useMutation, useQueryClient } from '@tanstack/react-query'
import jsonpatch from 'fast-json-patch'
import { useCallback, useEffect, useState } from 'react'

import { patchJoke, postJoke } from '@services/jokes'
import { JokeType } from '@types'

export interface UseJokeMutationsResult {
  addJoke: (newJoke: JokeType) => Promise<string>
  errorMessage: string | undefined
  resetErrorMessage: () => void
  updateJoke: (newJoke: JokeType) => Promise<void>
}

export const useJokeMutations = (currentIndex: string | undefined): UseJokeMutationsResult => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const client = useQueryClient()

  const createJokeFn = async (newJoke: JokeType): Promise<string> => {
    const response = await postJoke(newJoke)
    return response.index
  }
  const { error: createError, mutateAsync: createJoke } = useMutation({ mutationFn: createJokeFn })

  const updateJokeFn = async ({ index, newJoke }: { index: string; newJoke: JokeType }): Promise<void> => {
    const latestJoke = client.getQueryData<JokeType>(['joke', index])
    if (!latestJoke) return
    const operations = jsonpatch.compare(latestJoke, newJoke, true)
    await patchJoke(index, operations)
    client.setQueryData<JokeType>(['joke', index], newJoke)
  }
  const { error: updateError, mutateAsync: mutateJoke } = useMutation({ mutationFn: updateJokeFn })

  const addJoke = useCallback(
    async (newJoke: JokeType): Promise<string> => {
      const newIndex = await createJoke(newJoke)
      return newIndex
    },
    [createJoke],
  )

  const updateJoke = useCallback(
    async (newJoke: JokeType): Promise<void> => {
      if (!currentIndex) return
      const jokeWithoutAudio = { contents: newJoke.contents }
      await mutateJoke({ index: currentIndex, newJoke: jokeWithoutAudio })
    },
    [currentIndex, mutateJoke],
  )

  const resetErrorMessage = useCallback((): void => {
    setErrorMessage(undefined)
  }, [])

  useEffect(() => {
    if (createError) {
      console.error('Error creating joke', { error: createError })
      setErrorMessage('Error creating joke. Please reload to try again.')
    }
  }, [createError])

  useEffect(() => {
    if (updateError) {
      console.error('Error updating joke', { error: updateError })
      setErrorMessage('Error updating joke. Please reload to try again.')
    }
  }, [updateError])

  return { addJoke, errorMessage, resetErrorMessage, updateJoke }
}
