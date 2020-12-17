import React, { ChangeEvent } from 'react';
import dataDefinitions, { DataIdParams, Year, Dataset, DataGroup, Normalization, getUnits } from './DataDefinitions';
import YearSelector from './YearSelector';
import DatasetSelector from './DatasetSelector';
import { Map } from 'immutable';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/core';

type Props = {
    selection: DataIdParams[],
    onSelectionChange: (dataIds: DataIdParams[]) => void,
    onWeightChange: (dataGroup: DataGroup, weight: number) => void,
    dataWeights: Map<DataGroup, number>,
    normalization: Normalization,
    onNormalizationChange: (normalization: Normalization) => void,
};

const getYears = (dataGroup: DataGroup) =>
    dataDefinitions.get(dataGroup)!.years;

const getDatasets = (dataGroup: DataGroup) =>
    dataDefinitions.get(dataGroup)!.datasets;

const getUnitString = (units: string) => units ? `(${units})` : "";

const MultiDataSelector = ({selection: dataSelections, onSelectionChange, onWeightChange, dataWeights, normalization, onNormalizationChange}: Props) => {
    const selectionMap = Map(dataSelections.map(selection => [selection.dataGroup, selection]));

    const onYearChange = (event: ChangeEvent<HTMLInputElement>, dataGroup: DataGroup) => {
        const year = event.target.value as Year;
        const changedSelections = selectionMap.set(dataGroup, {...selectionMap.get(dataGroup)!, year});
        onSelectionChange(Array.from(changedSelections.values()));
    };
    const onDatasetChange = (event: ChangeEvent<HTMLInputElement>, dataGroup: DataGroup) => {
        const dataset = event.target.value as Dataset;
        const changedSelections = selectionMap.set(dataGroup, {...selectionMap.get(dataGroup)!, dataset});
        onSelectionChange(Array.from(changedSelections.values()));
    };
    const onSelectionToggled = (event: ChangeEvent<HTMLInputElement>) => {
        const dataGroup = event.target.value as DataGroup;
        const checked = event.target.checked;
        const changedSelections = checked ?
            selectionMap.set(dataGroup, {dataGroup, year: getYears(dataGroup)[0], dataset: getDatasets(dataGroup)[0], normalization: Normalization.StandardDeviations}) :
            selectionMap.delete(dataGroup);
        
        onSelectionChange(Array.from(changedSelections.values()));
    }

    const onDataGroupWeightChange = (dataGroup: DataGroup) => (weight: number) => {
        onWeightChange(dataGroup, weight);
    }

    const shouldShowYears = (dataGroup: DataGroup) => shouldBeChecked(dataGroup) && getYears(dataGroup).length > 1
    const shouldShowDatasets = (dataGroup: DataGroup) => shouldBeChecked(dataGroup) && getDatasets(dataGroup).length > 1

    const shouldBeChecked = (dataGroup: DataGroup) => {
        return selectionMap.has(dataGroup);
    }

    const getDataGroups = () => {
        return Array.from(dataDefinitions.entries())
        .filter(([_, definition]) => definition.normalizations.contains(Normalization.StandardDeviations) || definition.normalizations.contains(Normalization.Percentile))
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
                <label className="data-group" htmlFor={dataGroup}>{definition.name} {getUnitString(getUnits(definition, normalization))}</label>
                {shouldBeChecked(dataGroup) && <Slider
                    marks={{0:0, 0.1:0.1, 0.2:0.2,0.3:0.3,0.4:0.4,0.5:0.5,0.6:0.6,0.7:0.7,0.8:0.8,0.9:0.9, 1:1}}
                    className="slider"
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={onDataGroupWeightChange(dataGroup)}
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
            <ToggleButtonGroup size="small" value={normalization} exclusive onChange={(_: any, value: Normalization) => onNormalizationChange(value)}>
                <ToggleButton value={Normalization.Percentile}>
                Percentile
                </ToggleButton>
                <ToggleButton value={Normalization.StandardDeviations}>
                Standard Deviations
                </ToggleButton>
            </ToggleButtonGroup>
            {getDataGroups()}
        </form>
    )
}

export default MultiDataSelector;