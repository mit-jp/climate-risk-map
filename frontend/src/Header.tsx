import climateRiskLogo from './climate-risk-logo.jpg'
import mitLogo from './MIT-logo.svg'
import jointProgramLogo from './joint-program-logo.jpg'
import css from './Header.module.css'

function Header() {
    return (
        <header id={css.header}>
            <div id={css.title}>
                <img
                    src={climateRiskLogo}
                    alt="Socio-Environmental Systems Risk Triage"
                    id={css.climateRiskLogo}
                />
                <div id={css.titleAndSubtitle}>
                    <h1>Socio-Environmental Systems Risk Triage</h1>
                    <p>
                        An open-science visualization platform to combine, overlay, and diagnose
                        landscapes of socioeconomic, health, and environmental risk and injustice.
                    </p>
                </div>
            </div>
            <a href="https://globalchange.mit.edu/">
                <img
                    src={jointProgramLogo}
                    id={css.jointProgramLogo}
                    alt="MIT Joint Program on The Science and Policy of Global Change"
                />
            </a>
            <a href="https://mit.edu/">
                <img src={mitLogo} alt="MIT" id={css.mitLogo} />
            </a>
        </header>
    )
}

export default Header
