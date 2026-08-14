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
                        <br />
                        Data comes from various sources (listed below each map), and some datasets
                        require cleaning, reformatting, or aggregation. <br /> <br />
                        Click below for more detailed information on how we address data
                        limitations:
                    </Typography>{' '}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6">
                                Data Cleaning and Aggregation Details
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body1">
                                Sometimes, even when it is the correct granularity, there is a
                                mismatch between the geographic boundaries in STRESS and the
                                geographies associated with the data. This can happen if geographic
                                units, such as counties, are redefined over time: newer data can be
                                associated with new county codes while STRESS has the old county
                                codes. If this happens there are two options: we can fully remove
                                these counties from the dataset, or if more granular data is
                                available (e.g. census tract data) we can download that and use a
                                ‘crosswalk’ to aggregate it to the county codes that are in STRESS.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Container>
            </main>
        </div>
    )
}

export default Methodology
