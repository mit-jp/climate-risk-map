import React, { ChangeEvent } from 'react';
import dataDefinitions, { DataIdParams, Year, Dataset, DataGroup } from './DataDefinitions';
import YearSelector from './YearSelector';
import DatasetSelector from './DatasetSelector';

type Props = {
    selection: DataIdParams,
    onSelectionChange: (event: DataIdParams) => void,
    showNormalized: boolean
};

const getYears = (selection: DataIdParams) =>
    dataDefinitions.get(selection.dataGroup)!.years;

const getDatasets = (selection: DataIdParams) =>
    dataDefinitions.get(selection.dataGroup)!.datasets;

const getUnitString = (units: string) => units ? `(${units})` : "";

const DataSelector = ({selection, onSelectionChange, showNormalized}: Props) => {

    const onYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const year = event.target.value as Year;
        onSelectionChange({...selection, year});
    };
    const onDatasetChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const dataset = event.target.value as Dataset;
        onSelectionChange({...selection, dataset});
    };
    const onDataGroupChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const dataGroup = event.target.value as DataGroup;
        onSelectionChange({...selection, dataGroup});
    }

    const getOptions = () => {
        return Array.from(dataDefinitions.entries())
        .filter(([_, definition]) => showNormalized ? definition.normalized : !definition.normalized)
        .map(
            ([dataGroup, data]) => <option key={dataGroup} value={dataGroup}>{data.name} {getUnitString(data.units)}</option>
        )
    }

    return (
        <React.Fragment>
            <select value={selection.dataGroup} onChange={onDataGroupChange}>
                {getOptions()}
            </select>
            {getYears(selection).length > 0 && <YearSelector years={getYears(selection)} selectedYear={selection.year} onSelectionChange={onYearChange} />}
            {getDatasets(selection).length > 0 && <DatasetSelector datasets={getDatasets(selection)} selectedDataset={selection.dataset} onSelectionChange={onDatasetChange} />}
        </React.Fragment>
    )
}

export default DataSelector;