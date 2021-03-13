import React, { ChangeEvent } from 'react';
import dataDefinitions, { DataIdParams, DataGroup, Normalization, Year, Dataset } from './DataDefinitions';
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

const multipleChecked = (dataSelections: DataIdParams[]) => {
    return dataSelections.length > 1;
}

const marks = [{ value: 0.1, label: "min" }, { value: 1, label: "max" }]

const MultiDataSelector = ({ selection: dataSelections, onSelectionChange, onWeightChange, dataWeights }: Props) => {
    const selectionMap = Map(dataSelections.map(selection => [selection.dataGroup, selection]));

    const onSelectionToggled = (event: ChangeEvent<HTMLInputElement>) => {
        const dataGroup = event.target.value as DataGroup;
        const checked = event.target.checked;
        const changedSelections = checked ?
            selectionMap.set(dataGroup, { dataGroup, year: getYear(dataGroup), dataset: getDataset(dataGroup), normalization: Normalization.Percentile }) :
            selectionMap.delete(dataGroup);

        onSelectionChange(Array.from(changedSelections.values()));
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
                    {
                        shouldBeChecked(dataGroup) && multipleChecked(dataSelections) &&
                        <div className="weight">
                            <div className="weight-label">Weight</div>
                            <Slider
                            className="weight-slider"
                            min={0.1}
                            max={1}
                            step={0.1}
                            marks={marks}
                            valueLabelDisplay="auto"
                            onChange={(_, weight) => onWeightChange(dataGroup, weight as number)}
                            value={dataWeights.get(dataGroup) ?? 1} />
                        </div>
                    }

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
