import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import css from './DataDescription.module.css'
import { DataSource } from './MapVisualization'

function DataSourceDescription({ dataSource }: { dataSource: DataSource }) {
    return (
        <div className={css.dataDescription}>
            <Accordion
                sx={{
                    width: '60%',
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
                    About the {dataSource.name} dataset
                </AccordionSummary>
                <AccordionDetails>
                    <p>{dataSource.description}</p>
                    <p>
                        <a href={dataSource.link}>{dataSource.name} website</a>
                    </p>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default DataSourceDescription
