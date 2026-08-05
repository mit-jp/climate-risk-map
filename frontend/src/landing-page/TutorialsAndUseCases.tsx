import { Container, Typography } from '@mui/material'
import ScienceIcon from '@mui/icons-material/Science'
import PolicyIcon from '@mui/icons-material/Policy'
import PeopleIcon from '@mui/icons-material/People'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import css from './LandingPage.module.css'
import Header from '../Header'
import LandingPageNavbar from './LandingPageNavbar'

function TutorialsAndUseCases() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return (
        <div>
            <Header />
            <LandingPageNavbar />
            <main className={css.page}>
                <Container className={css.container}>
                    <Typography variant="h2" component="h1" className={css.title}>
                        Tutorials and Use Cases
                    </Typography>
                    <Typography variant="h4" component="h3" className={css.subtitle}>
                        General Uses
                    </Typography>
                    <Typography variant="h6" component="p" className={css.subtitle}>
                        STRESS is intended for a wide range of users including: citizens,
                        scientists, businesses, community organizations, and policy makers at
                        various levels. Although all may be broadly interested in understanding and
                        mitigating social and environmental risk, this broad user base will have
                        heterogenous values, goals, interests, and capacities to respond. Below are
                        some brief examples of ways in which STRESS could conceivably assist
                        different users in the types of tasks they ordinarily perform. This is by no
                        means exhaustive, and users’ needs may overlap the provided examples, but
                        the examples aim to illustrate potential uses. In addition to the
                        combinatory metrics, STRESS aims to provide accessible data visualizations
                        for over 100 metrics. Images can be saved and used in reports if desired,
                        and data can be downloaded for further analysis if desired. Original data
                        sources are linked in STRESS and can be explored further.
                    </Typography>
                    <Typography variant="h4" component="p" className={css.subtitle}>
                        Explore STRESS through the lens of different stakeholders!
                    </Typography>
                    <div className={css.rolesList}>
                        {/* Todo: Split each of these off into their own typescript files */}
                        <button
                            type="button"
                            className={css.roleItem}
                            onClick={() => scrollToSection('scientists-section')}
                        >
                            <ScienceIcon sx={{ fontSize: 90 }} />
                            <Typography variant="subtitle1" className={css.roleLabel}>
                                Scientists
                            </Typography>
                        </button>
                        <button
                            type="button"
                            className={css.roleItem}
                            onClick={() => scrollToSection('policy-makers-section')}
                        >
                            <PolicyIcon sx={{ fontSize: 90 }} />
                            <Typography variant="subtitle1" className={css.roleLabel}>
                                State Policy Makers
                            </Typography>
                        </button>
                        <button
                            type="button"
                            className={css.roleItem}
                            onClick={() => scrollToSection('community-group-members-section')}
                        >
                            <PeopleIcon sx={{ fontSize: 90 }} />
                            <Typography variant="subtitle1" className={css.roleLabel}>
                                Community Group Members
                            </Typography>
                        </button>
                        <button
                            type="button"
                            className={css.roleItem}
                            onClick={() => scrollToSection('business-owners-section')}
                        >
                            <BusinessCenterIcon sx={{ fontSize: 90 }} />
                            <Typography variant="subtitle1" className={css.roleLabel}>
                                Business Owners
                            </Typography>
                        </button>
                    </div>
                    <Typography
                        variant="h4"
                        component="h3"
                        className={css.subtitle}
                        id="scientists-section"
                    >
                        Scientists
                    </Typography>
                    <Typography
                        variant="h4"
                        component="h3"
                        className={css.subtitle}
                        id="policy-makers-section"
                    >
                        Policy Makers
                    </Typography>
                    <Typography
                        variant="h4"
                        component="h3"
                        className={css.subtitle}
                        id="community-group-members-section"
                    >
                        Community Group Members
                    </Typography>
                    <Typography
                        variant="h4"
                        component="h3"
                        className={css.subtitle}
                        id="business-owners-section"
                    >
                        Business Owners
                    </Typography>
                </Container>
            </main>
        </div>
    )
}

export default TutorialsAndUseCases
