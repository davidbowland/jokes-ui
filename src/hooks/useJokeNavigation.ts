import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { getRandomJokes } from '@services/jokes'
import { JokeResponse, JokeType } from '@types'

const BUFFER_REFILL_THRESHOLD = 2
const MAX_TIMELINE_LENGTH = 50

export interface UseJokeNavigationResult {
  canGoBack: boolean
  canGoForward: boolean
  errorMessage: string | undefined
  goBack: () => void
  goForward: () => void
  goRandom: () => void
  id: string | undefined
  resetErrorMessage: () => void
}

export const useJokeNavigation = (initialId?: string): UseJokeNavigationResult => {
  // Timeline of visited joke IDs — single source of truth for navigation state
  const [timeline, setTimeline] = useState<string[]>(initialId ? [initialId] : [])
  const [cursor, setCursor] = useState(initialId ? 0 : -1)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  // Pre-fetched jokes ready for instant "random" navigation
  const bufferRef = useRef<JokeResponse[]>([])
  const isRefilling = useRef(false)

  // Ref tracks current values so callbacks stay stable across renders
  const stateRef = useRef({ cursor, timeline })
  stateRef.current = { cursor, timeline }

  const client = useQueryClient()

  const id = useMemo(() => (cursor >= 0 && cursor < timeline.length ? timeline[cursor] : undefined), [cursor, timeline])
  const canGoBack = cursor > 0
  const canGoForward = cursor < timeline.length - 1

  const refillBuffer = useCallback(async () => {
    if (isRefilling.current) return
    isRefilling.current = true
    try {
      const { timeline: t } = stateRef.current
      const avoid = [...t, ...bufferRef.current.map((j) => j.id)]

      const jokes = await getRandomJokes(avoid)
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

    const { cursor: c, timeline: t } = stateRef.current
    const next = bufferRef.current.shift()!

    // Truncate forward history (browser-style) and append new joke
    const kept = t.slice(Math.max(0, c - MAX_TIMELINE_LENGTH + 2), c + 1)
    setTimeline([...kept, next.id])
    setCursor(kept.length)

    if (bufferRef.current.length < BUFFER_REFILL_THRESHOLD) {
      refillBuffer()
    }
  }, [refillBuffer])

  const goBack = useCallback((): void => {
    const { cursor: c } = stateRef.current
    if (c > 0) setCursor(c - 1)
  }, [])

  const goForward = useCallback((): void => {
    const { cursor: c, timeline: t } = stateRef.current
    if (c < t.length - 1) setCursor(c + 1)
  }, [])

  const resetErrorMessage = useCallback((): void => {
    setErrorMessage(undefined)
  }, [])

  // On mount: fill the buffer. If no initialId, pop the first joke into the timeline.
  useEffect(() => {
    const init = async () => {
      isRefilling.current = true
      try {
        const jokes = await getRandomJokes(initialId ? [initialId] : [])
        jokes.forEach((j) => client.setQueryData<JokeType>(['joke', j.id], j.data))

        if (!initialId && jokes.length > 0) {
          setTimeline([jokes[0].id])
          setCursor(0)
          bufferRef.current = [...jokes.slice(1)]
        } else {
          bufferRef.current = [...jokes]
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
    canGoBack,
    canGoForward,
    errorMessage,
    goBack,
    goForward,
    goRandom,
    id,
    resetErrorMessage,
  }
}
