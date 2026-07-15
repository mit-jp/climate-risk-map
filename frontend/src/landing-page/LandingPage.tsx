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
                    <Typography variant="h2" component="h1" className={css.title}>
                        Welcome to the STRESS Platform!
                    </Typography>
                    <Typography variant="h6" component="p" className={css.subtitle}>
                        STRESS is a web-based platform that allows users to explore and visualize
                        the relative risk of climate change impacts across the United States. To
                        learn more, feel free to explore using the tabs above! Otherwise, click the
                        button below to launch STRESS!
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
