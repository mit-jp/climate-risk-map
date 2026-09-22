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

// dataSource and dateRange are either both set (a visualization with data) or
// both unset (a visualization whose dataset has no data rows), so checking one
// narrows the other.
export type MapSelection =
    | {
          mapVisualization: MapVisualizationId
          dataSource: number
          dateRange: Interval
      }
    | {
          mapVisualization: MapVisualizationId
          dataSource?: undefined
          dateRange?: undefined
      }

export default DataSelector
