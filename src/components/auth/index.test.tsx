import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react'
import { user } from '@test/__mocks__'
import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Auth } from 'aws-amplify'
import React from 'react'

import Authenticated from './index'

jest.mock('aws-amplify')
jest.mock('@aws-amplify/analytics')
jest.mock('@aws-amplify/ui-react')

describe('Authenticated component', () => {
  const mockLocationReload = jest.fn()

  beforeAll(() => {
    jest.mocked(Auth).signOut.mockResolvedValue({})
    jest.mocked(Authenticator).mockReturnValue(<>Authenticator</>)
    jest.mocked(ThemeProvider).mockImplementation(({ children }) => children as unknown as JSX.Element)

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: mockLocationReload },
    })
  })

  describe('theme', () => {
    beforeAll(() => {
      jest.mocked(Auth).currentAuthenticatedUser.mockRejectedValue(undefined)
    })

    it('uses system color mode', async () => {
      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>,
      )

      const signInButton = (await screen.findByText(/Admin/i, { selector: 'button' })) as HTMLButtonElement
      fireEvent.click(signInButton)

      expect(ThemeProvider).toHaveBeenCalledWith(expect.objectContaining({ colorMode: 'system' }), expect.anything())
    })
  })

  describe('signed out', () => {
    beforeAll(() => {
      jest.mocked(Auth).currentAuthenticatedUser.mockRejectedValue(undefined)
    })

    it('displays title, admin sign in, and children', async () => {
      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>,
      )

      expect(await screen.findByText(/Testing children/i)).toBeInTheDocument()
      expect(await screen.findByText(/Jokes/i)).toBeInTheDocument()
      expect(await screen.findByText(/Admin/i)).toBeInTheDocument()
      expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument()
    })

    it('shows authenticator when clicking sign in', async () => {
      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>,
      )
      const signInButton = (await screen.findByText(/Admin/i, { selector: 'button' })) as HTMLButtonElement
      fireEvent.click(signInButton)

      expect(await screen.findByText(/Cancel/i)).toBeInTheDocument()
      expect(Authenticator).toHaveBeenCalledTimes(1)
    })

    it('sets the user when logging in', async () => {
      const logInCallback = jest.fn()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      jest.mocked(Authenticator).mockImplementationOnce(({ children }: unknown) => {
        logInCallback.mockImplementation(() => children && children({ signOut: jest.fn(), user }))
        return <>Authenticator</>
      })

      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>,
      )
      logInCallback()
      const signInButton = (await screen.findByText(/Admin/i, { selector: 'button' })) as HTMLButtonElement
      fireEvent.click(signInButton)

      await waitFor(() => {
        expect(Authenticator).toHaveBeenCalled()
      })
      expect(Authenticator).toHaveBeenCalledTimes(1)
      expect(screen.queryByText(/admin/i)).toBeInTheDocument()
    })

    it('goes back when canceling login', async () => {
      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>,
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
      jest.mocked(Auth).currentAuthenticatedUser.mockResolvedValue(user)
    })

    it('displays user name', async () => {
      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>,
      )

      await waitFor(() => {
        expect(jest.mocked(Auth).currentAuthenticatedUser).toHaveBeenCalled()
      })
      expect(screen.queryByText(/admin/i)).toBeInTheDocument()
    })

    it('has a working menu', async () => {
      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>,
      )
      const menuButton = (await screen.findByLabelText(/menu/i, { selector: 'button' })) as HTMLButtonElement
      fireEvent.click(menuButton)

      expect(await screen.findByText(/Sign out/i)).toBeVisible()
    })

    it('signs the user out when selecting sign out', async () => {
      render(
        <Authenticated>
          <p>Testing children</p>
        </Authenticated>,
      )
      const menuButton = (await screen.findByLabelText(/menu/i, { selector: 'button' })) as HTMLButtonElement
      fireEvent.click(menuButton)
      const signOutButton = (await screen.findByText(/Sign out/i)) as HTMLButtonElement
      fireEvent.click(signOutButton)

      await waitFor(() => {
        expect(mockLocationReload).toHaveBeenCalled()
      })
      expect(jest.mocked(Auth).signOut).toHaveBeenCalled()
      expect(await screen.findByText(/Admin/i)).toBeInTheDocument()
      expect(screen.queryByText(/Dave/i)).not.toBeInTheDocument()
    })
  })
})
