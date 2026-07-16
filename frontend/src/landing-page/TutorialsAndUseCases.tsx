import { Container, Typography } from '@mui/material'
import css from './LandingPage.module.css'
import Header from '../Header'
import LandingPageNavbar from './LandingPageNavbar'

function TutorialsAndUseCases() {
    return (
        <div>
            <Header />
            <LandingPageNavbar />
            <main className={css.page}>
                <Container maxWidth="md" className={css.container}>
                    <Typography variant="h2" component="h1" className={css.title}>
                        Tutorials and Use Cases
                    </Typography>
                    <Typography variant="h6" component="p" className={css.subtitle}>
                        STRESS is a web-based platform that allows users to explore and visualize
                        the relative risk of climate change impacts across the United States. To
                        learn more, feel free to explore using the tabs above! Otherwise, click the
                        button below to launch STRESS!
                    </Typography>
                </Container>
            </main>
        </div>
    )
}

export default TutorialsAndUseCases
