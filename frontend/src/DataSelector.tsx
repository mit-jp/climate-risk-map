import { Interval } from 'luxon'
import { MapSpec, MapSpecId } from './MapVisualization'
import MultiDataSelector from './MultiDataSelector'
import SingleDataSelector from './SingleDataSelector'

function DataSelector({
    isNormalized,
    maps,
}: {
    isNormalized: boolean
    maps: Record<number, MapSpec>
}) {
    return isNormalized ? <MultiDataSelector maps={maps} /> : <SingleDataSelector maps={maps} />
}

export type MapSelection = {
    mapVisualization: MapSpecId
    dataSource: number
    dateRange: Interval
}

export default DataSelector
