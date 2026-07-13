import { Button, Container, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import css from './LandingPage.module.css'
import Header from '../Header'
import LandingPageNavbar from './LandingPageNavbar'

function LandingPage() {
    return (
        <div>
            <Header />
            <LandingPageNavbar />
            <main className={css.page}>
                <Container maxWidth="md" className={css.container}>
                    <Typography variant="overline" className={css.kicker}>
                        STRESS Platform
                    </Typography>
                    <Typography variant="h2" component="h1" className={css.title}>
                        [lorem ipsum dolor sit ametc]
                    </Typography>
                    <Typography variant="h6" component="p" className={css.subtitle}>
                        [lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud]
                    </Typography>
                    <Button
                        component={RouterLink}
                        to="/"
                        variant="contained"
                        size="large"
                        className={css.cta}
                    >
                        Launch the STRESS Platform
                    </Button>
                </Container>
            </main>
        </div>
    )
}

export default LandingPage
