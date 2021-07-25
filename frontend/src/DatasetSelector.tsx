import React, { ChangeEvent } from 'react';
import { DataSource } from './DataSelector';

type Props = {
    id: string,
    dataSources: DataSource[],
    selectedDataSource: number,
    onSelectionChange: (event: ChangeEvent<HTMLInputElement>) => void
};

const DataSourceSelector = ({ id, dataSources, selectedDataSource, onSelectionChange }: Props) => {
    const getDataSources = () => {
        return dataSources.map(dataSource =>
            <React.Fragment key={dataSource.id}>
                <input
                    type="radio"
                    value={dataSource.id}
                    id={id + dataSource.id}
                    onChange={onSelectionChange}
                    checked={dataSource.id === selectedDataSource}
                />
                <label htmlFor={id + dataSource.id}>{dataSource.name}</label>
            </React.Fragment>
        )
    }
    return (
        <div className="sub-selector">
            <p>Source:</p>
            {getDataSources()}
        </div>
    );
};

export default DataSourceSelector;