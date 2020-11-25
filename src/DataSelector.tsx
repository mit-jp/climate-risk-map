import React from 'react';
import { DataGroup, DataIdParams, Normalization } from './DataDefinitions';
import { Map } from 'immutable';
import MultiDataSelector from './MultiDataSelector';
import SingleDataSelector from './SingleDataSelector';
import { DataTab } from './Navigation';

type Props = {
    selection: DataIdParams[],
    onSelectionChange: (dataIdParams: DataIdParams[], dataTab: DataTab) => void,
    dataTab: DataTab
    onWeightChange: (dataGroup: DataGroup, weight: number) => void,
    dataWeights: Map<DataGroup, number>,
};


const DataSelector = ({dataTab, selection, onSelectionChange, onWeightChange, dataWeights}: Props) =>
    dataTab === DataTab.Normalized ?
        <MultiDataSelector
            selection={selection}
            onSelectionChange={selection => onSelectionChange(selection, DataTab.Normalized)}
            onWeightChange={onWeightChange}
            dataWeights={dataWeights}
            normalization={Normalization.StandardDeviations}
        /> :
        <SingleDataSelector
            dataTab={dataTab}
            selection={selection[0]}
            onSelectionChange={(selection)=> onSelectionChange([selection], dataTab)}
        />

export default DataSelector;