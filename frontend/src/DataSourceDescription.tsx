import { Accordion } from './ui'
import css from './DataDescription.module.css'
import { DataSource } from './MapVisualization'

function DataSourceDescription({ dataSource }: { dataSource: DataSource }) {
    return (
        <div className={css.dataDescription}>
            <Accordion summary={`About the ${dataSource.name} dataset`}>
                <p className={css.description}>{dataSource.description}</p>
                <p className={css.description}>
                    <a href={dataSource.link}>{dataSource.name} website</a>
                </p>
            </Accordion>
        </div>
    )
}

export default DataSourceDescription
