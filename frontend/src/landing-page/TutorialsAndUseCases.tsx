import { Container, Typography } from '@mui/material'
import ScienceIcon from '@mui/icons-material/Science'
import PolicyIcon from '@mui/icons-material/Policy'
import PeopleIcon from '@mui/icons-material/People'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import css from './LandingPage.module.css'
import Header from '../Header'
import LandingPageNavbar from './LandingPageNavbar'

function TutorialsAndUseCases() {
    return (
        <div>
            <Header />
            <LandingPageNavbar />
            <main className={css.page}>
                <Container maxWidth="md" className={css.container}>
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
                        Explore STRESS through the lens of different careers!
                    </Typography>
                    <div className={css.rolesList}>
                        <div className={css.roleItem}>
                            <ScienceIcon sx={{ fontSize: 90 }} />
                            <Typography variant="subtitle1" className={css.roleLabel}>
                                Scientists
                            </Typography>
                        </div>
                        <div className={css.roleItem}>
                            <PolicyIcon sx={{ fontSize: 90 }} />
                            <Typography variant="subtitle1" className={css.roleLabel}>
                                State Policy Makers
                            </Typography>
                        </div>
                        <div className={css.roleItem}>
                            <PeopleIcon sx={{ fontSize: 90 }} />
                            <Typography variant="subtitle1" className={css.roleLabel}>
                                Community Group Members
                            </Typography>
                        </div>
                        <div className={css.roleItem}>
                            <BusinessCenterIcon sx={{ fontSize: 90 }} />
                            <Typography variant="subtitle1" className={css.roleLabel}>
                                Business Owners
                            </Typography>
                        </div>
                    </div>
                </Container>
            </main>
        </div>
    )
}

export default TutorialsAndUseCases
