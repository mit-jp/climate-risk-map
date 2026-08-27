import React, { useState } from 'react'
import { Container, Typography } from '@mui/material'
import ScienceIcon from '@mui/icons-material/Science'
import PolicyIcon from '@mui/icons-material/Policy'
import PeopleIcon from '@mui/icons-material/People'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import css from './LandingPage.module.css'
import Header from '../Header'
import LandingPageNavbar from './LandingPageNavbar'
import { setTourActive } from '../appSlice'
import Scientists from './stakeholders/Scientists'
import Citizen from './stakeholders/Citizen'

type Stakeholder = 'scientists' | 'policy-makers' | 'community-group-members' | 'business-owners'

/** A placeholder to be removed once components for each stakeholder are created */
type StakeholderViewProps = {
    title: string
}

/** A placeholder to be removed once components for each stakeholder are created */
function StakeholderView({ title }: StakeholderViewProps) {
    return (
        <Typography variant="h4" component="h3" className={css.subtitle}>
            {title}
        </Typography>
    )
}

function TutorialsAndUseCases() {
    const [activeStakeholder, setActiveStakeholder] = useState<Stakeholder>('scientists')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGuidedTourClick = () => {
        dispatch(setTourActive(true))
        navigate('/')
    }

    const stakeholderViews: Record<Stakeholder, React.ReactNode> = {
        scientists: <Scientists />,
        'policy-makers': <StakeholderView title="State Policy Makers" />,
        'community-group-members': <Citizen />,
        'business-owners': <StakeholderView title="Business Owners" />,
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

                    <button
                        type="button"
                        onClick={handleGuidedTourClick}
                        className={css.guidedTourButton}
                    >
                        Learn how to use the STRESS platform through a guided tour!
                    </button>

                    <section className={css.sectionBlock}>
                        <Typography variant="h4" component="p" className={css.subtitle}>
                            Explore STRESS through the lens of different stakeholders!
                        </Typography>

                        <div className={css.rolesList}>
                            <button
                                type="button"
                                className={css.roleItem}
                                onClick={() => setActiveStakeholder('scientists')}
                            >
                                <ScienceIcon sx={{ fontSize: 90 }} />
                                <Typography variant="subtitle1" className={css.roleLabel}>
                                    Scientists
                                </Typography>
                            </button>

                            <button
                                type="button"
                                className={css.roleItem}
                                onClick={() => setActiveStakeholder('policy-makers')}
                            >
                                <PolicyIcon sx={{ fontSize: 90 }} />
                                <Typography variant="subtitle1" className={css.roleLabel}>
                                    State Policy Makers
                                </Typography>
                            </button>

                            <button
                                type="button"
                                className={css.roleItem}
                                onClick={() => setActiveStakeholder('community-group-members')}
                            >
                                <PeopleIcon sx={{ fontSize: 90 }} />
                                <Typography variant="subtitle1" className={css.roleLabel}>
                                    Concerned Citizens
                                </Typography>
                            </button>

                            <button
                                type="button"
                                className={css.roleItem}
                                onClick={() => setActiveStakeholder('business-owners')}
                            >
                                <BusinessCenterIcon sx={{ fontSize: 90 }} />
                                <Typography variant="subtitle1" className={css.roleLabel}>
                                    Business Owners
                                </Typography>
                            </button>
                        </div>
                    </section>

                    <section className={css.sectionBlock}>
                        {stakeholderViews[activeStakeholder]}
                    </section>
                </Container>
            </main>
        </div>
    )
}

export default TutorialsAndUseCases
