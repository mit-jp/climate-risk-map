import { Accordion } from './ui'
import css from './DataDescription.module.css'

function DataDescription({ name, description }: { name: string; description: string }) {
    return (
        <div className={css.dataDescription}>
            <Accordion summary={`About the ${name} data`}>
                <div className={css.description}>
                    <p>{description}</p>
                </div>
            </Accordion>
        </div>
    )
}

export default DataDescription
