import React from 'react';
import { Facebook, Mail, RssFeed, Twitter } from '@material-ui/icons';
import { IconButton, Link } from '@material-ui/core';

const Footer = () =>
    <footer>
        <div id="address">
            <p>MIT Joint Program on the Science and Policy of Global Change</p>
            <p>Massachusetts Institute of Technology • Cambridge, MA 02139</p>
        </div>
        <ul id="social">
            <li>
                <IconButton
                    aria-label="facebook"
                    component={Link}
                    href="https://www.facebook.com/MITGlobalChange/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Facebook fontSize="large" style={{ color: "#fff" }} />
                </IconButton>
            </li>
            <li>
                <IconButton
                    aria-label="twitter"
                    component={Link}
                    href="https://twitter.com/mitglobalchange"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Twitter fontSize="large" style={{ color: "#fff" }} />
                </IconButton>
            </li>
            <li>
                <IconButton
                    aria-label="rss"
                    component={Link}
                    href="https://globalchange.mit.edu/rss-feeds"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <RssFeed fontSize="large" style={{ color: "#fff" }} />
                </IconButton>
            </li>
            <li>
                <IconButton
                    aria-label="mail"
                    component={Link}
                    href="http://eepurl.com/uV5Ur"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Mail fontSize="large" style={{ color: "#fff" }} />
                </IconButton>
            </li>
        </ul>
        <ul id="navigation">
            <li><a href="https://globalchange.mit.edu/about-us/our-purpose/contact-us">Contact Us</a></li>
            <li><a href="https://wikis.mit.edu/confluence/display/globalchange/Home">JP Staff &amp; Students</a></li>
            <li><a href="https://accessibility.mit.edu/">Accessibility</a></li>
        </ul>
    </footer>

export default Footer;