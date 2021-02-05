import React, { ChangeEvent } from 'react';
import dataDefinitions, { DataIdParams, Year, Dataset, DataGroup, Normalization } from './DataDefinitions';
import YearSelector from './YearSelector';
import DatasetSelector from './DatasetSelector';
import { Map } from 'immutable';
import Slider from '@material-ui/core/Slider';

type Props = {
    selection: DataIdParams[],
    onSelectionChange: (dataIds: DataIdParams[]) => void,
    onWeightChange: (dataGroup: DataGroup, weight: number) => void,
    dataWeights: Map<DataGroup, number>,
};

const getYears = (dataGroup: DataGroup) =>
    dataDefinitions.get(dataGroup)!.years;

const getDatasets = (dataGroup: DataGroup) =>
    dataDefinitions.get(dataGroup)!.datasets;

const marks = [{ value: 0, label: "0" }, { value: 0.25, label: "0.25" }, { value: 0.5, label: "0.5" }, { value: 0.75, label: "0.75" }, { value: 1, label: "1" }]

const MultiDataSelector = ({ selection: dataSelections, onSelectionChange, onWeightChange, dataWeights }: Props) => {
    const selectionMap = Map(dataSelections.map(selection => [selection.dataGroup, selection]));

    const onYearChange = (event: ChangeEvent<HTMLInputElement>, dataGroup: DataGroup) => {
        const year = event.target.value as Year;
        const changedSelections = selectionMap.set(dataGroup, { ...selectionMap.get(dataGroup)!, year });
        onSelectionChange(Array.from(changedSelections.values()));
    };
    const onDatasetChange = (event: ChangeEvent<HTMLInputElement>, dataGroup: DataGroup) => {
        const dataset = event.target.value as Dataset;
        const changedSelections = selectionMap.set(dataGroup, { ...selectionMap.get(dataGroup)!, dataset });
        onSelectionChange(Array.from(changedSelections.values()));
    };
    const onSelectionToggled = (event: ChangeEvent<HTMLInputElement>) => {
        const dataGroup = event.target.value as DataGroup;
        const checked = event.target.checked;
        const changedSelections = checked ?
            selectionMap.set(dataGroup, { dataGroup, year: getYears(dataGroup)[0], dataset: getDatasets(dataGroup)[0], normalization: Normalization.Percentile }) :
            selectionMap.delete(dataGroup);

        onSelectionChange(Array.from(changedSelections.values()));
    }

    const shouldShowYears = (dataGroup: DataGroup) => shouldBeChecked(dataGroup) && getYears(dataGroup).length > 1
    const shouldShowDatasets = (dataGroup: DataGroup) => shouldBeChecked(dataGroup) && getDatasets(dataGroup).length > 1

    const shouldBeChecked = (dataGroup: DataGroup) => {
        return selectionMap.has(dataGroup);
    }

    const getDataGroups = () => {
        return Array.from(dataDefinitions.entries())
            .filter(([_, definition]) => definition.normalizations.contains(Normalization.Percentile))
            .map(([dataGroup, definition]) =>
                <div key={dataGroup} className={shouldBeChecked(dataGroup) ? "selected-group" : undefined}>
                    <input
                        className="data-group"
                        id={dataGroup}
                        checked={shouldBeChecked(dataGroup)}
                        type="checkbox"
                        value={dataGroup}
                        onChange={onSelectionToggled}
                        name="dataGroup" />
                    <label className="data-group" htmlFor={dataGroup}>{definition.name}</label>
                    {shouldBeChecked(dataGroup) && <Slider
                        className="weight-slider"
                        min={0}
                        max={1}
                        step={0.1}
                        marks={marks}
                        valueLabelDisplay="auto"
                        onChange={(_, weight) => onWeightChange(dataGroup, weight as number)}
                        value={dataWeights.get(dataGroup) ?? 1} />}
                    {shouldShowYears(dataGroup) &&
                        <YearSelector
                            id={dataGroup}
                            years={getYears(dataGroup)}
                            selectedYear={selectionMap.get(dataGroup)!.year}
                            onSelectionChange={e => onYearChange(e, dataGroup)}
                        />}
                    {shouldShowDatasets(dataGroup) &&
                        <DatasetSelector
                            id={dataGroup}
                            datasets={getDatasets(dataGroup)}
                            selectedDataset={selectionMap.get(dataGroup)!.dataset}
                            onSelectionChange={e => onDatasetChange(e, dataGroup)}
                        />}

                </div>
            )
    }

    return (
        <form id="data-selector">
            {getDataGroups()}
        </form>
    )
}

export default MultiDataSelector;