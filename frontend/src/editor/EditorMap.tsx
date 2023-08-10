import { Button, MenuItem, Select } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useMemo, useState } from 'react'
import CanvasMap from '../CanvasMap'
import DataProcessor from '../DataProcessor'
import {
    Tab,
    useDeleteMapSpecMutation,
    useGetDataQuery,
    useGetDatasetsQuery,
    usePublishMapSpecMutation,
    useUnpublishMapSpecMutation,
} from '../MapApi'
import { EmptyMapTitle } from '../MapTitle'
import { MapSpec, getDataQueryParams } from '../MapVisualization'
import DatasetSelector from './DatasetSelector'
import { isDrafts } from './Editor'
import css from './Editor.module.css'
import EditorMapDescription from './EditorMapDescription'
import EditorMapTitle from './EditorMapTitle'
import EmptyDatasetSelector from './EmptyDatasetSelector'

type Props = {
    mapSpec: MapSpec | undefined
    detailedView: boolean
    isNormalized: boolean
    tab: Tab
    tabs: Tab[]
}

function EditorMap({ mapSpec, detailedView, isNormalized, tab, tabs }: Props) {
    const queryParams = useMemo(
        () => (mapSpec ? getDataQueryParams(mapSpec) : undefined),
        [mapSpec]
    )
    const [deleteMap] = useDeleteMapSpecMutation()
    const [publish] = usePublishMapSpecMutation()
    const [unpublish] = useUnpublishMapSpecMutation()
    const { data: datasets } = useGetDatasetsQuery(undefined)
    const { data } = useGetDataQuery(queryParams ?? skipToken)
    const [publishTo, setPublishTo] = useState(tabs[0].id)
    const processedData = useMemo(
        () =>
            data && mapSpec
                ? DataProcessor({
                      data,
                      params: [
                          {
                              mapId: mapSpec.id,
                              invertNormalized: mapSpec.invert_normalized,
                          },
                      ],
                      normalize: isNormalized,
                  })
                : undefined,
        [data, mapSpec, isNormalized]
    )
    const isDraft = isDrafts(tab)

    return (
        <div id={css.map}>
            {mapSpec && datasets ? (
                <DatasetSelector mapVisualization={mapSpec} datasets={datasets} />
            ) : (
                <EmptyDatasetSelector />
            )}
            {mapSpec ? (
                <EditorMapTitle mapVisualization={mapSpec} key={mapSpec.id} />
            ) : (
                <EmptyMapTitle />
            )}
            <CanvasMap
                mapSpec={mapSpec}
                data={processedData}
                normalize={isNormalized}
                detailedView={detailedView}
            />

            {mapSpec && (
                <>
                    <EditorMapDescription selectedMap={mapSpec} />
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
                                    map_visualization: mapSpec.id,
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
                            onClick={() => deleteMap(mapSpec.id)}
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
