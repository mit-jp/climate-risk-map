import { Container, Typography } from '@mui/material'
import css from '../LandingPage.module.css'
import landingpage2 from '../images/about_page_img2.png'

function Business() {
    return (
        <div>
            <Container className={css.container}>
                <Typography variant="h6" component="p" className={css.subtitle}>
                    A business owner may be interested in relocating or opening a new operation.
                    They want to ensure that they can succeed given both the economic and
                    environmental conditions. This includes having access to infrastructure, such as
                    highways and railroads, that can efficiently transport goods. Suppose a food
                    processing business that grows and processes crops is being offered an incentive
                    to move their operations to a certain city. They want access to reliable
                    infrastructure, minimal flood and drought risk, and an economy and workforce who
                    can support their business. They can individually view and combine metrics such
                    as: water stress, water quality, flood risk, temperature stress, highly erodible
                    cropland, poverty level, unemployment rate, population over 65, and population
                    under 18.
                </Typography>
                <img
                    src={landingpage2}
                    alt="Different maps aggregated into one"
                    className={css.aboutUsImg}
                />
                <Typography variant="h6" component="p" className={css.subtitle}>
                    When combining metrics they may weight environmental metrics more heavily than
                    socioeconomic because they believe that the socioeconomic are more malleable:
                    employees can move and policies can improve the economy. A combinatory risk can
                    be very useful to compare their current location to a proposed new one, or to
                    compare multiple new locations. <br /> <br /> Viewing metrics individually and
                    using the ‘report card’ for the county they are interested in could help discern
                    the contribution of different factors to the overall risk and consider how these
                    metrics may impact their business or how they could be mitigated.
                </Typography>
                <img
                    src={landingpage2}
                    alt="Different maps aggregated into one"
                    className={css.aboutUsImg}
                />
                <Typography variant="h6" component="p" className={css.subtitle}>
                    On top of any map, STRESS allows users to overlay infrastructure including
                    highways, railways, and marine highways. While this is not quantitatively
                    integrated into a combinatory metric, this can show if there is easy access to a
                    town or if there is redundancy in infrastructure in case of extreme weather.
                </Typography>
                <img
                    src={landingpage2}
                    alt="Different maps aggregated into one"
                    className={css.aboutUsImg}
                />
                <Typography variant="h6" component="p" className={css.subtitle}>
                    Starting from the data in STRESS, a business owner can discuss their concerns
                    with the location that is incentivizing them. This can surface other data, such
                    as connections to food distributors, workplace training, planned infrastructure
                    upgrades, and more that can support an informed decision.
                </Typography>
            </Container>
        </div>
    )
}

export default Business
