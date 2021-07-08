import React, { ChangeEvent } from 'react';
import dataDefinitions, { DataIdParams, Year, Dataset, DataGroup, DataDefinition, Normalization } from './DataDefinitions';
import YearSelector from './YearSelector';
import DatasetSelector from './DatasetSelector';
import { TabToTypeMap } from './Navigation';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { changeDataGroup, changeDataset, changeYear, getSelections } from './appSlice';
import { useThunkDispatch } from './Home';

export const getYears = (selection: DataIdParams) =>
    dataDefinitions.get(selection.dataGroup)!.years;

export const getDatasets = (selection: DataIdParams) =>
    dataDefinitions.get(selection.dataGroup)!.datasets;

const SingleDataSelector = () => {
    const { selection, dataTab } = useSelector((state: RootState) => ({
        ...state.app,
        selection: getSelections(state.app)[0],
    }))
    const dispatch = useThunkDispatch();

    const onYearChange = (event: ChangeEvent<HTMLInputElement>) => {
        const year = event.target.value as Year;
        dispatch(changeYear(year));
    };
    const onDatasetChange = (event: ChangeEvent<HTMLInputElement>) => {
        const dataset = event.target.value as Dataset;
        dispatch(changeDataset(dataset));
    };
    const onDataGroupChange = (event: ChangeEvent<HTMLInputElement>) => {
        const dataGroup = event.target.value as DataGroup;
        dispatch(changeDataGroup(dataGroup));
    }

    const shouldShowYears = (dataGroup: DataGroup) =>
        selection.dataGroup === dataGroup &&
        getYears(selection).length > 1;

    const shouldShowDatasets = (dataGroup: DataGroup) =>
        selection.dataGroup === dataGroup &&
        getDatasets(selection).length > 1;

    const matchesDataTab = ([_, definition]: [DataGroup, DataDefinition]) =>
        definition.normalizations.contains(Normalization.Raw) &&
        TabToTypeMap.get(dataTab) === definition.type;

    const getDataGroups = () =>
        Array.from(dataDefinitions.entries())
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
                    <label className="data-group" htmlFor={dataGroup}>
                        {data.name(selection.normalization)}
                    </label>
                    {shouldShowYears(dataGroup) &&
                        <YearSelector
                            id={dataGroup}
                            years={getYears(selection)}
                            selectedYear={selection.year}
                            onSelectionChange={onYearChange}
                        />
                    }
                    {shouldShowDatasets(dataGroup) &&
                        <DatasetSelector
                            id={dataGroup}
                            datasets={getDatasets(selection)}
                            selectedDataset={selection.dataset}
                            onSelectionChange={onDatasetChange}
                        />
                    }
                </div>
            )

    return (
        <form id="data-selector">
            {getDataGroups()}
        </form>
    )
}

export default SingleDataSelector;