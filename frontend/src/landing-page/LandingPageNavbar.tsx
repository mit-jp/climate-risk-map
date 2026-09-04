import classNames from 'classnames'
import { Button } from '@mui/material'
import { Link, NavLink } from 'react-router-dom'
import css from '../Navigation.module.css'

const navigationItems = [
    { label: 'About', to: '/landing-page', end: true },
    { label: 'Supporters and Collaborators', to: '/supporters-and-collaborators' },
    { label: 'Tutorials and Use Cases', to: '/tutorials-and-use-cases' },
    { label: 'Resources', to: '/resources' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Methodology', to: '/methodology' },
]

function LandingPageNavbar() {
    return (
        <div className={css.navbar}>
            <nav className={css.nav}>
                {navigationItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                            classNames(css.a, {
                                [css.selected]: isActive,
                            })
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <Button component={Link} to="/" variant="contained" size="large">
                Launch the STRESS Platform
            </Button>
        </div>
    )
}

export default LandingPageNavbar
