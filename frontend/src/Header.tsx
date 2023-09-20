import css from './Header.module.css'
import jointProgramLogo from './joint-program-logo.jpg'
import mitLogo from './MIT-logo.svg'

function Header() {
    return (
        <header className={css.header}>
            <div className={css.title}>
                <div className={css.titleAndSubtitle}>
                    <h1>STRESS Platform</h1>
                    <p>
                        <b>S</b>ystem for the <b>T</b>riage of <b>R</b>isks from <b>E</b>
                        nvironmental and <b>S</b>ocio-economic <b>S</b>tressors
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
