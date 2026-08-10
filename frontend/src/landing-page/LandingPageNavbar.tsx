import { Link } from 'react-router-dom'
import { Button } from '@mui/material'
import css from '../Navigation.module.css'

function LandingPageNavbar() {
    return (
        <div className={css.navbar}>
            <nav className={css.nav}>
                <Link to="/landing-page" className={css.a}>
                    About
                </Link>
                <Link to="/supporters-and-collaborators" className={css.a}>
                    Supporters and Collaborators
                </Link>
                <Link to="/tutorials-and-use-cases" className={css.a}>
                    Tutorials and Use Cases
                </Link>
                <Link to="/resources" className={css.a}>
                    Resources
                </Link>
                <Link to="/faq" className={css.a}>
                    FAQ
                </Link>
                <Link to="/methodology" className={css.a}>
                    Methodology
                </Link>
            </nav>
            <Button component={Link} to="/" variant="contained" size="large">
                Launch the STRESS Platform
            </Button>
        </div>
    )
}

export default LandingPageNavbar
