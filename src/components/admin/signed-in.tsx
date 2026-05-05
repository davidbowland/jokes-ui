import React, { useEffect, useState } from 'react'

import { AdminAlert, JokeCard, LoadingOverlay, TabBar, TabPanel } from './elements'
import { JokeType } from '@types'

interface AdminNotice {
  severity?: 'error' | 'warning' | 'info' | 'success'
  text: string
}

enum AdminView {
  ADD_JOKE = 'add',
  EDIT_JOKE = 'edit',
}

export interface SignedInProps {
  addJoke: (newJoke: JokeType) => Promise<string>
  id: string
  joke: JokeType
  updateJoke: (joke: JokeType) => Promise<void>
}

const ADMIN_TABS = [
  { label: 'Edit joke', value: AdminView.EDIT_JOKE },
  { label: 'Add joke', value: AdminView.ADD_JOKE },
]

const SignedIn = ({ addJoke, id, joke, updateJoke }: SignedInProps): React.ReactNode => {
  const [editJoke, setEditJoke] = useState(joke.contents)

  const [adminView, setAdminView] = useState<string>(AdminView.EDIT_JOKE)
  const [adminNotice, setAdminNotice] = useState({ text: '' } as AdminNotice)
  const [addJokeText, setAddJokeText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAddJoke = async (): Promise<void> => {
    setIsLoading(true)
    try {
      const newId = await addJoke({ contents: addJokeText })
      setAdminNotice({ severity: 'success', text: `Created joke ${newId}` })
    } catch (error) {
      setAdminNotice({ severity: 'error', text: (error as any).response })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateJoke = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await updateJoke({ contents: editJoke })
      setAdminNotice({ severity: 'success', text: 'Joke successfully updated!' })
    } catch (error) {
      setAdminNotice({ severity: 'error', text: (error as any).response })
    } finally {
      setIsLoading(false)
    }
  }

  const updateAdminView = (newValue: string) => {
    setAdminNotice({ text: '' })
    setAdminView(newValue)
  }

  useEffect(() => {
    setEditJoke(joke.contents)
  }, [joke])

  return (
    <div>
      {adminNotice.severity && <AdminAlert severity={adminNotice.severity}>{adminNotice.text}</AdminAlert>}
      <TabBar activeTab={adminView} onTabChange={updateAdminView} tabs={ADMIN_TABS} />
      <TabPanel activeTab={adminView} value={AdminView.EDIT_JOKE}>
        <JokeCard buttonLabel="Update joke" onSubmit={handleUpdateJoke}>
          <label>
            <span className="mb-1 block text-sm font-medium">{`Joke ${id}`}</span>
            <input
              className="w-full rounded-lg border border-coal bg-surface px-3 py-2 text-cream placeholder-muted focus:border-gold/60 focus:outline-none"
              name="update-joke-text"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEditJoke(event.target.value)}
              type="text"
              value={editJoke}
            />
          </label>
        </JokeCard>
      </TabPanel>
      <TabPanel activeTab={adminView} value={AdminView.ADD_JOKE}>
        <JokeCard buttonLabel="Add joke" onSubmit={handleAddJoke}>
          <label>
            <span className="mb-1 block text-sm font-medium">Joke to add</span>
            <input
              className="w-full rounded-lg border border-coal bg-surface px-3 py-2 text-cream placeholder-muted focus:border-gold/60 focus:outline-none"
              name="add-joke-text"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAddJokeText(event.target.value)}
              type="text"
              value={addJokeText}
            />
          </label>
        </JokeCard>
      </TabPanel>
      {isLoading && <LoadingOverlay />}
    </div>
  )
}

export default SignedIn
