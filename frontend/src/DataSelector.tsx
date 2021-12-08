import MultiDataSelector from './MultiDataSelector';
import SingleDataSelector from './SingleDataSelector';
import DataTab from './DataTab';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { Interval } from 'luxon';
import { MapVisualizationId } from './MapVisualization';

const DataSelector = () => {
    const dataTab = useSelector((state: RootState) => state.app.dataTab);
    return dataTab === DataTab.RiskMetrics ?
        <MultiDataSelector /> :
        <SingleDataSelector />

};

export type MapSelection = {
    mapVisualization: MapVisualizationId,
    dataSource: number,
    dateRange: Interval,
};

export default DataSelector;