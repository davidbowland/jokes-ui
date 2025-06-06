import { baseUrl } from '@config/amplify'
import { getInitialData, getJoke, getJokeCount, patchJoke, postJoke } from '@services/jokes'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { JokeType } from '@types'
import jsonpatch from 'fast-json-patch'
import { useCallback, useEffect, useMemo, useState } from 'react'

const randomInt = (max: number): number => Math.floor(max * Math.random())

export interface UseJokeResults {
  addJoke: (newJoke: JokeType) => Promise<number>
  errorMessage: string | undefined
  getTtsUrl: () => string
  hasNextJoke: boolean
  hasPreviousJoke: boolean
  index: number | undefined
  joke: JokeType | undefined
  nextJoke: () => void
  nextRandomJoke: () => void
  previousJoke: () => void
  resetErrorMessage: () => void
  updateJoke: (joke: JokeType, indexOverride?: number) => Promise<void>
}

export const useJoke = (initialIndex?: number, initialCount?: number): UseJokeResults => {
  const [count, setCount] = useState<number | undefined>(initialCount)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [index, setIndex] = useState<number | undefined>(initialIndex)
  const [recentIndexes, setRecentIndexes] = useState<number[]>([])

  const jokeIndexes = useMemo(() => (count ? Array.from({ length: count }).map((_, index) => index + 1) : []), [count])
  const hasNextJoke = Boolean(index && count && index < count)
  const hasPreviousJoke = Boolean(index && count && index > 1)

  const client = useQueryClient()
  const { data: joke, error: queryError } = useQuery<JokeType | undefined>(
    {
      enabled: !!index,
      queryFn: () => getJoke(index!),
      queryKey: ['useJoke', index],
    },
    client,
  )

  const createJokeFn = async (newJoke: JokeType): Promise<number> => {
    const response = await postJoke(newJoke)
    client.setQueryData<JokeType>([response.index], newJoke)
    return response.index
  }
  const { error: createError, mutateAsync: createJoke } = useMutation({
    mutationFn: createJokeFn,
    onSettled: () => client.invalidateQueries({ queryKey: ['useJoke', index] }),
  })

  const updateJokeFn = async ({ index, newJoke }: { index: number; newJoke: JokeType }): Promise<void> => {
    client.setQueryData<JokeType>([index], newJoke)
    if (joke) {
      const jsonPatchOperations = jsonpatch.compare(joke, newJoke, true)
      await patchJoke(index, jsonPatchOperations)
    }
  }
  const { error: mutationError, mutateAsync: mutateJoke } = useMutation({
    mutationFn: updateJokeFn,
    onSettled: () => client.invalidateQueries({ queryKey: ['useJoke', index] }),
  })

  const addJoke = useCallback(async (newJoke: JokeType): Promise<number> => {
    const newIndex = await createJoke(newJoke)
    setIndex(newIndex)
    setCount(newIndex)
    return newIndex
  }, [])

  const getTtsUrl = useCallback((): string => {
    if (joke?.audio) {
      return `data:${joke.audio.contentType};base64,${joke.audio.base64}`
    }
    return `${baseUrl}/jokes/${index}/tts`
  }, [index, joke?.audio])

  const nextRandomJoke = useCallback((): void => {
    if (count) {
      const choices = jokeIndexes.filter((value) => recentIndexes.indexOf(value) < 0)
      const randomIndex = choices.length > 0 ? choices[randomInt(choices.length)] : randomInt(count)
      setIndex(randomIndex)
    }
  }, [count, jokeIndexes])

  const nextJoke = useCallback((): void => {
    if (index && hasNextJoke) {
      setIndex(index + 1)
    }
  }, [hasNextJoke, index])

  const previousJoke = useCallback((): void => {
    if (index && hasPreviousJoke) {
      setIndex(index - 1)
    }
  }, [hasPreviousJoke, index])

  const resetErrorMessage = useCallback((): void => {
    setErrorMessage(undefined)
  }, [])

  const updateJoke = useCallback(
    async (newJoke: JokeType, indexOverride?: number): Promise<void> => {
      const jokeWithoutAudio = { contents: newJoke.contents }
      await mutateJoke({ index: indexOverride ?? index!, newJoke: jokeWithoutAudio })
    },
    [index],
  )

  useEffect(() => {
    if (createError) {
      console.error('Error creating joke', { error: createError })
      setErrorMessage('Error creating joke. Please reload to try again.')
    }
  }, [createError])

  useEffect(() => {
    if (mutationError) {
      console.error('Error updating joke', { error: mutationError })
      setErrorMessage('Error updating joke. Please reload to try again.')
    }
  }, [mutationError])

  useEffect(() => {
    if (queryError) {
      console.error('Error fetching joke', { error: queryError })
      setErrorMessage('Error fetching joke. Please reload to try again.')
    }
  }, [queryError])

  useEffect(() => {
    if (index && recentIndexes.indexOf(index) < 0) {
      setRecentIndexes((recent) => [...recent, index].slice(-10))
    }
  }, [index])

  useEffect(() => {
    if (initialIndex) {
      getJokeCount()
        .then((response) => {
          setCount(response.count)
        })
        .catch((error) => {
          console.error('Error fetching joke count', { error })
          setErrorMessage('Error fetching joke count. Please reload to try again.')
        })
    } else {
      getInitialData()
        .then((response) => {
          setCount(response.count)
          setIndex(response.joke.id)
          client.setQueryData<JokeType>([response.joke.id], response.joke.data)
        })
        .catch((error) => {
          console.error('Error fetching initial data', { error })
          setErrorMessage('Error fetching initial data. Please reload to try again.')
        })
    }
  }, [])

  return {
    addJoke,
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
  }
}
