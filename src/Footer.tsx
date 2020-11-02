import React from 'react';
import icon_facebook  from './icon_facebook.png';
import icon_twitter  from './icon_twitter.png';
import icon_rss  from './icon_rss.png';
import icon_mail  from './icon_mail.png';

const Footer = () =>
    <footer>
        <div id="address">
            <p>MIT Joint Program on the Science and Policy of Global Change</p>
            <p>Massachusetts Institute of Technology • Cambridge, MA 02139</p>
        </div>
        <ul id="social">
            <li><a href="https://www.facebook.com/MITGlobalChange/" target="_blank" rel="noopener noreferrer"><img alt="Facebook icon" src={icon_facebook} width="34" height="34" /></a></li>
            <li><a href="https://twitter.com/mitglobalchange" target="_blank" rel="noopener noreferrer"><img alt="Twitter icon" src={icon_twitter} width="34" height="34" /></a></li>
            <li><a href="https://globalchange.mit.edu/rss-feeds"><img alt="RSS Icon" src={icon_rss} width="34" height="34" /></a></li>
            <li><a href="http://eepurl.com/uV5Ur"><img alt="Mail Icon" src={icon_mail} width="38" height="26" /></a></li>
        </ul>
        <ul id="navigation">
            <li><a href="https://globalchange.mit.edu/about-us/our-purpose/contact-us">Contact Us</a></li>
            <li><a href="https://wikis.mit.edu/confluence/display/globalchange/Home">JP Staff &amp; Students</a></li>
            <li><a href="https://accessibility.mit.edu/">Accessibility</a></li>
        </ul>
    </footer>

export default Footer;