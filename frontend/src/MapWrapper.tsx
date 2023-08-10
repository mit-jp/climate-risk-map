import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { UsaMap, WorldMap } from './CanvasMap'
import DataDescription from './DataDescription'
import DataProcessor from './DataProcessor'
import DataSourceDescription from './DataSourceDescription'
import { DataQueryParams, useGetDataQuery } from './MapApi'
import MapControls from './MapControls'
import MapTitle, { EmptyMapTitle } from './MapTitle'
import { MapSpec, MapSpecId } from './MapVisualization'
import css from './MapWrapper.module.css'
import { selectMapTransform, selectSelections, stateId } from './appSlice'
import { RootState } from './store'

export const ZOOM_TRANSITION = { transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }
function MapWrapper({
    allMapVisualizations,
    isNormalized,
}: {
    allMapVisualizations: Record<MapSpecId, MapSpec>
    isNormalized: boolean
}) {
    const detailedView = useSelector((state: RootState) => state.app.detailedView)
    const zoomTo = useSelector((rootState: RootState) => rootState.app.zoomTo)
    const dataWeights = useSelector((rootState: RootState) => rootState.app.dataWeights)
    const transform = useSelector(selectMapTransform)
    const selections = useSelector(selectSelections)
    const region = useSelector((rootState: RootState) => rootState.app.region)
    const mapSpecs = useMemo(() => {
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
    const processedData = useMemo(
        () =>
            data
                ? DataProcessor({
                      data,
                      params: mapSpecs.map((map) => ({
                          mapId: map.id,
                          weight: dataWeights[map.id],
                          invertNormalized: map.invert_normalized,
                      })),
                      normalize: isNormalized,
                      filter: zoomTo && region ? (geoId) => stateId(geoId) === zoomTo : undefined,
                  })
                : undefined,
        [data, mapSpecs, dataWeights, zoomTo, isNormalized, region]
    )
    const dataSource =
        mapSpecs[0] && selections[0] ? mapSpecs[0].sources[selections[0].dataSource] : undefined

    return (
        <div className={css.map}>
            {mapSpecs.length > 0 ? (
                <MapTitle selectedMapVisualizations={mapSpecs} isNormalized={isNormalized} />
            ) : (
                <EmptyMapTitle />
            )}
            {region === 'USA' && (
                <UsaMap
                    data={processedData}
                    mapSpec={mapSpecs[0]}
                    normalize={isNormalized}
                    detailedView={detailedView}
                    transform={transform}
                />
            )}
            {region === 'World' && (
                <WorldMap
                    data={processedData}
                    mapSpec={mapSpecs[0]}
                    normalize={isNormalized}
                    detailedView={detailedView}
                    transform={transform}
                />
            )}

            <MapControls data={processedData} isNormalized={isNormalized} maps={mapSpecs} />
            {mapSpecs[0] && (
                <DataDescription
                    name={mapSpecs[0].displayName}
                    description={mapSpecs[0].description}
                />
            )}
            {dataSource && <DataSourceDescription dataSource={dataSource} />}
        </div>
    )
}

export default MapWrapper
