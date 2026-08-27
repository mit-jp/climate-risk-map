import { Accordion, AccordionDetails, AccordionSummary, Container, Typography } from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import css from './LandingPage.module.css'
import Header from '../Header'
import LandingPageNavbar from './LandingPageNavbar'

function Methodology() {
    return (
        <div>
            <Header />
            <LandingPageNavbar />
            <main className={css.page}>
                <Container className={css.container}>
                    <Typography variant="h2" component="h1" className={css.title}>
                        Methodology
                    </Typography>
                    <Typography variant="h6" component="p" className={css.subtitle}>
                        STRESS has three key functionalities:{' '}
                    </Typography>{' '}
                    <Typography component="div" className={css.subtitle}>
                        <ol>
                            <li>
                                It brings datasets from multiple sources together into one platform
                                so users can easily view mapped data for many metrics in one
                                website.{' '}
                            </li>
                            <li>
                                It lets users select multiple metrics and combine them into a
                                combinatory risk score based on how geographic units compare to each
                                other.
                            </li>
                            <li>
                                Provides broad metric coverage, including USA-wide county-level
                                metrics, world-wide country-level metrics, and county-wide
                                city-level metrics across Water, Land, Economy, Energy, Climate
                                Opinions, Demographics, Health, Biodiversity, Transportation, and
                                Extreme Events.
                            </li>
                        </ol>
                    </Typography>
                    <Typography variant="body1" className={css.subtitle}>
                        County-level USA-wide data that is uploaded can then be included in the
                        ‘combinatory metrics’ tab. The combinatory metrics tab shows ‘relative risk’
                        values, not the data in its native units. For each metric m, each county c
                        is given a ‘relative risk score’ which is calculated as its percentile when
                        compared to all other counties in the country:
                        <br /> <br /> relative riskm,c=percentilem,c = pm,c = rankm,cn*100
                        <br /> <br /> where rank is defined as the number of counties with values
                        less than or equal to county c and n is the total number of counties.
                    </Typography>
                </Container>
            </main>
        </div>
    )
}

export default Methodology
