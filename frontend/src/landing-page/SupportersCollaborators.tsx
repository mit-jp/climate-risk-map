import { Container, Typography } from '@mui/material'
import css from './LandingPage.module.css'
import biogenlogo from './images/biogen.png'
import doeLogo from './images/DOE_logo.png'
import nasaLogo from './images/nasa.png'
import eccf from './images/eccf.png'
import novartis from './images/novartis.png'
import Header from '../Header'
import LandingPageNavbar from './LandingPageNavbar'

function SupportersCollaborators() {
    return (
        <div>
            <Header />
            <LandingPageNavbar />
            <main className={css.page}>
                <Container maxWidth="md" className={css.container}>
                    <Typography variant="h2" component="h1" className={css.title}>
                        Supporters and Collaborators
                    </Typography>
                    <Typography variant="h6" component="p" className={css.subtitle}>
                        STRESS was created by researchers at and affiliates of MIT’s Center for
                        Sustainability Science and Strategy (formerly MIT’s Joint Program on the
                        Science and Policy of Global Change and MIT’s Center for Global Change
                        Science) and is funded by the DOE Multisector Dynamics Program. STRESS has
                        brought together researchers from fields including economics, computer
                        science, climate science, and science & technology studies. <br /> <br />
                        STRESS originated from an industry partner’s interest in identifying
                        locations with relatively low risks for siting operations. Since its
                        inception, STRESS has grown as a public-science tool. Recently we
                        collaborated with Essex County Community Foundation to explore how STRESS
                        could provide higher-granularity data to facilitate local decision-making
                        and communication around climate risks. Current partnerships across MIT are
                        working to integrate STRESS into projects on air pollution, extreme heat,
                        and flooding in partnership with researchers ranging from earth & planetary
                        scientists to urban planners. <br /> <br />
                        STRESS is an ongoing project and we seek new collaborators from all academic
                        disciplines, the public sector, and the private sector to iterate and
                        innovate. We are continually developing STRESS through diversifying and
                        updating datasets, improving the user interface, transparently communicating
                        STRESS’s capabilities and limits, and better integrating STRESS into current
                        communication of and decision making surrounding socioeconomic and
                        environmental risk; we welcome all partners in this work.
                    </Typography>
                    <div className={css.supportersLogos}>
                        <div className={css.roleItem}>
                            <img src={biogenlogo} alt="Biogen logo" className={css.logoimg} />
                            <Typography variant="subtitle1" className={css.roleLabel}>
                                Biogen
                            </Typography>
                        </div>
                        <div className={css.roleItem}>
                            <img src={doeLogo} alt="DOE logo" className={css.logoimg} />
                            <Typography variant="subtitle1" className={css.roleLabel}>
                                U.S. Department of Energy (DOE)
                            </Typography>
                        </div>
                        <div className={css.roleItem}>
                            <img
                                src={nasaLogo}
                                alt="NASA logo"
                                className={css.logoimg}
                                style={{ transform: 'scale(1.2)' }}
                            />
                            <Typography variant="subtitle1" className={css.roleLabel}>
                                U.S. National Aeronautics and Space Administration (NASA)
                            </Typography>
                        </div>
                        <div className={css.roleItem}>
                            <img src={eccf} alt="ECCF logo" className={css.logoimg} />
                            <Typography variant="subtitle1" className={css.roleLabel}>
                                Environmental and Climate Change Foundation (ECCF)
                            </Typography>
                        </div>
                        <div className={css.roleItem}>
                            <img src={novartis} alt="Novartis logo" className={css.logoimg} />
                            <Typography variant="subtitle1" className={css.roleLabel}>
                                Novartis
                            </Typography>
                        </div>
                    </div>
                </Container>
            </main>
        </div>
    )
}

export default SupportersCollaborators
