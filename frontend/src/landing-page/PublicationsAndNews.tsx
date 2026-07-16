import { Container, Typography } from '@mui/material'
import css from './LandingPage.module.css'
import Header from '../Header'
import LandingPageNavbar from './LandingPageNavbar'

function PublicationsAndNews() {
    return (
        <div>
            <Header />
            <LandingPageNavbar />
            <main className={css.page}>
                <Container maxWidth="md" className={css.container}>
                    <Typography variant="h2" component="h1" className={css.title}>
                        Publications and News
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
                        ipsum prim
                    </Typography>
                </Container>
            </main>
        </div>
    )
}

export default PublicationsAndNews
