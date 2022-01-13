import { useSelector } from 'react-redux'
import { Interval } from 'luxon'
import MultiDataSelector from './MultiDataSelector'
import SingleDataSelector from './SingleDataSelector'
import DataTab from './DataTab'
import { RootState } from './store'
import { MapVisualizationId } from './MapVisualization'

function DataSelector() {
    const dataTab = useSelector((state: RootState) => state.app.dataTab)
    return dataTab === DataTab.RiskMetrics ? <MultiDataSelector /> : <SingleDataSelector />
}

export type MapSelection = {
    mapVisualization: MapVisualizationId
    dataSource: number
    dateRange: Interval
}

export default DataSelector
