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
        question: 'What is the Climate Risk Map?',
        answer: 'It is an interactive landing-page experience for exploring climate risk topics and related information in one place.',
    },
    {
        question: 'How do I open a question?',
        answer: 'Click the question row. The answer slides open underneath it, and clicking the same row again closes it.',
    },
    {
        question: 'Do I need an account to use the FAQ page?',
        answer: 'No. The FAQ page is public and can be read without logging in or creating an account.',
    },
    {
        question: 'Where should I start if I am new to the site?',
        answer: 'Start with the landing page, then use the navigation bar to move to pages like this FAQ or the other landing-page sections.',
    },
    {
        question: 'Can I find more detail about the data and methods here?',
        answer: 'The FAQ gives a quick overview. For deeper detail, the site can link out to the more specific pages that explain data sources, use cases, and publications.',
    },
]

function FAQ() {
    return (
        <div>
            <Header />
            <LandingPageNavbar />
            <main className={`${css.page} ${css.faqPage}`}>
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
