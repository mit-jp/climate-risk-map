import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DataDescription from './DataDescription'
import DataProcessor from './DataProcessor'
import DataSourceDescription from './DataSourceDescription'
import EmptyMap from './EmptyMap'
import FullMap from './FullMap'
import { DataQueryParams, useGetDataQuery } from './MapApi'
import MapControls from './MapControls'
import MapTitle, { EmptyMapTitle } from './MapTitle'
import MapTooltip from './MapTooltip'
import { MapVisualization, MapVisualizationId } from './MapVisualization'
import css from './MapWrapper.module.css'
import Overlays from './Overlays'
import { clickMap, selectMapTransform, selectSelections, stateId } from './appSlice'
import { RootState } from './store'

export const ZOOM_TRANSITION = { transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }

function MapWrapper({
    allMapVisualizations,
    isNormalized,
}: {
    allMapVisualizations: Record<MapVisualizationId, MapVisualization>
    isNormalized: boolean
}) {
    const dispatch = useDispatch()
    const map = useSelector((state: RootState) => state.app.map)
    const detailedView = useSelector((state: RootState) => state.app.detailedView)
    const zoomTo = useSelector((rootState: RootState) => rootState.app.zoomTo)
    const dataWeights = useSelector((rootState: RootState) => rootState.app.dataWeights)
    const transform = useSelector(selectMapTransform)
    const selections = useSelector(selectSelections)
    const region = useSelector((rootState: RootState) => rootState.app.region)
    const tab = useSelector((state: RootState) => state.app.tab?.name ?? '')
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
                      filter:
                          zoomTo && region === 'USA'
                              ? (geoId) => stateId(geoId) === zoomTo
                              : undefined,
                  })
                : undefined,
        [data, maps, dataWeights, zoomTo, isNormalized, region]
    )
    const dataSource =
        maps[0] && selections[0] ? maps[0].sources[selections[0].dataSource] : undefined

    const isStateLevelOnlyData = useMemo(() => {
        if (data && maps.length > 0 && tab === 'combinatory metrics') {
            const noStateLevelMaps = maps.every((map) => {
                const mapList = data.get(map.id)

                const countryMap = new Map()
                const valueSet = new Set()

                mapList?.forEach(([geoId, value]) => {
                    const stateId = Math.floor(geoId / 1000)
                    valueSet.add(value)
                    if (!countryMap.get(stateId)) {
                        countryMap.set(stateId, [])
                    }
                    countryMap.get(stateId).push(value)
                })

                const allValuesSame = Array.from(countryMap.values()).every((state) => {
                    return state.every((val: number) => val === state[0])
                })

                // to prevent the warning from flashing when loading a new map
                if (valueSet.size === 0) {
                    return true
                }

                return !allValuesSame
            })
            return !noStateLevelMaps
        }
        return false
    }, [data, maps, tab])

    if (map === undefined) {
        return <p>Loading</p>
    }
    // rectangle ("rect") below is made so that the user can zoom out by clicking on the map background
    // set to be transparent
    return (
        <>
            <div className={css.map}>
                {maps.length > 0 ? (
                    <MapTitle
                        selectedMapVisualizations={maps}
                        isNormalized={isNormalized}
                        showStateLevelWarning={isStateLevelOnlyData}
                    />
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
                    <rect
                        x="0"
                        y="0"
                        width="1175"
                        height="610"
                        fill="white"
                        onClick={() => dispatch(clickMap(Number(-1)))}
                        style={{ opacity: 0 }}
                    />
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
