import React from 'react';
import { DataIdParams, DataType } from './DataDefinitions';
import MultiDataSelector from './MultiDataSelector';
import SingleDataSelector from './SingleDataSelector';

type Props = {
    selection: DataIdParams[],
    onSelectionChange: (dataIdParams: DataIdParams[], dataType: DataType) => void,
    dataType: DataType
};


const DataSelector = ({dataType, selection, onSelectionChange}: Props) =>
    dataType === DataType.Normalized ?
        <MultiDataSelector dataType={dataType} selection={selection} onSelectionChange={onSelectionChange} /> :
        <SingleDataSelector dataType={dataType} selection={selection[0]} onSelectionChange={(selection)=> onSelectionChange([selection], dataType)} />

export default DataSelector;