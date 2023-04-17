import { Button, MenuItem, Select } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useMemo, useRef, useState } from 'react'
import DataProcessor from '../DataProcessor'
import EmptyMap from '../EmptyMap'
import FullMap from '../FullMap'
import {
    Tab,
    useDeleteMapVisualizationMutation,
    useGetDataQuery,
    useGetDatasetsQuery,
    usePublishMapVisualizationMutation,
    useUnpublishMapVisualizationMutation,
} from '../MapApi'
import { EmptyMapTitle } from '../MapTitle'
import MapTooltip from '../MapTooltip'
import { MapVisualization, getDataQueryParams } from '../MapVisualization'
import { GeoMap } from '../appSlice'
import DatasetSelector from './DatasetSelector'
import { isDrafts } from './Editor'
import css from './Editor.module.css'
import EditorMapDescription from './EditorMapDescription'
import EditorMapTitle from './EditorMapTitle'
import EmptyDatasetSelector from './EmptyDatasetSelector'

type Props = {
    map: GeoMap
    selection: MapVisualization | undefined
    detailedView: boolean
    isNormalized: boolean
    tab: Tab
    tabs: Tab[]
}

function EditorMap({ map, selection, detailedView, isNormalized, tab, tabs }: Props) {
    const queryParams = useMemo(
        () => (selection ? getDataQueryParams(selection) : undefined),
        [selection]
    )
    const [deleteMap] = useDeleteMapVisualizationMutation()
    const [publish] = usePublishMapVisualizationMutation()
    const [unpublish] = useUnpublishMapVisualizationMutation()
    const { data: datasets } = useGetDatasetsQuery(undefined)
    const { data } = useGetDataQuery(queryParams ?? skipToken)
    const [publishTo, setPublishTo] = useState(tabs[0].id)
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
    const isDraft = isDrafts(tab)

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
            {selection && (
                <>
                    <EditorMapDescription selectedMap={selection} />
                    <div className={css.publishArea}>
                        {isDraft && (
                            <Select
                                value={publishTo}
                                onChange={(event) => setPublishTo(event.target.value as number)}
                            >
                                {tabs.map(({ id, name }) => (
                                    <MenuItem key={id} value={id}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                        <Button
                            className={css.publishButton}
                            onClick={() => {
                                const id = {
                                    map_visualization: selection.id,
                                    category: isDraft ? publishTo : tab.id,
                                }
                                isDraft ? publish(id) : unpublish(id)
                            }}
                            variant="contained"
                            color={isDraft ? 'secondary' : 'error'}
                        >
                            {isDraft ? 'Publish' : 'Unpublish'}
                        </Button>
                    </div>

                    {isDraft && (
                        <Button
                            className={css.deleteButton}
                            onClick={() => deleteMap(selection.id)}
                            variant="contained"
                            color="error"
                        >
                            Delete
                        </Button>
                    )}
                </>
            )}
        </div>
    )
}

export default EditorMap
