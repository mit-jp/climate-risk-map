import React from 'react';
import { DataGroup, DataIdParams, DataType } from './DataDefinitions';
import { Map } from 'immutable';
import MultiDataSelector from './MultiDataSelector';
import SingleDataSelector from './SingleDataSelector';

type Props = {
    selection: DataIdParams[],
    onSelectionChange: (dataIdParams: DataIdParams[], dataType: DataType) => void,
    dataType: DataType
    onWeightChange: (dataGroup: DataGroup, weight: number) => void,
    dataWeights: Map<DataGroup, number>,
};


const DataSelector = ({dataType, selection, onSelectionChange, onWeightChange, dataWeights}: Props) =>
    dataType === DataType.Normalized ?
        <MultiDataSelector dataType={dataType} selection={selection} onSelectionChange={onSelectionChange} onWeightChange={onWeightChange} dataWeights={dataWeights} /> :
        <SingleDataSelector dataType={dataType} selection={selection[0]} onSelectionChange={(selection)=> onSelectionChange([selection], dataType)} />

export default DataSelector;