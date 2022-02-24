import { StrictMode } from 'react'
import { render } from 'react-dom'
import './index.css'
import { Provider } from 'react-redux'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import App from './App'
import { store } from './store'
import Footer from './Footer'

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

render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <App />
                <Footer />
            </Provider>
        </ThemeProvider>
    </StrictMode>,
    document.getElementById('root')
)
