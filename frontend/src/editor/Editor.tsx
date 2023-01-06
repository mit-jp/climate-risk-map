import { json } from 'd3'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Button } from '@mui/material'
import { TopoJson } from '../TopoJson'
import { RootState } from '../store'
import editorCss from './Editor.module.css'
import { MapVisualizationPatch } from '../MapVisualization'
import {
    clickMapVisualization,
    selectSelectedTabAndMapVisualization,
    setMap,
    setTab,
} from './editorSlice'
import {
    useCreateMapVisualizationMutation,
    useGetMapVisualizationQuery,
    useGetMapVisualizationsQuery,
    useGetTabsQuery,
} from '../MapApi'
import EditorMap from './EditorMap'
import MapVisualizationList, { EmptyMapVisualizationList } from './MapVisualizationList'
import MapOptions, { EmptyMapOptions } from './MapOptions'
import Navigation from '../Navigation'
import EmptyNavigation from '../EmptyNavigation'

const NEW_MAP: MapVisualizationPatch = {
    id: -1,
    dataset: 1,
    map_type: 1,
    color_palette: { id: 1, name: 'Blues' },
    reverse_scale: false,
    invert_normalized: false,
    scale_type: { id: 2, name: 'Sequential' },
    color_domain: [],
    show_pdf: true,
    pdf_domain: [],
    formatter_type: 3,
    decimals: 1,
    geography_type: 1,
    bubble_color: '#000000',
}

function Editor() {
    const dispatch = useDispatch()
    const { data: allMapVisualizations } = useGetMapVisualizationsQuery({ includeDrafts: true })
    const { data: tabs } = useGetTabsQuery(true)
    const [createMap] = useCreateMapVisualizationMutation()

    const { selectedTabId, selectedMapVisualizationId: maybeSelectedMap } = useSelector(
        selectSelectedTabAndMapVisualization
    )
    const mapVisualizationsForTab =
        allMapVisualizations && selectedTabId !== undefined
            ? Object.values(allMapVisualizations[selectedTabId] ?? []).sort(
                  (a, b) => a.order - b.order
              )
            : undefined
    const selectedMap = mapVisualizationsForTab?.find((m) => m.id === maybeSelectedMap)
        ? maybeSelectedMap
        : undefined
    const { data: selectedMapVisualization, isUninitialized } = useGetMapVisualizationQuery(
        selectedMap ?? skipToken
    )
    const map = useSelector((state: RootState) => state.editor.map)

    useEffect(() => {
        json<TopoJson>('/usa.json').then((topoJson) => {
            if (topoJson) {
                dispatch(setMap(topoJson))
            }
        })
    }, [dispatch])

    const selectedTab = tabs != null && selectedTabId != null ? tabs[selectedTabId] : undefined
    const isNormalized = selectedTab?.normalized ?? false
    const tabList = Object.values(tabs ?? [])

    return (
        <>
            {tabs ? (
                <Navigation
                    tabs={tabList}
                    selectedTabId={selectedTabId}
                    onTabClick={(tab) => dispatch(setTab(tab.id))}
                    root="/editor/"
                />
            ) : (
                <EmptyNavigation />
            )}
            <div id={editorCss.editor}>
                <div id={editorCss.mapVisualizationList}>
                    {mapVisualizationsForTab ? (
                        <>
                            <MapVisualizationList
                                mapVisualizations={mapVisualizationsForTab}
                                selectedId={selectedMap}
                                onClick={(clickedMap) =>
                                    dispatch(clickMapVisualization(clickedMap))
                                }
                            />
                            {selectedTabId === -1 && (
                                <Button
                                    id={editorCss.createMap}
                                    onClick={() => createMap(NEW_MAP)}
                                    variant="contained"
                                >
                                    Create new map
                                </Button>
                            )}
                        </>
                    ) : (
                        <EmptyMapVisualizationList />
                    )}
                </div>
                {map && (
                    <EditorMap
                        map={map}
                        selection={isUninitialized ? undefined : selectedMapVisualization}
                        detailedView
                        isNormalized={isNormalized}
                    />
                )}
                {!isUninitialized && selectedMapVisualization && !isNormalized ? (
                    <MapOptions mapVisualization={selectedMapVisualization} />
                ) : (
                    <EmptyMapOptions />
                )}
            </div>
        </>
    )
}

export default Editor
