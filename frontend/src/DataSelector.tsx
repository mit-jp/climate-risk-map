import { Interval } from 'luxon'
import MultiDataSelector from './MultiDataSelector'
import SingleDataSelector from './SingleDataSelector'
import { MapVisualization, MapVisualizationId } from './MapVisualization'

function DataSelector({
    isNormalized,
    maps,
}: {
    isNormalized: boolean
    maps: Record<number, MapVisualization>
}) {
    return isNormalized ? <MultiDataSelector maps={maps} /> : <SingleDataSelector maps={maps} />
}

export type MapSelection = {
    mapVisualization: MapVisualizationId
    dataSource: number
    dateRange: Interval
}

export default DataSelector
