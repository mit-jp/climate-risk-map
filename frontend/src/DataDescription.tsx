import css from './DataDescription.module.css'
import { DataSource } from './MapVisualization'
import { Accordion } from './ui'

function DataDescription({
    description,
    dataSource,
}: {
    description: string
    dataSource?: DataSource
}) {
    return (
        <div className={css.dataDescription}>
            <Accordion summary="About the data">
                <div className={css.description}>
                    <p>{description}</p>
                    {dataSource && (
                        <>
                            <h4>Source: {dataSource.name}</h4>
                            <p>{dataSource.description}</p>
                            <p>
                                <a href={dataSource.link}>{dataSource.name} website</a>
                            </p>
                        </>
                    )}
                </div>
            </Accordion>
        </div>
    )
}

export default DataDescription
