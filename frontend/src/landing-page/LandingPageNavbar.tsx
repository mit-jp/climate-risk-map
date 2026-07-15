import { Link } from 'react-router-dom'
import css from '../Navigation.module.css'

function LandingPageNavbar() {
    return (
        <nav className={css.nav}>
            <Link to="/landing-page" className={css.a}>
                Launch STRESS
            </Link>
            <Link to="/supporters-and-collaborators" className={css.a}>
                Supporters and Collaborators
            </Link>
            <Link to="/tutorials-and-use-cases" className={css.a}>
                Tutorials and Use Cases
            </Link>
            <Link to="/publications-and-news" className={css.a}>
                Publications and News
            </Link>
            <Link to="/faq" className={css.a}>
                FAQ
            </Link>
        </nav>
    )
}

export default LandingPageNavbar
