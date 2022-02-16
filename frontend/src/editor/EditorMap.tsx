import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useMemo, useRef } from 'react'
import CountyTooltip from '../CountyTooltip'
import DataProcessor from '../DataProcessor'
import EmptyMap from '../EmptyMap'
import FullMap from '../FullMap'
import { useGetDataQuery } from '../MapApi'
import { EmptyMapTitle } from '../MapTitle'
import { getDataQueryParams, MapVisualization } from '../MapVisualization'
import { TopoJson } from '../TopoJson'
import EditorMapDescription from './EditorMapDescription'
import EditorMapTitle from './EditorMapTitle'
import css from './Editor.module.css'

type Props = {
    map: TopoJson
    selection: MapVisualization | undefined
    detailedView: boolean
}

function EditorMap({ map, selection, detailedView }: Props) {
    const queryParams = useMemo(
        () => (selection ? getDataQueryParams(selection) : undefined),
        [selection]
    )
    const { data } = useGetDataQuery(queryParams ?? skipToken)
    const processedData = useMemo(
        () =>
            data && selection ? DataProcessor(data, [selection], {}, undefined, false) : undefined,
        [data, selection]
    )
    const mapRef = useRef(null)

    return (
        <div id={css.map}>
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
                        isNormalized={false}
                        ref={mapRef}
                    />
                ) : (
                    <EmptyMap map={map} />
                )}
            </svg>
            <CountyTooltip data={processedData} mapRef={mapRef} selectedMap={selection} />
            {selection && <EditorMapDescription selectedMap={selection} />}
        </div>
    )
}

export default EditorMap
