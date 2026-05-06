import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'

import { getRandomJokes } from '@services/jokes'
import { JokeResponse, JokeType } from '@types'

const BUFFER_REFILL_THRESHOLD = 2

export interface UseJokeNavigationResult {
  canGoBack: boolean
  errorMessage: string | undefined
  goBack: () => void
  goRandom: () => void
  id: string | undefined
  resetErrorMessage: () => void
}

export const useJokeNavigation = (initialId?: string): UseJokeNavigationResult => {
  const [id, setId] = useState<string | undefined>(initialId)
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

  // On mount: fill the buffer. If no initialId, pop the first joke as the current one.
  useEffect(() => {
    const init = async () => {
      isRefilling.current = true
      try {
        const jokes = await getRandomJokes(initialId ? [initialId] : [])
        jokes.forEach((j) => client.setQueryData<JokeType>(['joke', j.id], j.data))

        if (!initialId && jokes.length > 0) {
          // Landing page — use the first random joke as the initial display
          setId(jokes[0].id)
          bufferRef.current = jokes.slice(1)
        } else {
          bufferRef.current = jokes
        }
      } catch (error) {
        console.error('Error fetching jokes', { error })
        setErrorMessage('Error loading jokes. Please reload to try again.')
      } finally {
        isRefilling.current = false
      }
    }
    init()
  }, [])

  return {
    canGoBack: history.length > 0,
    errorMessage,
    goBack,
    goRandom,
    id,
    resetErrorMessage,
  }
}
