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

    const onYearChange = (event: ChangeEvent<HTMLInputElement>) => {
        const year = event.target.value as Year;
        onSelectionChange({...selection, year});
    };
    const onDatasetChange = (event: ChangeEvent<HTMLInputElement>) => {
        const dataset = event.target.value as Dataset;
        onSelectionChange({...selection, dataset});
    };
    const onDataGroupChange = (event: ChangeEvent<HTMLInputElement>) => {
        const dataGroup = event.target.value as DataGroup;
        onSelectionChange({...selection, dataGroup});
    }

    const shouldShowYears = (dataGroup: DataGroup) => selection.dataGroup === dataGroup && getYears(selection).length > 0
    const shouldShowDatasets = (dataGroup: DataGroup) => selection.dataGroup === dataGroup && getDatasets(selection).length > 0

    const getDataGroups = () => {
        return Array.from(dataDefinitions.entries())
        .filter(([_, definition]) => showNormalized ? definition.normalized : !definition.normalized)
        .map(([dataGroup, data]) =>
            <div>
                <input
                    className="data-group"
                    id={dataGroup}
                    checked={selection.dataGroup === dataGroup}
                    type="radio"
                    key={dataGroup}
                    value={dataGroup}
                    onChange={onDataGroupChange}
                    name="dataGroup" />
                <label className="data-group" htmlFor={dataGroup}>{data.name} {getUnitString(data.units)}</label>
                {shouldShowYears(dataGroup) && <YearSelector years={getYears(selection)} selectedYear={selection.year} onSelectionChange={onYearChange} />}
                {shouldShowDatasets(dataGroup) && <DatasetSelector datasets={getDatasets(selection)} selectedDataset={selection.dataset} onSelectionChange={onDatasetChange} />}
            </div>
        )
    }

    return (
        <form id="data-selector">
            {getDataGroups()}
        </form>
    )
}

export default DataSelector;