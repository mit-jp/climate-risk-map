import React, { ChangeEvent } from 'react';
import { Dataset } from './DataDefinitions';

type Props = {
    datasets: Dataset[],
    selectedDataset: string | undefined,
    onSelectionChange: (event: ChangeEvent<HTMLSelectElement>) => void
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
        return datasets.map(dataset => <option key={dataset} value={dataset}>{readable(dataset)}</option>)
    }
    return (
        <select value={selectedDataset} onChange={onSelectionChange}>
            {getDatasets()}
        </select>
    );
};

export default DatasetSelector;