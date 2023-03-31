import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useMemo, useRef } from 'react'
import DataProcessor from '../DataProcessor'
import EmptyMap from '../EmptyMap'
import FullMap from '../FullMap'
import { useGetDataQuery, useGetDatasetsQuery } from '../MapApi'
import { EmptyMapTitle } from '../MapTitle'
import MapTooltip from '../MapTooltip'
import { MapVisualization, getDataQueryParams } from '../MapVisualization'
import { TopoJson } from '../TopoJson'
import DatasetSelector from './DatasetSelector'
import css from './Editor.module.css'
import EditorMapDescription from './EditorMapDescription'
import EditorMapTitle from './EditorMapTitle'
import EmptyDatasetSelector from './EmptyDatasetSelector'

type Props = {
    map: TopoJson
    selection: MapVisualization | undefined
    detailedView: boolean
    isNormalized: boolean
}

function EditorMap({ map, selection, detailedView, isNormalized }: Props) {
    const queryParams = useMemo(
        () => (selection ? getDataQueryParams(selection) : undefined),
        [selection]
    )
    const { data: datasets } = useGetDatasetsQuery(undefined)
    const { data } = useGetDataQuery(queryParams ?? skipToken)
    const processedData = useMemo(
        () =>
            data && selection
                ? DataProcessor({
                      data,
                      params: [
                          {
                              mapId: selection.id,
                              invertNormalized: selection.invert_normalized,
                          },
                      ],
                      normalize: isNormalized,
                  })
                : undefined,
        [data, selection, isNormalized]
    )
    const mapRef = useRef(null)

    return (
        <div id={css.map}>
            {selection && datasets ? (
                <DatasetSelector mapVisualization={selection} datasets={datasets} />
            ) : (
                <EmptyDatasetSelector />
            )}
            {selection ? (
                <EditorMapTitle mapVisualization={selection} key={selection.id} />
            ) : (
                <EmptyMapTitle />
            )}
            <svg viewBox="0, 0, 1175, 610">
                {processedData && selection ? (
                    <FullMap
                        map={map}
                        selectedMapVisualizations={[selection]}
                        data={processedData}
                        detailedView={detailedView}
                        isNormalized={isNormalized}
                        ref={mapRef}
                    />
                ) : (
                    <EmptyMap map={map} />
                )}
            </svg>
            <MapTooltip
                data={processedData}
                mapRef={mapRef}
                selectedMap={selection}
                isNormalized={isNormalized}
            />
            {selection && <EditorMapDescription selectedMap={selection} />}
        </div>
    )
}

export default EditorMap
