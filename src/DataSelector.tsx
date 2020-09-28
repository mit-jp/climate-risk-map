import React, { ChangeEvent } from 'react';
import dataDefinitions, { DataName } from './DataDefinitions';

type Props = {
    selection: DataName,
    onSelectionChange: (event: ChangeEvent<HTMLSelectElement>) => void,
    showNormalized: boolean
};

const getUnitString = (units: string) => units ? `(${units})` : "";

const DataSelector = ({selection, onSelectionChange, showNormalized}: Props) => {
    const getOptions = () => {
        return Array.from(dataDefinitions.entries())
        .filter(([_, definition]) => showNormalized ? definition.normalized : !definition.normalized)
        .map(
            ([dataName, data]) => <option key={DataName[dataName]} value={DataName[dataName]}>{data.name} {getUnitString(data.units)}</option>
        )
    }

    return (
    <select value={DataName[selection]} onChange={onSelectionChange}>
        {getOptions()}
    </select>
    )
}

export default DataSelector;