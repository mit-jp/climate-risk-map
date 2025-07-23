import { useState } from 'react'
import { Button } from '@mui/material'
import css from './DataDescription.module.css'
import { DataSource } from './MapVisualization'

function DataSourceDescription({ dataSource }: { dataSource: DataSource }) {
    const [show, setShow] = useState(false)

    return (
        <div className={css.dataDescription}>
            <Button
                variant={show ? 'contained' : 'outlined'}
                onClick={() => {
                    setShow(!show)
                }}
                className={show ? css.shown : undefined}
            >
                {show
                    ? `Hide ${dataSource.name} dataset info`
                    : `About the ${dataSource.name} dataset`}
            </Button>
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
