import { BrowserRouter as Router } from 'react-router-dom'
import CountryNavigation from '../CountryNavigation'

export default {
    title: 'CountryNavigation',
}
export const USASelected = () => {
    return (
        <Router>
            <CountryNavigation />
        </Router>
    )
}
