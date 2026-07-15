import { Accordion, AccordionDetails, AccordionSummary, Container, Typography } from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import css from './LandingPage.module.css'
import Header from '../Header'
import LandingPageNavbar from './LandingPageNavbar'

type FaqItem = {
    question: string
    answer: string
}

const faqItems: FaqItem[] = [
    {
        question: 'Where does the data come from?',
        answer: 'Data shown in STRESS comes from a variety of sources, many of which are federal organizations such as the United States Census Bureau or the National Aeronautics and Space Administration (NASA). You can view the source of any particular metric by clicking “"‘About the X Dataset”"’ below the map in STRESS.',
    },
    {
        question: 'Who is the platform for?',
        answer: 'STRESS is intended for a wide range of users including: citizens, scientists, businesses, community organizations, and policy makers at various levels. Users may be interested in a specific county, state, or the entire country. STRESS allows users to select and weight the metrics they want to combine. The identified ‘hotspots’ can then be used to inform public education efforts, advocacy, further research, investment in resiliency, and more.',
    },
    {
        question:
            'What is a combined risk score? How is it different from individual variables? What is the unit?',
        answer: 'A ‘combined risk score’ refers to a quantified, unitless, index that aims to show how one geographic unit compares to others when the users’ selected metrics are combined. When you select a metric in STRESS, the platform calculates a relative risk for each county by calculating its percentile: a county’s value is compared to the value of all other counties. For example, a county with a relative risk of 90 for ‘population under the federal poverty level’ means that it has a higher poverty level than 90% of counties in the United States. When you select multiple metrics, STRESS averages the relative risk scores for individual metrics. A county with a relative risk of 90 for poverty and 40 for extreme heat would receive a combined risk score of 65 if poverty and extreme heat are weighted equally. A county with a relative risk of 60 for poverty and 70 for extreme heat would also receive a combined risk score of 65. Although the combined risk score is calculated from percentiles, it is not itself a percentile. Moreover, it does not represent an absolute risk: a combined risk of 65 does not mean that there is a 65% chance of risk or that the risk is 65% as high as it could be. Combined risk scores are unitless and range from 0-100. Combined risk scores are meant to encapsulate accessible, screening-level information of where there are relatively high levels of multiple individual metrics.',
    },
    {
        question: 'Is the combinatory metric score showing me the ‘risk’?',
        answer: 'The combined risk score is a unitless metric ranging from 0-100 that aims to indicate how a county compares to other counties for the metrics selected: a higher value means that the county has relatively higher levels of undesirable metrics, such as poverty rates or extreme heat days, that could put the county ‘at risk’. While there are many different technical definitions of ‘risk,’ we use it broadly to refer to the potential of some future harm. This may also be referred to as vulnerability. The exact meaning of the combinatory metric will depend on what metrics you have combined.',
    },
    {
        question: 'Does STRESS show me all the factors that could influence a county’s ‘risk’?',
        answer: 'Although we strive to include a broad range of metrics, it is by no means exhaustive of all factors that could put a county at ‘risk’. We also seek to update data to provide the most contemporary view that we can. Some factors we do not yet have data for: accurate, comparable county level homelessness statistics are unavailable; the prevalence of air conditioning is not documented.Other factors are hard to quantify. How do you capture the governmental and social capacity to respond to an emergency? Or the cultural heritage that could be lost to environmental changes? Moreover, connections (or a lack of connections) between counties are not shown.Even for metrics currently in the platform, we do not yet have projected data, only historical. That is, we assume that counties that historically had extreme weather will continue to do so, and similarly that the demographic makeup of counties will be relatively stable. Although we do not have a better alternative, this could be a problematic assumption given our rapidly changing social and physical environments. ',
    },
    {
        question: 'Why is data at the county level? What if I want to see data for my city?',
        answer: 'STRESS is built on many publicly available datasets for environmental and socioeconomic metrics. In order to combine these datasets, they must be at a common granularity. Counties were chosen because they are large enough to have relatively high quality data for environmental and socioeconomic metrics. While data is available at the census tract level for many socioeconomic variables, the uncertainty in these estimates may be large: this can lead to geographic units being assigned different ‘relative risks’ when the underlying data is not precise enough to support this. Environmental data, for example on temperatures, may not be distinguishable at higher granularity.We recognize that county-level data is limited for several reasons such as; it can obscure meaningful differences between cities and neighbourhoods; many states lack county governance, creating a disconnect between the tool and courses of action. We are working on expanding STRESS’s capabilities to show city level data for select states or counties. National datasets are seldom available directly at the city-level, and stitching together many individual datasets can create inconsistencies and major gaps, which is why we have chosen a piecemeal approach. Although city level data will have greater uncertainties than county-level, it may be more powerful for users to understand risks at a geographic unit that matters to them. Please reach out to us at hhdbakha if you are interested in collaborating to adapt STRESS to your locality. ',
    },
    {
        question: 'What makes this different from other risk and vulnerability mapping platforms?',
        answer: 'STRESS is different from other risk and vulnerability mapping platform because it allows you to select and weight metrics for yourselves instead of just showing preconstructed metrics. We are also continually adding and updating metrics to provide the most holistic, relevant data we can. See chapter 1 of Rajput, H. (2026): When Identifying Risks Creates New Ones for more details on other platforms in the United States.',
    },
    {
        question: 'Are there planned updates or changes to the platform?',
        answer: 'We are continually updating and adding metrics to STRESS. We review our data sources to check for new data releases of existing metrics, such as demographic makeup. We also search for new metrics that could be included, such as tree cover data. If you notice any outdated metrics or have suggestions for new metrics to include, please contact us at HDHSFH.We are also exploring ways to communicate the complexity of risk indices. One update is adding multiple data sources for the same conceptual metric. For example, if you are interested in ‘high heat’ you could toggle between datasets for the number of annual heatwaves, average nighttime low temperature, deviation from historical average temperatures, etc. Another update is to allow users to toggle between different normalizations. Currently the platform uses percentiles, but we could also use min-max normalization, z-scores, or another ranking. Finally, we are working on communicating the statistical uncertainty in input data. Sociodemographic data from the American Community Survey includes confidence intervals, yet STRESS currently only takes in point estimates. We are considering visual ways of representing this uncertainty or quantitative methods of producing confidence intervals for relative risk scores. See more details in Chapter 5 of Rajput, 2026.',
    },
]

function FAQ() {
    return (
        <div>
            <Header />
            <LandingPageNavbar />
            <main className={css.page}>
                <Container maxWidth="md" className={css.container}>
                    <Typography variant="h2" component="h1" className={css.title}>
                        Frequently Asked Questions
                    </Typography>

                    <div className={css.faqList}>
                        {faqItems.map((faqItem) => (
                            <Accordion key={faqItem.question} className={css.accordion}>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography variant="subtitle1" component="span">
                                        {faqItem.question}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body1">{faqItem.answer}</Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </div>
                </Container>
            </main>
        </div>
    )
}

export default FAQ
