import { Volume2 } from 'lucide-react'
import React from 'react'

export const JokeCounter = ({ count, index }: { count: number; index: string }): React.ReactNode => (
  <p className="text-xs font-medium uppercase tracking-widest text-muted">
    No.&nbsp;{index}&nbsp;/&nbsp;{count}
  </p>
)

export const JokeTitle = ({ children }: { children: React.ReactNode }): React.ReactNode => (
  <h2 className="joke-enter min-h-[9rem] text-center font-display text-3xl font-bold leading-[1.4] text-cream sm:text-4xl md:text-5xl md:leading-[1.35]">
    {children}
  </h2>
)

export const JokeSkeleton = (): React.ReactNode => (
  <div className="flex min-h-[9rem] flex-col items-center justify-center gap-4">
    <div className="h-8 w-3/4 animate-pulse rounded bg-coal/70" />
    <div className="h-8 w-full animate-pulse rounded bg-coal/55" />
    <div className="h-8 w-2/5 animate-pulse rounded bg-coal/40" />
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
    aria-label="Text-to-speech"
    className="flex items-center gap-3 rounded-md bg-gold px-7 py-3 text-sm font-semibold text-background shadow-[0_4px_20px_rgba(224,74,87,0.3)] transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none"
    data-amplify-analytics-name="text-to-speech-click"
    data-amplify-analytics-on="click"
    disabled={isDisabled}
    onClick={onPress}
  >
    {isLoading ? (
      <span
        aria-hidden="true"
        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-background/25 border-t-background"
      />
    ) : (
      <Volume2 aria-hidden="true" size={16} strokeWidth={2} />
    )}
    <span>{isLoading ? 'Fetching audio' : 'Text-to-speech'}</span>
  </button>
)
