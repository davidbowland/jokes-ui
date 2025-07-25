import { theme } from '@test/__mocks__'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'

import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import Themed from './index'
import Disclaimer from '@components/disclaimer'

jest.mock('@aws-amplify/analytics')
jest.mock('@mui/material/CssBaseline')
jest.mock('@mui/material/styles', () => ({
  createTheme: jest.fn(),
  ThemeProvider: jest.fn(),
}))
jest.mock('@mui/material/useMediaQuery')
jest.mock('@components/disclaimer')

describe('Themed component', () => {
  const children = <>fnord</>

  beforeAll(() => {
    jest.mocked(CssBaseline).mockReturnValue(<>CssBaseline</>)
    jest.mocked(Disclaimer).mockReturnValue(<>Disclaimer</>)
    jest.mocked(ThemeProvider).mockImplementation(({ children }) => <>{children}</>)
    jest.mocked(createTheme).mockReturnValue(theme)
    jest.mocked(useMediaQuery).mockReturnValue(false)
  })

  it('displays children in output', async () => {
    render(<Themed>{children}</Themed>)

    expect(await screen.findByText(/fnord/)).toBeInTheDocument()
  })

  it('renders CssBaseline', async () => {
    render(<Themed>{children}</Themed>)

    expect(CssBaseline).toHaveBeenCalledTimes(1)
  })

  it('renders Disclaimer', async () => {
    render(<Themed>{children}</Themed>)

    expect(Disclaimer).toHaveBeenCalledTimes(1)
  })

  it('uses light theme when requested', () => {
    render(<Themed>{children}</Themed>)

    expect(createTheme).toHaveBeenCalledWith({
      palette: {
        background: {
          default: '#ededed',
          paper: '#fff',
        },
        mode: 'light',
        text: {
          primary: '#000',
        },
      },
    })
    expect(ThemeProvider).toHaveBeenCalledWith(expect.objectContaining({ theme }), {})
  })

  it('uses dark theme when requested', () => {
    jest.mocked(useMediaQuery).mockReturnValueOnce(true)
    render(<Themed>{children}</Themed>)

    expect(createTheme).toHaveBeenCalledWith({
      palette: {
        background: {
          default: '#121212',
          paper: '#121212',
        },
        mode: 'dark',
        text: {
          primary: '#fff',
        },
      },
    })
    expect(ThemeProvider).toHaveBeenCalledWith(expect.objectContaining({ theme }), {})
  })
})
