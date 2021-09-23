import MultiDataSelector from './MultiDataSelector';
import SingleDataSelector from './SingleDataSelector';
import DataTab from './DataTab';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { Interval } from 'luxon';

const DataSelector = () => {
    const dataTab = useSelector((state: RootState) => state.app.dataTab);
    return dataTab === DataTab.RiskMetrics ?
        <MultiDataSelector /> :
        <SingleDataSelector />

};

export type MapVisualizationId = number;

export type DataSource = {
    name: string,
    id: number,
    description: string,
    link: string,
};

export type MapSelection = {
    mapVisualization: MapVisualizationId,
    dataSource: number,
    dateRange: Interval,
};

export default DataSelector;