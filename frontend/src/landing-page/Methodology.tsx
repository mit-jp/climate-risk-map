import { Container, Typography } from '@mui/material'
import css from './LandingPage.module.css'
import methodologypage1 from './images/methodology_img1.png'
import methodologypage2 from './images/methodology_img2.png'
import Header from '../Header'
import LandingPageNavbar from './LandingPageNavbar'
import RiskFormula from './RiskFormula'
import CombinatoryScoreFormula from './CombinatoryScoreFormula'

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
                    <Typography variant="h6" component="p" className={css.subtitle}>
                        County-level USA-wide data that is uploaded can then be included in the
                        ‘combinatory metrics’ tab. The combinatory metrics tab shows ‘relative risk’
                        values, not the data in its native units. For each metric m, each county c
                        is given a ‘relative risk score’ which is calculated as its percentile when
                        compared to all other counties in the country:
                        <RiskFormula />
                        where rank is defined as the number of counties with values less than or
                        equal to county c and n is the total number of counties.
                    </Typography>
                    <img
                        src={methodologypage1}
                        alt="A map showing the hottest monthly temperature in the US"
                        className={css.aboutUsImg}
                    />
                    <Typography variant="subtitle1" className={css.caption}>
                        Data from the ERA5 reanalysis showing the hottest average monthly
                        temperature (in °C) from 2000-2019.
                    </Typography>
                    <img
                        src={methodologypage2}
                        alt="A map showing normalized hottest average monthly temperature in the US. Counties now have a relative risk score as opposed to showing the temperature in °C"
                        className={css.aboutUsImg}
                    />
                    <Typography variant="subtitle1" className={css.caption}>
                        Normalized values of the ERA5 reanalysis data of the hottest average monthly
                        temperature from 2000-2019. Note that counties have the same ordinal ranking
                        but now have a ‘relative risk score’ denoted by their percentile rankings,
                        as opposed to simply showing the temperature in °C.
                    </Typography>
                    <Typography variant="h6" component="p" className={css.subtitle}>
                        When multiple metrics are combined, a county’s relative risks (percentiles)
                        are averaged to produce a combinatory risk score:
                        <CombinatoryScoreFormula />
                        Where the assigned weight, W_m, for each individual normalized risk metric,
                        p_m,c, selected by the user is a constant value (from 0.1 to 1) across all
                        counties.
                    </Typography>
                </Container>
            </main>
        </div>
    )
}

export default Methodology
