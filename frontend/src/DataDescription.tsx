import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import css from './DataDescription.module.css'

function DataDescription({ name, description }: { name: string; description: string }) {
    return (
        <div className={css.dataDescription}>
            <Accordion
                sx={{
                    width: 'fit-content',
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                        backgroundColor: 'rgb(238, 238, 238)',
                        fontWeight: '400',
                        minHeight: '40px',
                    }}
                >
                    About the {name} data
                </AccordionSummary>
                <AccordionDetails>{description}</AccordionDetails>
            </Accordion>
        </div>
    )
}

export default DataDescription
