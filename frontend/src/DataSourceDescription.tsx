import { useState } from 'react'
import css from './DataDescription.module.css'
import { DataSource } from './MapVisualization'

function DataSourceDescription({ dataSource }: { dataSource: DataSource }) {
    const [show, setShow] = useState(false)

    return (
        <div className={css.dataDescription}>
            <button
                type="button"
                onClick={() => {
                    setShow(!show)
                }}
                className={show ? css.shown : undefined}
            >
                About the {dataSource.name} dataset
            </button>
            {show && <p>{dataSource.description}</p>}
            {show && (
                <p>
                    <a href={dataSource.link}>{dataSource.name} website</a>
                </p>
            )}
        </div>
    )
}

export default DataSourceDescription
