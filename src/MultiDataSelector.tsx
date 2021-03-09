import React, { ChangeEvent } from 'react';
import dataDefinitions, { DataIdParams, DataGroup, Normalization, Year, Dataset } from './DataDefinitions';
import { Map } from 'immutable';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

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

const getYear = (dataGroup: DataGroup) => {
    const years = getYears(dataGroup);
    if (years.includes(Year._2000_2019)) {
        return Year._2000_2019;
    } else {
        return years[0]
    }
}

const getDataset = (dataGroup: DataGroup) => {
    const datasets = getDatasets(dataGroup);
    if (datasets.includes(Dataset.ERA5)) {
        return Dataset.ERA5;
    } else {
        return datasets[0];
    }
}

const MultiDataSelector = ({selection: dataSelections, onSelectionChange, onWeightChange, dataWeights}: Props) => {
    const selectionMap = Map(dataSelections.map(selection => [selection.dataGroup, selection]));

    const onSelectionToggled = (event: ChangeEvent<HTMLInputElement>) => {
        const dataGroup = event.target.value as DataGroup;
        const checked = event.target.checked;
        const changedSelections = checked ?
            selectionMap.set(dataGroup, {dataGroup, year: getYear(dataGroup), dataset: getDataset(dataGroup), normalization: Normalization.Percentile}) :
            selectionMap.delete(dataGroup);
        
        onSelectionChange(Array.from(changedSelections.values()));
    }

    const onDataGroupWeightChange = (dataGroup: DataGroup) => (weight: number) => {
        onWeightChange(dataGroup, weight);
    }

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
                    marks={{0.1:0.1, 0.2:0.2,0.3:0.3,0.4:0.4,0.5:0.5,0.6:0.6,0.7:0.7,0.8:0.8,0.9:0.9, 1:1}}
                    className="slider"
                    min={0.1}
                    max={1}
                    step={0.1}
                    onChange={onDataGroupWeightChange(dataGroup)}
                    value={dataWeights.get(dataGroup) ?? 1} />}
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