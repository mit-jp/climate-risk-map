import { Map } from 'immutable'
import { ForwardedRef, forwardRef } from 'react'
import BubbleMap from './BubbleMap'
import ChoroplethMap from './ChoroplethMap'
import { TopoJson } from './TopoJson'
import { MapType, MapVisualization, TabToId } from './MapVisualization'
import DataTab from './DataTab'
import { getUnitString } from './Formatter'

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
    map: TopoJson
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
                    color={
                        mapVisualization.data_tab === TabToId[DataTab.Health]
                            ? 'black'
                            : 'rgb(34, 139, 69)'
                    }
                />
            )
        default:
            return null
    }
}

const FullMapForwardRef = forwardRef(FullMap)

export default FullMapForwardRef
