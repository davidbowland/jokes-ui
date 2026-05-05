import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'

import { getInitialData, getJokeCount, getRandomJokes } from '@services/jokes'
import { JokeResponse, JokeType } from '@types'

const BUFFER_REFILL_THRESHOLD = 2

export interface UseJokeNavigationResult {
  canGoBack: boolean
  count: number | undefined
  errorMessage: string | undefined
  goBack: () => void
  goRandom: () => void
  id: string | undefined
  resetErrorMessage: () => void
}

export const useJokeNavigation = (initialId?: string): UseJokeNavigationResult => {
  const [id, setId] = useState<string | undefined>(initialId)
  const [count, setCount] = useState<number | undefined>()
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  // History of visited joke IDs for "back" navigation
  const [history, setHistory] = useState<string[]>([])

  // Pre-fetched jokes ready for instant "random" navigation
  const bufferRef = useRef<JokeResponse[]>([])
  const isRefilling = useRef(false)

  // Ref tracks current values so callbacks stay stable across renders
  const stateRef = useRef({ history, id })
  stateRef.current = { history, id }

  const client = useQueryClient()

  const refillBuffer = useCallback(async () => {
    if (isRefilling.current) return
    isRefilling.current = true
    try {
      const { history: h, id: currentId } = stateRef.current
      const avoid = [...h, ...bufferRef.current.map((j) => j.id)]
      if (currentId) avoid.push(currentId)

      const jokes = await getRandomJokes(avoid)
      // Pre-populate React Query cache so navigation is instant
      jokes.forEach((j) => client.setQueryData<JokeType>(['joke', j.id], j.data))
      bufferRef.current = [...bufferRef.current, ...jokes]
    } catch (error) {
      console.error('Error pre-fetching random jokes', { error })
    } finally {
      isRefilling.current = false
    }
  }, [client])

  const goRandom = useCallback((): void => {
    if (bufferRef.current.length === 0) {
      refillBuffer()
      setErrorMessage('Loading jokes... please try again in a moment.')
      return
    }

    const { id: currentId } = stateRef.current
    if (currentId) {
      setHistory((prev) => [...prev, currentId].slice(-20))
    }

    const next = bufferRef.current.shift()!
    setId(next.id)

    if (bufferRef.current.length < BUFFER_REFILL_THRESHOLD) {
      refillBuffer()
    }
  }, [refillBuffer])

  const goBack = useCallback((): void => {
    const { history: h } = stateRef.current
    if (h.length === 0) return
    const previousId = h[h.length - 1]
    setHistory((prev) => prev.slice(0, -1))
    setId(previousId)
  }, [])

  const resetErrorMessage = useCallback((): void => {
    setErrorMessage(undefined)
  }, [])

  // Initial load
  useEffect(() => {
    if (initialId) {
      // We have an ID from the URL — just fetch the count
      getJokeCount()
        .then((response) => setCount(response.count))
        .catch((error) => {
          console.error('Error fetching joke count', { error })
          setErrorMessage('Error fetching joke count. Please reload to try again.')
        })
    } else {
      // Landing page — get a random joke + count in one call
      getInitialData()
        .then((response) => {
          setCount(response.count)
          setId(response.joke.id)
          client.setQueryData<JokeType>(['joke', response.joke.id], response.joke.data)
        })
        .catch((error) => {
          console.error('Error fetching initial data', { error })
          setErrorMessage('Error fetching initial data. Please reload to try again.')
        })
    }
  }, [])

  // Fill the buffer once we have an ID (initial load complete)
  useEffect(() => {
    if (id && bufferRef.current.length === 0) {
      refillBuffer()
    }
  }, [id])

  return {
    canGoBack: history.length > 0,
    count,
    errorMessage,
    goBack,
    goRandom,
    id,
    resetErrorMessage,
  }
}
