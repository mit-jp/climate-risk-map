import { Button } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { json } from 'd3'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EmptyNavigation from '../EmptyNavigation'
import {
    Tab,
    useCreateMapVisualizationMutation,
    useGetMapVisualizationQuery,
    useGetMapVisualizationsQuery,
    useGetTabsQuery,
} from '../MapApi'
import { MapVisualizationPatch } from '../MapVisualization'
import Navigation from '../Navigation'
import { TopoJson } from '../TopoJson'
import { Region } from '../appSlice'
import { RootState } from '../store'
import editorCss from './Editor.module.css'
import EditorMap from './EditorMap'
import MapOptions, { EmptyMapOptions } from './MapOptions'
import MapVisualizationList, { EmptyMapVisualizationList } from './MapVisualizationList'
import {
    clickMapVisualization,
    selectSelectedTabAndMapVisualization,
    setMap,
    setTab,
} from './editorSlice'

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

export const isDrafts = (tab: Tab | undefined) => tab?.id === -1

function Editor() {
    const dispatch = useDispatch()
    const { data: allMapVisualizations } = useGetMapVisualizationsQuery({ includeDrafts: true })
    const { data: tabs } = useGetTabsQuery(true)
    const [createMap] = useCreateMapVisualizationMutation()

    const { selectedTab, selectedMapVisualizationId: maybeSelectedMap } = useSelector(
        selectSelectedTabAndMapVisualization
    )
    const mapVisualizationsForTab =
        allMapVisualizations && selectedTab !== undefined
            ? Object.values(allMapVisualizations[selectedTab.id] ?? []).sort(
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
        const region: Region = selectedMapVisualization?.geography_type === 2 ? 'World' : 'USA'
        const file = region === 'USA' ? '/usa.json' : '/world.json'
        json<TopoJson>(file).then((topoJson) => {
            if (topoJson) {
                dispatch(setMap({ topoJson, region }))
            }
        })
    }, [dispatch, selectedMapVisualization])

    const isNormalized = selectedTab?.normalized ?? false

    return (
        <>
            {tabs ? (
                <Navigation
                    tabs={tabs}
                    selectedTabId={selectedTab?.id}
                    onTabClick={(tab) => dispatch(setTab(tab))}
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
                            {isDrafts(selectedTab) && (
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
                {map && selectedTab && tabs && (
                    <EditorMap
                        map={map}
                        selection={isUninitialized ? undefined : selectedMapVisualization}
                        detailedView
                        isNormalized={isNormalized}
                        tab={selectedTab}
                        tabs={tabs.filter((tab) => !isDrafts(tab))}
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
