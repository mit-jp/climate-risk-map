import { Map } from 'immutable'
import { ForwardedRef, forwardRef } from 'react'
import BubbleMap from './BubbleMap'
import ChoroplethMap from './ChoroplethMap'
import { getUnitString } from './Formatter'
import { MapType, MapVisualization } from './MapVisualization'
import { GeoMap } from './appSlice'

export const getLegendTitle = (selectedMaps: MapVisualization[], isNormalized: boolean) => {
    const dataDefinition = selectedMaps[0]
    const unitString = getUnitString({ units: dataDefinition.units, isNormalized })

    if (isNormalized) {
        if (selectedMaps.some((value) => value.subcategory === 1)) {
            return selectedMaps.length > 1 ? 'Combined Relative Risk' : 'Relative Risk'
        }
        return 'Scaled Value'
    }
    return unitString
}

export enum Aggregation {
    State = 'state',
    County = 'county',
}
type Props = {
    map: GeoMap
    selectedMapVisualizations: MapVisualization[]
    data: Map<string, number>
    detailedView: boolean
    isNormalized: boolean
    transform?: string
}

function FullMap(
    { map, selectedMapVisualizations, data, detailedView, isNormalized, transform }: Props,
    ref: ForwardedRef<SVGGElement>
) {
    const mapVisualization = selectedMapVisualizations[0]!
    const mapType = mapVisualization.map_type
    const legendTitle = getLegendTitle(selectedMapVisualizations, isNormalized)
    switch (mapType) {
        case MapType.Choropleth:
            return (
                <ChoroplethMap
                    map={map}
                    selectedMapVisualizations={selectedMapVisualizations}
                    data={data}
                    detailedView={detailedView}
                    legendTitle={legendTitle}
                    isNormalized={isNormalized}
                    ref={ref}
                    transform={transform}
                />
            )
        case MapType.Bubble:
            return (
                <BubbleMap
                    map={map}
                    data={data}
                    legendTitle={legendTitle}
                    color={mapVisualization.bubble_color}
                />
            )
        default:
            return null
    }
}

const FullMapForwardRef = forwardRef(FullMap)

export default FullMapForwardRef
