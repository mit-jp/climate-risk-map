import { GitHub, Mail, RssFeed } from './ui'
import css from './Footer.module.css'

function Footer() {
    return (
        <footer id={css.footer}>
            <div id={css.address}>
                <p>MIT Center for Sustainability Science and Strategy (CS3)</p>
                <p>Massachusetts Institute of Technology • Cambridge, MA 02139</p>
            </div>
            <ul id={css.social}>
                <li>
                    <a
                        className="ui-icon-button"
                        aria-label="rss"
                        href="https://cs3.mit.edu/rss-feeds"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <RssFeed size={35} />
                    </a>
                </li>
                <li>
                    <a
                        className="ui-icon-button"
                        aria-label="mail"
                        href="http://eepurl.com/uV5Ur"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Mail size={35} />
                    </a>
                </li>
                <li>
                    <a
                        className="ui-icon-button"
                        aria-label="github"
                        href="http://github.com/cypressf/climate-risk-map"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <GitHub size={35} />
                    </a>
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
        </footer>
    )
}

export default Footer
