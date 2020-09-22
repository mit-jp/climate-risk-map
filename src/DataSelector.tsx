import React, { ChangeEvent } from 'react';
import dataTypes, { DataName } from './DataTypes';

type DataSelectorProps = {
    selection: DataName,
    onSelectionChange: (event: ChangeEvent<HTMLSelectElement>) => void
};

const getUnitString = (units: string) => units ? `(${units})` : "";

const getOptions = () => {
    return Array.from(dataTypes.entries()).map(
        ([dataName, data]) => <option value={DataName[dataName]}>{data.name} {getUnitString(data.units)}</option>
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