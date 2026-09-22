import { Interval } from 'luxon'
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
