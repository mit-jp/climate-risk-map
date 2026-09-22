import { ReactNode } from 'react'
import CS3Logo from './CS3-logo.png'
import css from './Header.module.css'

function Header({ children }: { children?: ReactNode }) {
    return (
        <header>
            <a href="https://globalchange.mit.edu/">
                <img
                    src={CS3Logo}
                    className={css.cs3Logo}
                    alt="MIT Center for Sustainability Science and Strategy (CS3)"
                />
            </a>
            <div>
                <h1>
                    <abbr title="System to Triage Risks from Environmental & Socio-economic Stressors">
                        STRESS
                    </abbr>
                </h1>
                <p>System to Triage Risks from Environmental & Socio-economic Stressors</p>
            </div>
            {children}
        </header>
    )
}

export default Header
