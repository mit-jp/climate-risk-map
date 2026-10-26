import { Container, Typography } from '@mui/material'
import css from '../LandingPage.module.css'
import landingpage2 from '../images/about_page_img2.png'

function Scientists() {
    return (
        <div>
            <Container className={css.container}>
                <Typography variant="h6" component="p" className={css.subtitle}>
                    Scientists are often engaged in high granularity, computationally intensive
                    modelling of coupled human-environmental systems. Because the work is so
                    resource intensive, scientists are rarely able to model the whole country and
                    want to know where to focus their study. <br /> <br /> Suppose a research group
                    is studying the health effects of wildfires. The places with the greatest ‘risk’
                    may be those with high likelihood of wildfires, an already high exposure to
                    pollution, and a population that may have more preexisting health conditions.
                    Researchers may go on STRESS and combine: exposure to airborne particulate
                    matter, population over 65, and wildfire risk to identify ‘hotspots’ with
                    relatively high levels of these metrics. They can select different pairs of
                    these metrics and weight them to identify relative contributions of the
                    different individual metrics to the combinatory risk.
                </Typography>
                <img
                    src={landingpage2}
                    alt="Different maps aggregated into one"
                    className={css.aboutUsImg}
                />
                <Typography variant="h6" component="p" className={css.subtitle}>
                    They can also go into the other tabs – land, health, and demographics – to see
                    these in their native units. Because STRESS is aimed only as a screening tool
                    for ‘relative risk’, and this requires making different metrics commensurable,
                    expert judgments on the meaning of different metrics can add crucial information
                    when interpreting data from STRESS.
                </Typography>
                <Typography variant="h6" component="p" className={css.subtitle}>
                    Combining these metrics could suggest that they focus more fine grained
                    attention on northern Idaho and western Montana. The exact next steps depend on
                    what exactly the research project is. If it is focused on modelling the
                    atmosphere, identifying this general region may be sufficient. If it is focused
                    on understanding social responses to air pollution, focusing on specific
                    counties or cities may be useful. STRESS is intended not to dictate what to do,
                    but to provide screening level information that can then be interrogated and
                    built on with personal and expert knowledge.
                </Typography>
            </Container>
        </div>
    )
}

export default Scientists
