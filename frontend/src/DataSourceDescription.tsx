import { Accordion } from './ui'
import css from './DataDescription.module.css'
import { DataSource } from './MapVisualization'

function DataSourceDescription({ dataSource }: { dataSource: DataSource }) {
    return (
        <div className={css.dataDescription}>
            <Accordion summary={`About the ${dataSource.name} dataset`}>
                <div className={css.description}>
                    <p>{dataSource.description}</p>
                    <p>
                        <a href={dataSource.link}>{dataSource.name} website</a>
                    </p>
                </div>
            </Accordion>
        </div>
    )
}

export default DataSourceDescription
