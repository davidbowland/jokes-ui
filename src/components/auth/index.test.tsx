import '@testing-library/jest-dom'
import { act, render, screen, waitFor } from '@testing-library/react'
import { Auth } from 'aws-amplify'
import { Authenticator } from '@aws-amplify/ui-react'
import React from 'react'
import { mocked } from 'jest-mock'

import Authenticated from './index'
import { user } from '@test/__mocks__'

jest.mock('aws-amplify')
jest.mock('@aws-amplify/analytics')
jest.mock('@aws-amplify/ui-react')

describe('Authenticated component', () => {
  const consoleError = console.error
  const mockLocationReload = jest.fn()
  const windowLocationReload = window.location.reload

  beforeAll(() => {
    mocked(Auth).signOut.mockResolvedValue({})
    mocked(Authenticator).mockReturnValue(<></>)

    console.error = jest.fn()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: mockLocationReload },
    })
  })

  afterAll(() => {
    console.error = consoleError
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { replace: windowLocationReload },
    })
  })

  describe('signed out', () => {
    beforeAll(() => {
      mocked(Auth).currentAuthenticatedUser.mockRejectedValue(undefined)
    })

    test('expect title, admin sign in, and children', async () => {
      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>
      )

      expect(await screen.findByText(/Testing children/i)).toBeInTheDocument()
      expect(await screen.findByText(/Jokes/i)).toBeInTheDocument()
      expect(await screen.findByText(/Admin/i)).toBeInTheDocument()
      expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument()
    })

    test('expect clicking sign in shows authenticator', async () => {
      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>
      )
      const signInButton = (await screen.findByText(/Admin/i, { selector: 'button' })) as HTMLButtonElement
      await act(async () => {
        signInButton.click()
      })

      expect(mocked(Authenticator)).toHaveBeenCalledTimes(1)
      expect(await screen.findByText(/Cancel/i)).toBeInTheDocument()
    })

    test('expect logging in sets the user', async () => {
      const logInCallback = jest.fn()
      mocked(Authenticator).mockImplementationOnce(({ children }) => {
        logInCallback.mockImplementation(() => children && children({ signOut: jest.fn(), user }))
        return <></>
      })

      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>
      )
      const signInButton = (await screen.findByText(/Admin/i, { selector: 'button' })) as HTMLButtonElement
      await act(async () => {
        signInButton.click()
      })
      await act(async () => {
        logInCallback()
      })

      expect(mocked(Authenticator)).toHaveBeenCalledTimes(1)
      expect(await screen.findByText(/Welcome, admin/i)).toBeInTheDocument()
    })

    test('expect going back from login goes back', async () => {
      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>
      )

      const signInButton = (await screen.findByText(/Admin/i, { selector: 'button' })) as HTMLButtonElement
      await act(async () => {
        signInButton.click()
      })
      const goBackButton = (await screen.findByText(/Cancel/i, { selector: 'button' })) as HTMLButtonElement
      await act(async () => {
        goBackButton.click()
      })

      expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument()
    })
  })

  describe('signed in', () => {
    beforeAll(() => {
      mocked(Auth).currentAuthenticatedUser.mockResolvedValue(user)
      user.deleteUser = jest.fn().mockImplementation((callback) => callback())
    })

    test('expect welcome message', async () => {
      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>
      )

      expect(await screen.findByText(/Welcome, admin/i)).toBeInTheDocument()
    })

    test('expect working menu', async () => {
      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>
      )
      const menuButton = (await screen.findByLabelText(/menu/i, { selector: 'button' })) as HTMLButtonElement
      await act(async () => {
        menuButton.click()
      })

      expect(await screen.findByText(/Sign out/i)).toBeVisible()
    })

    test('expect selecting sign out signs the user out', async () => {
      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>
      )
      const menuButton = (await screen.findByLabelText(/menu/i, { selector: 'button' })) as HTMLButtonElement
      await act(async () => {
        menuButton.click()
      })
      const signOutButton = (await screen.findByText(/Sign out/i)) as HTMLButtonElement
      await act(async () => {
        signOutButton.click()
      })

      expect(user.deleteUser).not.toHaveBeenCalled()
      expect(mocked(Auth).signOut).toHaveBeenCalled()
      expect(await screen.findByText(/Admin/i)).toBeInTheDocument()
      expect(screen.queryByText(/Welcome, Dave/i)).not.toBeInTheDocument()
      await waitFor(() => expect(mockLocationReload).toHaveBeenCalled())
    })
  })
})
