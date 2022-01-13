import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Provider } from 'react-redux'
import { store } from './store'

const theme = createTheme({
    palette: {
        primary: {
            main: '#435e7c',
        },
        secondary: {
            main: '#A5C2A6',
        },
    },
})

function AllTheProviders({ children }: { children: any }) {
    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>{children}</Provider>
        </ThemeProvider>
    )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
    render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
