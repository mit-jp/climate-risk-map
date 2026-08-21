import { Button, Container, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import css from './LandingPage.module.css'
import landingpage1 from './images/about_page_img1.png'
import landingpage2 from './images/about_page_img2.png'
import landingpage3 from './images/about_page_img3.png'
import landingpage4 from './images/about_page_img4.png'
import Header from '../Header'
import LandingPageNavbar from './LandingPageNavbar'

function LandingPage() {
    return (
        <div>
            <Header />
            <LandingPageNavbar />
            <main className={css.page}>
                <Container className={css.stressBackground}>
                    <Typography variant="h2" component="h1" className={css.title}>
                        Welcome to the STRESS Platform!
                    </Typography>
                    <Typography variant="h6" component="p" className={css.subtitle}>
                        The System for the Triage of Risks from Environmental and Socioeconomic
                        Stressors (STRESS) is an interactive mapping platform that allows users to
                        identify where there are relatively high levels of various socioeconomic and
                        environmental risk factors.
                    </Typography>
                    <Button component={RouterLink} to="/" variant="contained" size="large">
                        Launch the STRESS Platform
                    </Button>
                </Container>
                <Container className={css.container}>
                    <Typography variant="h4" component="h1" className={css.title}>
                        Why was STRESS created?
                    </Typography>
                    <Typography variant="h6" component="p" className={css.subtitle}>
                        Environmental, climate, and socioeconomic factors overlap spatially and
                        temporally to create areas of heightened susceptibility to harm. For
                        example, negative health impacts from heat and air pollution can compound
                        and have larger impacts in lower-income areas. It is important to identify
                        these areas to prioritize risk mitigation efforts, but capturing the
                        evolving relationships between different factors is challenging and resource
                        intensive, necessitating data collection, complex modeling, and deep
                        qualitative work.
                    </Typography>
                    <img
                        src={landingpage1}
                        alt="Different maps aggregated into one"
                        className={css.aboutUsImg}
                    />
                    <Typography variant="h6" component="p" className={css.subtitle}>
                        There are finite resources for research and intervention, so it is desirable
                        to have an efficient method to aggregate data for various metrics from
                        various sources and identify ‘relative risk hotspots’. STRESS was created to
                        meet this need by providing a platform for users to create relative risk
                        indicators that can then be used to inform further research or resource
                        allocation.
                    </Typography>
                    <Typography variant="h4" component="h1" className={css.title}>
                        What are STRESS’s current capabilities?
                    </Typography>
                    <Typography variant="h6" component="p" className={css.subtitle}>
                        STRESS currently allows users to create ‘combined relative risk’ scores for
                        counties across the United States by choosing amongst over 20 datasets
                        representing aspects of socioeconomic and environmental risk. The platform
                        percentile-ranks each county for each metric, then uses a user-weighted
                        average to calculate the combinatory risk score. Users are immediately shown
                        a map of these relative risks.
                    </Typography>
                    <img
                        src={landingpage2}
                        alt="Different maps aggregated into one"
                        className={css.aboutUsImg}
                    />
                    <Typography variant="h6" component="p" className={css.subtitle}>
                        For more information, users can click to zoom into a county; they will see
                        relative risk scores now calculated only relative to other counties in the
                        same state and they can view a ‘report card’ for their county
                    </Typography>
                    <img
                        src={landingpage3}
                        alt="Different maps aggregated into one"
                        className={css.aboutUsImg}
                    />
                    <img
                        src={landingpage4}
                        alt="Different maps aggregated into one"
                        className={css.aboutUsImg}
                    />
                    <Typography variant="h6" component="p" className={css.subtitle}>
                        In addition to allowing users to combine metrics, STRESS provides a
                        centralized platform where users can easily view over 100 USA wide
                        county-level datasets, over 20 country-level global datasets, and several
                        city-level datasets from local partnerships. Although STRESS does not
                        produce its own data, it provides an important service by bringing datasets
                        from various agencies into one platform to increase accessibility. <br />{' '}
                        <br />
                        Data and maps for all metrics can be downloaded and used for further
                        analysis or communication.
                    </Typography>
                </Container>
            </main>
        </div>
    )
}

export default LandingPage
