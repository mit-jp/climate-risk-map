import css from './Header.module.css'
import CS3Logo from './CS3-logo.png'

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
                    src={CS3Logo}
                    className={css.CS3Logo}
                    alt="MIT Center for Sustainability Science and Strategy (CS3)"
                />
            </a>
        </header>
    )
}

export default Header
