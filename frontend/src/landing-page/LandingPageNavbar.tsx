import { Link } from 'react-router-dom'
import css from '../Navigation.module.css'

function LandingPageNavbar() {
    return (
        <nav className={css.nav}>
            <Link to="/landing-page" className={css.a}>
                Welcome
            </Link>
            <Link to="/navbar1" className={css.a}>
                Navbar1
            </Link>
            <Link to="/navbar2" className={css.a}>
                Navbar2
            </Link>
        </nav>
    )
}

export default LandingPageNavbar
