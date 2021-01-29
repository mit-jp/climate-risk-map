import React, { ChangeEvent } from 'react';
import dataDefinitions, { DataIdParams, Year, Dataset, DataGroup, DataDefinition, Normalization, getUnits } from './DataDefinitions';
import YearSelector from './YearSelector';
import DatasetSelector from './DatasetSelector';
import { DataTab, TabToTypeMap } from './Navigation';

type Props = {
    selection: DataIdParams,
    onSelectionChange: (event: DataIdParams) => void,
    dataTab: DataTab
};

const getYears = (selection: DataIdParams) =>
    dataDefinitions.get(selection.dataGroup)!.years;

const getDatasets = (selection: DataIdParams) =>
    dataDefinitions.get(selection.dataGroup)!.datasets;

const SingleDataSelector = ({selection, onSelectionChange, dataTab}: Props) => {

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

    const shouldShowYears = (dataGroup: DataGroup) => selection.dataGroup === dataGroup && getYears(selection).length > 1
    const shouldShowDatasets = (dataGroup: DataGroup) => selection.dataGroup === dataGroup && getDatasets(selection).length > 1

    const matchesDataTab = ([_, definition]: [DataGroup, DataDefinition]) => {
        return definition.normalizations.contains(Normalization.Raw) && TabToTypeMap.get(dataTab) === definition.type;
    }

    const getDataGroups = () => {
        return Array.from(dataDefinitions.entries())
        .filter(matchesDataTab)
        .map(([dataGroup, data]) =>
            <div key={dataGroup}>
                <input
                    className="data-group"
                    id={dataGroup}
                    checked={selection.dataGroup === dataGroup}
                    type="radio"
                    value={dataGroup}
                    onChange={onDataGroupChange}
                    name="dataGroup" />
                <label className="data-group" htmlFor={dataGroup}>{data.name}</label>
                {shouldShowYears(dataGroup) && <YearSelector id={dataGroup} years={getYears(selection)} selectedYear={selection.year} onSelectionChange={onYearChange} />}
                {shouldShowDatasets(dataGroup) && <DatasetSelector id={dataGroup} datasets={getDatasets(selection)} selectedDataset={selection.dataset} onSelectionChange={onDatasetChange} />}
            </div>
        )
    }

    return (
        <form id="data-selector">
            {getDataGroups()}
        </form>
    )
}

export default SingleDataSelector;