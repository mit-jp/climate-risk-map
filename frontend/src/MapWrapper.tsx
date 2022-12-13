import { useSelector } from 'react-redux'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useMemo, useRef } from 'react'
import css from './MapWrapper.module.css'
import { RootState } from './store'
import EmptyMap from './EmptyMap'
import FullMap from './FullMap'
import MapTitle, { EmptyMapTitle } from './MapTitle'
import {
    selectDataQueryParams,
    selectIsNormalized,
    selectMapTransform,
    selectSelectedMapVisualizations,
} from './appSlice'
import CountyTooltip from './CountyTooltip'
import MapControls from './MapControls'
import DataDescription from './DataDescription'
import Overlays from './Overlays'
import DataSourceDescription from './DataSourceDescription'
import { useGetDataQuery } from './MapApi'
import DataProcessor from './DataProcessor'

export const ZOOM_TRANSITION = { transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }

function MapWrapper() {
    const selectedMapVisualizations = useSelector(selectSelectedMapVisualizations)
    const map = useSelector((state: RootState) => state.app.map)
    const detailedView = useSelector((state: RootState) => state.app.detailedView)
    const isNormalized = useSelector(selectIsNormalized)
    const state = useSelector((rootState: RootState) => rootState.app.state)
    const dataWeights = useSelector((rootState: RootState) => rootState.app.dataWeights)
    const queryParams = useSelector(selectDataQueryParams)
    const transform = useSelector(selectMapTransform)
    const { data } = useGetDataQuery(queryParams ?? skipToken)
    const mapRef = useRef<SVGGElement>(null)
    const processedData = useMemo(
        () =>
            data
                ? DataProcessor(data, selectedMapVisualizations, dataWeights, state, isNormalized)
                : undefined,
        [data, selectedMapVisualizations, dataWeights, state, isNormalized]
    )

    if (map === undefined) {
        return <p>Loading</p>
    }
    return (
        <>
            <div className={css.map}>
                {selectedMapVisualizations.length > 0 ? (
                    <MapTitle
                        selectedMapVisualizations={selectedMapVisualizations}
                        isNormalized={isNormalized}
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
                    {processedData ? (
                        <FullMap
                            ref={mapRef}
                            map={map}
                            selectedMapVisualizations={selectedMapVisualizations}
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
                {map && <MapControls processedData={processedData} />}
                <DataDescription />
                <DataSourceDescription />
            </div>
            <CountyTooltip
                data={processedData}
                mapRef={mapRef}
                selectedMap={selectedMapVisualizations[0]}
                isNormalized={isNormalized}
            />
        </>
    )
}

export default MapWrapper
