import { BrowserRouter as Router } from 'react-router-dom'
import RegionNavigation from '../CountryNavigation'

export default {
    title: 'CountryNavigation',
}
export const USASelected = () => {
    return (
        <Router>
            <RegionNavigation />
        </Router>
    )
}
