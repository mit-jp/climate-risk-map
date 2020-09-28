import React, { ChangeEvent } from 'react';
import dataDefinitions, { DataName } from './DataDefinitions';

type DataSelectorProps = {
    selection: DataName,
    onSelectionChange: (event: ChangeEvent<HTMLSelectElement>) => void
};

const getUnitString = (units: string) => units ? `(${units})` : "";

const getOptions = () => {
    return Array.from(dataDefinitions.entries()).map(
        ([dataName, data]) => <option key={DataName[dataName]} value={DataName[dataName]}>{data.name} {getUnitString(data.units)}</option>
    )
}

const DataSelector = ({selection, onSelectionChange}: DataSelectorProps) => {
    return (
    <select value={DataName[selection]} onChange={onSelectionChange}>
        {getOptions()}
    </select>
    )
}

export default DataSelector;