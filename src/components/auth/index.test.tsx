import '@testing-library/jest-dom'
import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Auth } from 'aws-amplify'
import { mocked } from 'jest-mock'
import React from 'react'

import Authenticated from './index'
import { user } from '@test/__mocks__'

jest.mock('aws-amplify')
jest.mock('@aws-amplify/analytics')
jest.mock('@aws-amplify/ui-react')

describe('Authenticated component', () => {
  const mockLocationReload = jest.fn()

  beforeAll(() => {
    mocked(Auth).signOut.mockResolvedValue({})
    mocked(Authenticator).mockReturnValue(<>Authenticator</>)
    mocked(ThemeProvider).mockImplementation(({ children }) => children as unknown as JSX.Element)

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: mockLocationReload },
    })
  })

  describe('theme', () => {
    beforeAll(() => {
      mocked(Auth).currentAuthenticatedUser.mockRejectedValue(undefined)
    })

    test('expect system color mode', async () => {
      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>
      )

      const signInButton = (await screen.findByText(/Admin/i, { selector: 'button' })) as HTMLButtonElement
      fireEvent.click(signInButton)

      expect(mocked(ThemeProvider)).toHaveBeenCalledWith(
        expect.objectContaining({ colorMode: 'system' }),
        expect.anything()
      )
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
      fireEvent.click(signInButton)

      expect(await screen.findByText(/Cancel/i)).toBeInTheDocument()
      expect(mocked(Authenticator)).toHaveBeenCalledTimes(1)
    })

    test('expect logging in sets the user', async () => {
      const logInCallback = jest.fn()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mocked(Authenticator).mockImplementationOnce(({ children }: unknown) => {
        logInCallback.mockImplementation(() => children && children({ signOut: jest.fn(), user }))
        return <>Authenticator</>
      })

      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>
      )
      logInCallback()
      const signInButton = (await screen.findByText(/Admin/i, { selector: 'button' })) as HTMLButtonElement
      fireEvent.click(signInButton)

      await waitFor(() => {
        expect(mocked(Authenticator)).toHaveBeenCalled()
      })
      expect(mocked(Authenticator)).toHaveBeenCalledTimes(1)
      expect(screen.queryByText(/admin/i)).toBeInTheDocument()
    })

    test('expect going back from login goes back', async () => {
      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>
      )

      const signInButton = (await screen.findByText(/Admin/i, { selector: 'button' })) as HTMLButtonElement
      fireEvent.click(signInButton)
      const goBackButton = (await screen.findByText(/Cancel/i, { selector: 'button' })) as HTMLButtonElement
      fireEvent.click(goBackButton)

      expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument()
    })
  })

  describe('signed in', () => {
    beforeAll(() => {
      mocked(Auth).currentAuthenticatedUser.mockResolvedValue(user)
    })

    test('expect user name', async () => {
      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>
      )

      await waitFor(() => {
        expect(mocked(Auth).currentAuthenticatedUser).toHaveBeenCalled()
      })
      expect(screen.queryByText(/admin/i)).toBeInTheDocument()
    })

    test('expect working menu', async () => {
      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>
      )
      const menuButton = (await screen.findByLabelText(/menu/i, { selector: 'button' })) as HTMLButtonElement
      fireEvent.click(menuButton)

      expect(await screen.findByText(/Sign out/i)).toBeVisible()
    })

    test('expect selecting sign out signs the user out', async () => {
      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>
      )
      const menuButton = (await screen.findByLabelText(/menu/i, { selector: 'button' })) as HTMLButtonElement
      fireEvent.click(menuButton)
      const signOutButton = (await screen.findByText(/Sign out/i)) as HTMLButtonElement
      fireEvent.click(signOutButton)

      await waitFor(() => {
        expect(mockLocationReload).toHaveBeenCalled()
      })
      expect(mocked(Auth).signOut).toHaveBeenCalled()
      expect(await screen.findByText(/Admin/i)).toBeInTheDocument()
      expect(screen.queryByText(/Dave/i)).not.toBeInTheDocument()
    })
  })
})
