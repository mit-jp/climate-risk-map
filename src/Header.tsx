import React from 'react';
import mstLogo from './MST-logo.jpg';
import mitLogo from './MIT-logo.svg';
import jointProgramLogo from './joint-program-logo.jpg'

const Header = () =>
    <header>
        <div id="mst-title">
            <img src={mstLogo} alt="Multi System Triage" id="mst-logo" />
            <h1>Multi-Systems Triage</h1>
        </div>
        <a href="https://globalchange.mit.edu/"><img src={jointProgramLogo} id="joint-program-logo" alt="MIT Joint Program on The Science and Policy of Global Change" /></a>
        <a href="https://mit.edu/"><img src={mitLogo} alt="MIT" id="mit-logo" /></a>
    </header>

export default Header;