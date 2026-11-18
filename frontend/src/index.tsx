import { StrictMode } from 'react'
import { render } from 'react-dom'
import './index.css'
import './ui'
import { Provider } from 'react-redux'
import App from './App'
import { store } from './store'
import Footer from './Footer'

render(
    <StrictMode>
        <Provider store={store}>
            <App />
            <Footer />
        </Provider>
    </StrictMode>,
    document.getElementById('root')
)
