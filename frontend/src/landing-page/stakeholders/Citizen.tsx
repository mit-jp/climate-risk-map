import { Container, Typography } from '@mui/material'
import css from '../LandingPage.module.css'
import landingpage2 from '../images/about_page_img2.png'

function Citizen() {
    return (
        <div>
            <Container className={css.container}>
                <Typography variant="h6" component="p" className={css.subtitle}>
                    Concerned citizens may be interested in all issues within their own county,
                    instead of being interested in a particular issue across the country or state.
                    This could be solely for curiosity, to inform their own efforts like research or
                    resiliency planning, or to inform advocacy efforts. <br /> <br /> They could use
                    the combinatory metrics tab to see how their county compares to see how various
                    metrics of interest compound (or don’t) in their county compared to the state or
                    country. Multiple different maps can be made, downloaded, and compared. <br />{' '}
                    <br />
                    In addition to combining metrics, the ‘report card’ in STRESS allows users to
                    easily see one county’s relative risk for multiple metrics. In any tab
                    (combinatory metrics, water, land, etc), if you click on a county it will zoom
                    into the state and allow you to click ‘View report card.’
                </Typography>
                <div className={css.imageRow}>
                    <img
                        src={landingpage2}
                        alt="Different maps aggregated into one"
                        className={css.aboutUsImg}
                    />
                    <img
                        src={landingpage2}
                        alt="Different maps aggregated into one"
                        className={css.aboutUsImg}
                    />
                </div>
                <Typography variant="h6" component="p" className={css.subtitle}>
                    The report card shows the county’s values for all metrics in the chosen
                    category. It shows the input data in its native unit, the percentile (relative
                    risk) calculated in comparison to the whole country, and the percentile
                    (relative risk) calculated in comparison to only the state. This display allows
                    a user to quickly see how their county compares to others while also providing
                    them with the input data, which can be used together to better understand the
                    nature and extent of a ‘risk’.
                </Typography>
                <Typography variant="h6" component="p" className={css.subtitle}>
                    The report card is particularly helpful to prioritize interventions within a
                    county. If a concerned citizen wants to get more involved in climate resiliency
                    in their community but they have limited time, they could assess whether
                    flooding or extreme heat poses a bigger threat to their community then look for
                    organizations to support.
                </Typography>
            </Container>
        </div>
    )
}

export default Citizen
