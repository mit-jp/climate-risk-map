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
                        lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.
                        Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies
                        sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a,
                        semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie,
                        enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper.
                        Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim.
                        Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras
                        vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit
                        odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante
                        ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
                        Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas
                        adipiscing ante non diam sodales hendrerit.
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
