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
    return (
        <div id="data-selector">
            {isNormalized ? <MultiDataSelector maps={maps} /> : <SingleDataSelector maps={maps} />}
        </div>
    )
}

export type MapSelection = {
    mapVisualization: MapVisualizationId
    dataSource: number
    dateRange: Interval
}

export default DataSelector
