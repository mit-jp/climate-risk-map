import css from './Header.module.css'
import jointProgramLogo from './joint-program-logo.jpg'
import mitLogo from './MIT-logo.svg'

function Header() {
    return (
        <header className={css.header}>
            <div className={css.title}>
                <div className={css.titleAndSubtitle}>
                    <h1>STRESS Tool</h1>
                    <p>
                        System for the Triage of Risks from Environmental and Socio-Economic
                        Stressors.
                    </p>
                </div>
            </div>
            <a href="https://globalchange.mit.edu/">
                <img
                    src={jointProgramLogo}
                    className={css.jointProgramLogo}
                    alt="MIT Joint Program on The Science and Policy of Global Change"
                />
            </a>
            <a href="https://mit.edu/">
                <img src={mitLogo} alt="MIT" className={css.mitLogo} />
            </a>
        </header>
    )
}

export default Header
