import { GitHub, Mail, RssFeed } from '@mui/icons-material'
import { IconButton, Link } from '@mui/material'
import css from './Footer.module.css'
import ViewTourButton from './tour/ViewTourButton'

function Footer() {
    return (
        <footer id={css.footer}>
            <div id={css.address}>
                <p>MIT Center for Sustainability Science and Strategy (CS3)</p>
                <p>Massachusetts Institute of Technology • Cambridge, MA 02139</p>
            </div>
            <ul id={css.social}>
                <li>
                    <IconButton
                        aria-label="rss"
                        component={Link}
                        href="https://cs3.mit.edu/rss-feeds"
                        target="_blank"
                        rel="noopener noreferrer"
                        size="large"
                    >
                        <RssFeed fontSize="large" style={{ color: '#fff' }} />
                    </IconButton>
                </li>
                <li>
                    <IconButton
                        aria-label="mail"
                        component={Link}
                        href="http://eepurl.com/uV5Ur"
                        target="_blank"
                        rel="noopener noreferrer"
                        size="large"
                    >
                        <Mail fontSize="large" style={{ color: '#fff' }} />
                    </IconButton>
                </li>
                <li>
                    <IconButton
                        aria-label="github"
                        component={Link}
                        href="http://github.com/cypressf/climate-risk-map"
                        target="_blank"
                        rel="noopener noreferrer"
                        size="large"
                    >
                        <GitHub fontSize="large" style={{ color: '#fff' }} />
                    </IconButton>
                </li>
            </ul>
            <ul id={css.navigation}>
                <li>
                    <a href="https://cs3.mit.edu/about-us/our-purpose/contact-us">Contact Us</a>
                </li>
                <li>
                    <a href="https://cs3.mit.edu/about-us/personnel">CS3 Staff &amp; Students</a>
                </li>
                <li>
                    <a href="https://accessibility.mit.edu/">Accessibility</a>
                </li>
            </ul>
            <ViewTourButton />
        </footer>
    )
}

export default Footer
