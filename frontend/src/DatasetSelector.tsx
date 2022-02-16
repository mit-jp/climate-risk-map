import { Fragment, ChangeEvent } from 'react'
import { DataSource } from './MapVisualization'
import css from './SubSelector.module.css'

type Props = {
    id: string
    dataSources: DataSource[]
    selectedDataSource: number
    onSelectionChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function DataSourceSelector({ id, dataSources, selectedDataSource, onSelectionChange }: Props) {
    const getDataSources = () => {
        return dataSources.map((dataSource) => (
            <Fragment key={dataSource.id}>
                <input
                    type="radio"
                    value={dataSource.id}
                    id={id + dataSource.id}
                    onChange={onSelectionChange}
                    checked={dataSource.id === selectedDataSource}
                />
                <label htmlFor={id + dataSource.id}>{dataSource.name}</label>
            </Fragment>
        ))
    }
    return (
        <div className={css.subSelector}>
            <p>Source:</p>
            {getDataSources()}
        </div>
    )
}

export default DataSourceSelector
