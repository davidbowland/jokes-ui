import { Volume2 } from 'lucide-react'
import React from 'react'

export const JokeTitle = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <h2 className="joke-enter min-h-[9rem] text-center font-display text-3xl font-normal leading-relaxed text-cream sm:text-4xl md:text-5xl md:leading-[1.35]">
    {children}
  </h2>
)

export const JokeSkeleton = (): React.ReactNode => (
  <div className="flex min-h-[9rem] flex-col justify-center space-y-4">
    <div className="mx-auto h-11 w-3/4 animate-pulse rounded-sm bg-coal" />
    <div className="mx-auto h-11 w-5/6 animate-pulse rounded-sm bg-coal" />
  </div>
)

export const TtsButton = ({
  isDisabled,
  isLoading,
  onPress,
}: {
  isDisabled: boolean
  isLoading: boolean
  onPress: () => void
}): React.ReactNode => (
  <button
    aria-label={isLoading ? 'Fetching audio' : 'Text-to-speech'}
    className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gold text-background shadow-[0_0_28px_rgba(245,197,0,0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(245,197,0,0.4)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-[0_0_28px_rgba(245,197,0,0.2)]"
    data-amplify-analytics-name="text-to-speech-click"
    data-amplify-analytics-on="click"
    disabled={isDisabled}
    onClick={onPress}
  >
    {isLoading ? (
      <span className="absolute inset-0 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
    ) : null}
    <Volume2 size={26} strokeWidth={1.5} />
    <span className="sr-only">{isLoading ? 'Fetching audio' : 'Text-to-speech'}</span>
  </button>
)
