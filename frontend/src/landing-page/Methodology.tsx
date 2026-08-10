import { Button, Container, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import css from './LandingPage.module.css'
import Header from '../Header'
import LandingPageNavbar from './LandingPageNavbar'

function Methodology() {
    return (
        <div>
            <Header />
            <LandingPageNavbar />
            <main className={css.page}>
                <Container className={css.stressBackground}>
                    <Typography variant="h2" component="h1" className={css.title}>
                        Methodology
                    </Typography>
                    <Typography variant="h6" component="p" className={css.subtitle}>
                        STRESS is a web-based platform that allows users to explore and visualize
                        the relative risk of climate change impacts across the United States. To
                        learn more, feel free to explore using the tabs above! Otherwise, click the
                        button below to launch STRESS!
                    </Typography>
                    <Button component={RouterLink} to="/" variant="contained" size="large">
                        Launch the STRESS Platform
                    </Button>
                </Container>
                <Container className={css.container}>
                    <Typography variant="h4" component="h1" className={css.title}>
                        What is STRESS?
                    </Typography>
                    <Typography variant="h6" component="p" className={css.subtitle}>
                        Environmental, climate, and socioeconomic factors overlap spatially and
                        temporally to create areas of heightened susceptibility to harm. For
                        example, negative health impacts from heat and air pollution can compound
                        and these impacts will be greatest in places with an older population and
                        more outdoor workers. Capturing the evolving relationships between different
                        factors is challenging and resource intensive, necessitating data
                        collection, complex modeling, and deep qualitative work. We want to keep
                        communities safe, but we do not have the resources to invest in resiliency
                        measures everywhere, nor do we have the resources to rigorously understand
                        all of these interactions everywhere. Given this, it is desirable to create
                        relative risk indicators that summarize and aggregate data from various
                        sources to show where there are relatively high levels of various metrics.
                        Resources – ranging from material investment in resiliency to further
                        research – can then be allocated to ‘hotspots’ with high indication of
                        relative risk, where they might have the greatest impact in reducing risk.
                        Thus the Center for Sustainability Science and Strategy (CS3) created
                        STRESS, the System for the Triage of Risks from Environmental and
                        Socioeconomic Stressors.
                    </Typography>
                    <Typography variant="h4" component="h1" className={css.title}>
                        How does STRESS work?
                    </Typography>
                    <Typography variant="h6" component="p" className={css.subtitle}>
                        STRESS is a publicly available platform that enables people to select,
                        weight, and combine various socioeconomic and environmental factors to
                        identify these ‘risk hotspots.’ STRESS currently allows users to create
                        ‘combined relative risk scores’ for counties across the United States. Users
                        can choose amongst over 20 datasets representing aspects of socioeconomic
                        and environmental risk. The platform percentile-ranks each county for each
                        metric, then averages these percentiles using the users’ weighting to
                        calculate the combinatory risk score. Users are immediately shown a USA-wide
                        county level map of these relative risks. For more information, users can
                        click to zoom into a county; they will see relative risk scores now
                        calculated only relative to other counties in the same state and they can
                        view a ‘report card’ for their county. While many risk and vulnerability
                        index mapping platforms exist, STRESS differentiates itself by allowing
                        users to select and weight metrics for themselves, as opposed to providing
                        pre-constructed indices. This makes it adaptable to the needs of a diverse
                        user base with differing values, interests, background knowledge, goals, and
                        abilities to intervene. In addition to allowing users to combine metrics,
                        STRESS provides a centralized platform where users can easily view over 100
                        USA wide county-level datasets, over 20 country-level global datasets, and
                        several city-level datasets from local partnerships. Although STRESS does
                        not produce its own data, it provides an important service by bringing
                        datasets from various agencies into one platform to increase accessibility.
                        We are continually updating STRESS with a broad range of up-to-date datasets
                        and forming new partnerships.
                    </Typography>
                </Container>
            </main>
        </div>
    )
}

export default Methodology
