import React, { ChangeEvent } from 'react';
import { Dataset } from './DataDefinitions';

type Props = {
    datasets: Dataset[],
    selectedDataset: string | undefined,
    onSelectionChange: (event: ChangeEvent<HTMLInputElement>) => void
};

const readable = (dataset: Dataset) => {
    switch(dataset) {
        case Dataset.ERA5:
            return "ERA5";
        case Dataset.MERRA2:
            return "MERRA2";
        case Dataset.NARR:
            return "NARR";
    }
}

const DatasetSelector = ({ datasets, selectedDataset, onSelectionChange }: Props) => {
    const getDatasets = () => {
        return datasets.map(dataset =>
            <React.Fragment key={dataset}>
            <input
                type="radio"
                value={dataset}
                id={dataset}
                onChange={onSelectionChange}
                checked={dataset === selectedDataset}
            />
            <label htmlFor={dataset}>{readable(dataset)}</label>
            </React.Fragment>
        )
    }
    return (
        <div className="sub-selector">
            <p>Dataset:</p>
            {getDatasets()}
        </div>
    );
};

export default DatasetSelector;