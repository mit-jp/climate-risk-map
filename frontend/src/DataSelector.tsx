import React from 'react';
import MultiDataSelector from './MultiDataSelector';
import SingleDataSelector from './SingleDataSelector';
import DataTab from './DataTab';
import { useSelector } from 'react-redux';
import { RootState } from './store';

const DataSelector = () => {
    const dataTab = useSelector((state: RootState) => state.app.dataTab);
    return dataTab === DataTab.RiskMetrics ?
        <MultiDataSelector /> :
        <SingleDataSelector />

}

export default DataSelector;