import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { UsaMap, WorldMap } from './CanvasMap'
import DataDescription from './DataDescription'
import DataProcessor from './DataProcessor'
import DataSourceDescription from './DataSourceDescription'
import { DataQueryParams, useGetDataQuery } from './MapApi'
import MapControls from './MapControls'
import MapTitle, { EmptyMapTitle } from './MapTitle'
import MapTooltip from './MapTooltip'
import { MapSpec, MapSpecId } from './MapVisualization'
import css from './MapWrapper.module.css'
import { selectMapTransform, selectSelections, stateId } from './appSlice'
import { RootState } from './store'

export const ZOOM_TRANSITION = { transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }
const MAP_WIDTH = 975
const MAP_HEIGHT = 610
function MapWrapper({
    allMapVisualizations,
    isNormalized,
}: {
    allMapVisualizations: Record<MapSpecId, MapSpec>
    isNormalized: boolean
}) {
    const map = useSelector((state: RootState) => state.app.map)
    const detailedView = useSelector((state: RootState) => state.app.detailedView)
    const zoomTo = useSelector((rootState: RootState) => rootState.app.zoomTo)
    const dataWeights = useSelector((rootState: RootState) => rootState.app.dataWeights)
    const transform = useSelector(selectMapTransform)
    const selections = useSelector(selectSelections)
    const region = useSelector((rootState: RootState) => rootState.app.region)
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
        () =>
            data
                ? DataProcessor({
                      data,
                      params: maps.map((map) => ({
                          mapId: map.id,
                          weight: dataWeights[map.id],
                          invertNormalized: map.invert_normalized,
                      })),
                      normalize: isNormalized,
                      filter: zoomTo && region ? (geoId) => stateId(geoId) === zoomTo : undefined,
                  })
                : undefined,
        [data, maps, dataWeights, zoomTo, isNormalized, region]
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
                {map?.region === 'USA' && map?.topoJson && (
                    <UsaMap
                        data={processedData}
                        mapSpec={maps[0]}
                        map={map.topoJson}
                        normalize={isNormalized}
                        detailedView={detailedView}
                    />
                )}
                {map?.region === 'World' && map?.topoJson && (
                    <WorldMap
                        data={processedData}
                        mapSpec={maps[0]}
                        world={map.topoJson}
                        width={MAP_WIDTH}
                        height={MAP_HEIGHT}
                        normalize={isNormalized}
                        detailedView={detailedView}
                    />
                )}
                {map && (
                    <MapControls data={processedData} isNormalized={isNormalized} maps={maps} />
                )}
                {maps[0] && (
                    <DataDescription name={maps[0].displayName} description={maps[0].description} />
                )}
                {dataSource && <DataSourceDescription dataSource={dataSource} />}
            </div>
            <MapTooltip
                data={processedData}
                mapRef={mapRef}
                selectedMap={maps[0]}
                isNormalized={isNormalized}
            />
        </>
    )
}

export default MapWrapper
