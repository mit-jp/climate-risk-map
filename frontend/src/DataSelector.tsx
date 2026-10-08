import { MapVisualization, MapVisualizationId } from './MapVisualization'
import MultiDataSelector from './MultiDataSelector'
import SingleDataSelector from './SingleDataSelector'

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

/**
 * What the user chose for a map visualization. The source and date range are
 * preferences that may not exist in the map visualization; resolveSelection
 * falls back to its defaults where they don't.
 */
export type MapSelection = {
    mapVisualization: MapVisualizationId
    dataSource?: number
    /** ISO interval, e.g. 2015-01-01/2015-12-31 */
    dateRange?: string
}

export default DataSelector
