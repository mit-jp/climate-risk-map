import { useSelector } from 'react-redux'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useMemo, useRef } from 'react'
import css from './MapWrapper.module.css'
import { RootState } from './store'
import EmptyMap from './EmptyMap'
import FullMap from './FullMap'
import MapTitle, { EmptyMapTitle } from './MapTitle'
import { selectMapTransform, selectSelections } from './appSlice'
import CountyTooltip from './CountyTooltip'
import MapControls from './MapControls'
import DataDescription from './DataDescription'
import Overlays from './Overlays'
import DataSourceDescription from './DataSourceDescription'
import { DataQueryParams, useGetDataQuery } from './MapApi'
import DataProcessor from './DataProcessor'
import { MapVisualization, MapVisualizationId } from './MapVisualization'

export const ZOOM_TRANSITION = { transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }

function MapWrapper({
    allMapVisualizations,
    isNormalized,
}: {
    allMapVisualizations: Record<MapVisualizationId, MapVisualization>
    isNormalized: boolean
}) {
    const map = useSelector((state: RootState) => state.app.map)
    const detailedView = useSelector((state: RootState) => state.app.detailedView)
    const state = useSelector((rootState: RootState) => rootState.app.state)
    const dataWeights = useSelector((rootState: RootState) => rootState.app.dataWeights)
    const transform = useSelector(selectMapTransform)
    const selections = useSelector(selectSelections)
    const maps = useMemo(() => {
        return selections
            .map((selection) => selection.mapVisualization)
            .map((id) => allMapVisualizations[id])
            .filter((mapVisualization) => mapVisualization !== undefined)
    }, [allMapVisualizations, selections])
    const queryParams: DataQueryParams[] | undefined =
        Object.entries(selections).length > 0
            ? selections.map((selection) => ({
                  mapVisualization: selection.mapVisualization,
                  source: selection.dataSource,
                  startDate: selection.dateRange.start.toISODate(),
                  endDate: selection.dateRange.end.toISODate(),
              }))
            : undefined
    const { data } = useGetDataQuery(queryParams ?? skipToken)
    const mapRef = useRef<SVGGElement>(null)
    const processedData = useMemo(
        () => (data ? DataProcessor(data, maps, dataWeights, state, isNormalized) : undefined),
        [data, maps, dataWeights, state, isNormalized]
    )
    const dataSource =
        maps[0] && selections[0] ? maps[0].sources[selections[0].dataSource] : undefined

    if (map === undefined) {
        return <p>Loading</p>
    }
    return (
        <>
            <div className={css.map}>
                {maps.length > 0 ? (
                    <MapTitle selectedMapVisualizations={maps} isNormalized={isNormalized} />
                ) : (
                    <EmptyMapTitle />
                )}
                <svg
                    id="map-svg"
                    version="1.1"
                    baseProfile="full"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0, 0, 1175, 610"
                >
                    {processedData ? (
                        <FullMap
                            ref={mapRef}
                            map={map}
                            selectedMapVisualizations={maps}
                            data={processedData}
                            detailedView={detailedView}
                            isNormalized={isNormalized}
                            transform={transform}
                        />
                    ) : (
                        <EmptyMap map={map} transform={transform} />
                    )}
                    <Overlays />
                </svg>
                {map && (
                    <MapControls
                        processedData={processedData}
                        isNormalized={isNormalized}
                        maps={maps}
                    />
                )}
                {maps[0] && (
                    <DataDescription name={maps[0].displayName} description={maps[0].description} />
                )}
                {dataSource && <DataSourceDescription dataSource={dataSource} />}
            </div>
            <CountyTooltip
                data={processedData}
                mapRef={mapRef}
                selectedMap={maps[0]}
                isNormalized={isNormalized}
            />
        </>
    )
}

export default MapWrapper
