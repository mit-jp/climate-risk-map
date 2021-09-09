import React from 'react';
import mstLogo from './MST-logo.jpg';
import mitLogo from './MIT-logo.svg';
import jointProgramLogo from './joint-program-logo.jpg'

const Header = () =>
    <header>
        <div id="mst-title">
            <img src={mstLogo} alt="Socio-Environmental Systems Risk Triage" id="mst-logo" />
            <div id="title-and-subtitle">
                <h1>Socio-Environmental Systems Risk Triage</h1>
                <p>
                    An open-science visualization platform to combine, overlay,
                    and diagnose landscapes of socioeconomic, health, and
                    environmental risk and injustice.
                </p>
            </div>
        </div>
        <a href="https://globalchange.mit.edu/"><img src={jointProgramLogo} id="joint-program-logo" alt="MIT Joint Program on The Science and Policy of Global Change" /></a>
        <a href="https://mit.edu/"><img src={mitLogo} alt="MIT" id="mit-logo" /></a>
    </header>

export default Header;