import { Container, Typography } from '@mui/material'
import css from './LandingPage.module.css'
import epaLogo from './images/EPA.png'
import doeLogo from './images/DOE_logo.jpg'
import nasaLogo from './images/nasa.png'
import congressBudgetLogo from './images/congress_budget.png'
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
                        Supporters and Collaborators TODO: Get collage of logos of supporters and
                        collaborators and add here
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
                            <img src={epaLogo} alt="EPA logo" />
                            <Typography variant="subtitle1" className={css.roleLabel}>
                                U.S. Environmental Protection Agency (EPA)
                            </Typography>
                        </div>
                        <div className={css.roleItem}>
                            <img src={doeLogo} alt="DOE logo" />
                            <Typography variant="subtitle1" className={css.roleLabel}>
                                U.S. Department of Energy (DOE)
                            </Typography>
                        </div>
                        <div className={css.roleItem}>
                            <img src={nasaLogo} alt="NASA logo" />
                            <Typography variant="subtitle1" className={css.roleLabel}>
                                U.S. National Aeronautics and Space Administration (NASA)
                            </Typography>
                        </div>
                        <div className={css.roleItem}>
                            <img src={congressBudgetLogo} alt="Congress Budget logo" />
                            <Typography variant="subtitle1" className={css.roleLabel}>
                                U.S. Congress Budget Office
                            </Typography>
                        </div>
                    </div>
                </Container>
            </main>
        </div>
    )
}

export default SupportersCollaborators
