import { Accordion } from './ui'
import css from './DataDescription.module.css'

function DataDescription({ name, description }: { name: string; description: string }) {
    return (
        <div className={css.dataDescription}>
            <Accordion summary={`About the ${name} data`} style={{ width: 'fit-content' }}>
                <p className={css.description}>{description}</p>
            </Accordion>
        </div>
    )
}

export default DataDescription
