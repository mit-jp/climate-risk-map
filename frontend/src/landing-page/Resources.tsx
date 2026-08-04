import { Container, Typography } from '@mui/material'
import css from './LandingPage.module.css'
import Header from '../Header'
import LandingPageNavbar from './LandingPageNavbar'

interface ResourceItem {
    title: string
    summary: string
    citation: string
    href: string
    linkLabel: string
}

const publications: ResourceItem[] = [
    {
        title: 'Assessing Compounding Risks Across Multiple Systems and Sectors',
        summary:
            'Foundational STRESS publication describing motivation, methodology, and use cases. Good first read for understanding the platform.',
        citation:
            'Schlosser, C. A., Frankenfeld, C., Eastham, S., Gao, X., Gurgel, A., McCluskey, A., Morris, J., Orzach, S., Rouge, K., Paltsev, S., & Reilly, J. (2023). Frontiers in Climate, 5.',
        href: 'https://doi.org/10.3389/fclim.2023.1100600',
        linkLabel: 'Read publication (DOI)',
    },
    {
        title: 'When Identifying Risks Creates New Ones',
        summary:
            'Master thesis discussing STRESS methodology limits and future development opportunities, including uncertainty visualization and normalization comparisons.',
        citation: 'Rajput, H. (2026). MS Thesis, Technology and Policy Program, MIT.',
        href: 'https://dspace.mit.edu/',
        linkLabel: 'View thesis source',
    },
    {
        title: '2025 Global Change Outlook',
        summary:
            'Demonstrates use of STRESS to direct more computationally intensive modeling of water stress and precipitation under policy scenarios.',
        citation:
            'Paltsev, S., Schlosser, C. A., et al. (2025). MIT Center for Sustainability Science and Strategy.',
        href: 'https://cs3.mit.edu/publications/signature/2025-global-change-outlook',
        linkLabel: 'Read report',
    },
]

const newsAndMore: ResourceItem[] = [
    {
        title: "Hooked on Heating Oil: Maine's Reliance on a Dirty, Expensive Fuel",
        summary:
            'Uses STRESS indicators to show high energy expenditures and poverty as compounding economic and health risks in Maine.',
        citation: 'Media feature using STRESS outputs for regional risk interpretation.',
        href: 'https://cs3.mit.edu/',
        linkLabel: 'Read coverage',
    },
    {
        title: 'Environmental and Socio-Economic Stress in the Mountain West',
        summary:
            'UNLV fact sheet applying STRESS-aligned framing to publicly accessible, policy-relevant regional indicators.',
        citation:
            'Atici, A., Saladino, C. J., Nasoz, F., Brown, W. E. (2023). Environment Fact Sheet No. 16, 1-2.',
        href: 'https://oasis.library.unlv.edu/bmw_lincy_env/16',
        linkLabel: 'Read fact sheet',
    },
    {
        title: 'Computational Model Finds Hot Spots Where Risks Converge',
        summary:
            'Introduces STRESS as a county-level screening tool for identifying areas where physical, demographic, and transition risks overlap.',
        citation: 'MIT Joint Program / CS3 feature article on the STRESS platform.',
        href: 'https://cs3.mit.edu/',
        linkLabel: 'Read feature',
    },
]

function ResourceCard({ item }: { item: ResourceItem }) {
    return (
        <article className={css.resourceCard}>
            <div className={css.resourceMain}>
                <Typography variant="h5" component="h3" className={css.resourceTitle}>
                    {item.title}
                </Typography>
                <Typography variant="body1" component="p" className={css.resourceSummary}>
                    {item.summary}
                </Typography>
            </div>

            <aside className={css.resourceMeta}>
                <Typography variant="body2" component="p" className={css.resourceCitation}>
                    {item.citation}
                </Typography>
                <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={css.resourceLink}
                >
                    {item.linkLabel}
                </a>
            </aside>
        </article>
    )
}

function Resources() {
    return (
        <div>
            <Header />
            <LandingPageNavbar />
            <main className={css.page}>
                <Container maxWidth="lg" className={css.container}>
                    <Typography variant="h2" component="h1" className={css.title}>
                        Resources
                    </Typography>

                    <section className={css.sectionBlock}>
                        <Typography variant="h4" component="h2" className={css.sectionHeading}>
                            GitHub
                        </Typography>
                        <Typography variant="body1" component="p" className={css.sectionIntro}>
                            STRESS is open-source under GNU GPL v3.0. We continuously update
                            platform datasets, so map-specific downloads inside STRESS are the
                            authoritative source for each metric.
                        </Typography>
                        <a
                            href="https://github.com/mit-jp/climate-risk-map"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={css.githubLink}
                        >
                            View the code repository
                        </a>
                    </section>

                    <section className={css.sectionBlock}>
                        <Typography variant="h4" component="h2" className={css.sectionHeading}>
                            Publications
                        </Typography>
                        <Typography variant="body2" component="p" className={css.sectionNote}>
                            Note: STRESS evolves over time. For current methods and data details,
                            prioritize the platform Methodology tab and in-app dataset
                            documentation.
                        </Typography>
                        <div className={css.resourceList}>
                            {publications.map((item) => (
                                <ResourceCard key={item.title} item={item} />
                            ))}
                        </div>
                    </section>

                    <section className={css.sectionBlock}>
                        <Typography variant="h4" component="h2" className={css.sectionHeading}>
                            News and More
                        </Typography>
                        <div className={css.resourceList}>
                            {newsAndMore.map((item) => (
                                <ResourceCard key={item.title} item={item} />
                            ))}
                        </div>
                    </section>
                </Container>
            </main>
        </div>
    )
}

export default Resources
