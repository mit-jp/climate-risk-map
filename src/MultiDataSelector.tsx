import React, { ChangeEvent } from 'react';
import dataDefinitions, { DataIdParams, DataGroup, Normalization, Year, Dataset, DataDefinition, DataType } from './DataDefinitions';
import { Map } from 'immutable';
import Slider from '@material-ui/core/Slider';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import YearSelector from './YearSelector';

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
    } else if (years.includes(Year._2015)) {
        return Year._2015;
    } else {
        return years[0];
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

const shouldShowYears = (selection: DataIdParams | undefined) =>
    selection?.dataGroup === DataGroup.WaterStress;

const checkBox = (dataGroup: DataGroup,
    shouldBeChecked: (dataGroup: DataGroup) => boolean,
    onSelectionToggled: (event: ChangeEvent<HTMLInputElement>) => void,
    onYearChange: (event: ChangeEvent<HTMLInputElement>) => void,
    definition: DataDefinition,
    dataSelections: DataIdParams[],
    onWeightChange: (dataGroup: DataGroup, weight: number) => void,
    dataWeights: Map<DataGroup, number>,
    selection: DataIdParams | undefined) => {
    return <div key={dataGroup} className={shouldBeChecked(dataGroup) ? "selected-group" : undefined}>

        <input
            className="data-group"
            id={dataGroup}
            checked={shouldBeChecked(dataGroup)}
            type="checkbox"
            value={dataGroup}
            onChange={onSelectionToggled}
            name="dataGroup" />
        <label className="data-group" htmlFor={dataGroup}>{definition.name}</label>
        {shouldShowYears(selection) && selection && <YearSelector id={dataGroup} years={getYears(dataGroup)} selectedYear={selection.year} onSelectionChange={onYearChange} />}
        {shouldBeChecked(dataGroup) && multipleChecked(dataSelections) &&
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
            </div>}
    </div>;
}


const marks = [{ value: 0.1, label: "min" }, { value: 1, label: "max" }]

const MultiDataSelector = ({ selection: dataSelections, onSelectionChange, onWeightChange, dataWeights }: Props) => {
    const selectionsByDataGroup = Map(dataSelections.map(selection => [selection.dataGroup, selection]));

    const onYearChange = (event: ChangeEvent<HTMLInputElement>, dataGroup: DataGroup) => {
        const year = event.target.value as Year;
        const changedSelections = selectionsByDataGroup.set(dataGroup, {...selectionsByDataGroup.get(dataGroup)!, year});
        onSelectionChange(Array.from(changedSelections.values()));
    };

    const onSelectionToggled = (event: ChangeEvent<HTMLInputElement>) => {
        const dataGroup = event.target.value as DataGroup;
        const checked = event.target.checked;
        const changedSelections = checked ?
            selectionsByDataGroup.set(dataGroup, { dataGroup, year: getYear(dataGroup), dataset: getDataset(dataGroup), normalization: Normalization.Percentile }) :
            selectionsByDataGroup.delete(dataGroup);

        onSelectionChange(Array.from(changedSelections.values()));
    }

    const shouldBeChecked = (dataGroup: DataGroup) => {
        return selectionsByDataGroup.has(dataGroup);
    }

    const getDemographicRisks = () =>
        Array.from(dataDefinitions.entries())
            .filter(([_, definition]) =>
                definition.normalizations.contains(Normalization.Percentile) && 
                (definition.type === DataType.Economic ||
                definition.type === DataType.Demographics))
            .map(([dataGroup, definition]) =>
                checkBox(dataGroup, shouldBeChecked, onSelectionToggled, event => onYearChange(event, dataGroup), definition, dataSelections, onWeightChange, dataWeights, selectionsByDataGroup.get(dataGroup))
            )

    const getClimateRisks = () =>
        Array.from(dataDefinitions.entries())
            .filter(([_, definition]) =>
                definition.normalizations.contains(Normalization.Percentile) && 
                definition.type !== DataType.Economic &&
                definition.type !== DataType.Demographics)
            .map(([dataGroup, definition]) =>
                checkBox(dataGroup, shouldBeChecked, onSelectionToggled, event => onYearChange(event, dataGroup), definition, dataSelections, onWeightChange, dataWeights, selectionsByDataGroup.get(dataGroup))
            )

    return (
        <form id="data-selector">
            <Accordion>
                <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    expandIcon={<ExpandMoreIcon />}
                >
                Risk Metrics
                </AccordionSummary>
                <AccordionDetails>
                    {getClimateRisks()}
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    expandIcon={<ExpandMoreIcon />}
                >
                Environmental Justice
                </AccordionSummary>
                <AccordionDetails>
                    {getDemographicRisks()}
                </AccordionDetails>
            </Accordion>
        </form>
    )
}

export default MultiDataSelector;
