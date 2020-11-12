import React, { ChangeEvent } from 'react';
import dataDefinitions, { DataIdParams, Year, Dataset, DataGroup, DataType } from './DataDefinitions';
import YearSelector from './YearSelector';
import DatasetSelector from './DatasetSelector';
import { Map } from 'immutable';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

type Props = {
    selection: DataIdParams[],
    onSelectionChange: (dataIds: DataIdParams[], dataType: DataType) => void,
    onWeightChange: (dataGroup: DataGroup, weight: number) => void,
    dataType: DataType,
    dataWeights: Map<DataGroup, number>,
};

const getYears = (dataGroup: DataGroup) =>
    dataDefinitions.get(dataGroup)!.years;

const getDatasets = (dataGroup: DataGroup) =>
    dataDefinitions.get(dataGroup)!.datasets;

const getUnitString = (units: string) => units ? `(${units})` : "";

const MultiDataSelector = ({selection: dataSelections, onSelectionChange, onWeightChange, dataType, dataWeights}: Props) => {
    const selectionMap = Map(dataSelections.map(selection => [selection.dataGroup, selection]));

    const onYearChange = (dataGroup: DataGroup) => (event: ChangeEvent<HTMLInputElement>) => {
        const year = event.target.value as Year;
        selectionMap.get(dataGroup)!.year = year;
        onSelectionChange(dataSelections, dataType);
    };
    const onDatasetChange = (dataGroup: DataGroup) => (event: ChangeEvent<HTMLInputElement>) => {
        const dataset = event.target.value as Dataset;
        selectionMap.get(dataGroup)!.dataset = dataset;
        onSelectionChange(dataSelections, dataType);
    };
    const onSelectionToggled = (event: ChangeEvent<HTMLInputElement>) => {
        const dataGroup = event.target.value as DataGroup;
        const checked = event.target.checked;
        const changedSelections = checked ?
            selectionMap.set(dataGroup, {dataGroup, year: getYears(dataGroup)[0], dataset: getDatasets(dataGroup)[0]}) :
            selectionMap.delete(dataGroup);
        
        onSelectionChange(Array.from(changedSelections.values()), dataType);
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
        .filter(([_, definition]) => dataType === definition.type)
        .map(([dataGroup, data]) =>
            <div key={dataGroup} className={shouldBeChecked(dataGroup) ? "selected-group" : undefined}>
                <input
                    className="data-group"
                    id={dataGroup}
                    checked={shouldBeChecked(dataGroup)}
                    type={dataType === DataType.Normalized ? "checkbox" : "radio"}
                    value={dataGroup}
                    onChange={onSelectionToggled}
                    name="dataGroup" />
                <label className="data-group" htmlFor={dataGroup}>{data.name} {getUnitString(data.units)}</label>
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
                        years={getYears(dataGroup)}
                        selectedYear={selectionMap.get(dataGroup)!.year}
                        onSelectionChange={onYearChange(dataGroup)}
                    />}
                {shouldShowDatasets(dataGroup) &&
                    <DatasetSelector
                        datasets={getDatasets(dataGroup)}
                        selectedDataset={selectionMap.get(dataGroup)!.dataset}
                        onSelectionChange={onDatasetChange(dataGroup)}
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