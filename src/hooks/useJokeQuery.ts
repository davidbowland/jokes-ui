import { useQuery, useQueryClient } from '@tanstack/react-query'

import { getJoke } from '@services/jokes'
import { JokeType } from '@types'

export interface UseJokeQueryResult {
  joke: JokeType | undefined
  error: Error | null
}

export const useJokeQuery = (index: string | undefined): UseJokeQueryResult => {
  const client = useQueryClient()
  const { data: joke, error } = useQuery<JokeType>(
    {
      enabled: !!index,
      queryFn: () => getJoke(index!),
      queryKey: ['joke', index],
    },
    client,
  )

  return { error, joke }
}
