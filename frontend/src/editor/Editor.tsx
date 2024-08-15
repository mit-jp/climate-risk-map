import { Button } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { json } from 'd3'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import EmptyNavigation from '../EmptyNavigation'
import {
    Tab,
    useCreateMapVisualizationMutation,
    useDeleteTabMutation,
    useGetMapVisualizationQuery,
    useGetMapVisualizationsQuery,
    useGetTabsQuery,
} from '../MapApi'
import SelectorList, { EmptySelectorList } from '../SelectorList'
import { TopoJson } from '../TopoJson'
import { Region } from '../appSlice'
import { RootState } from '../store'
import editorCss from './Editor.module.css'
import EditorMap from './EditorMap'
import EditorNavigation from './EditorNavigation'
import MapOptions, { EmptyMapOptions } from './MapOptions'
import {
    clickMapVisualization,
    selectSelectedTabAndMapVisualization,
    setMap,
    setTab,
} from './editorSlice'

export const isDrafts = (tab: Tab | undefined) => tab?.id === -1

function Editor() {
    const dispatch = useDispatch()
    const { data: allMapVisualizations } = useGetMapVisualizationsQuery({ includeDrafts: true })
    const { data: tabs } = useGetTabsQuery(true)
    const [createMap] = useCreateMapVisualizationMutation()
    const [deleteTab] = useDeleteTabMutation()

    const { selectedTab: tab, selectedMapVisualizationId: maybeMapId } = useSelector(
        selectSelectedTabAndMapVisualization
    )
    const maps =
        allMapVisualizations && tab !== undefined
            ? Object.values(allMapVisualizations[tab.id] ?? []).sort((a, b) => a.order - b.order)
            : undefined
    const mapId = maps?.find((m) => m.id === maybeMapId) ? maybeMapId : undefined
    const { data: selectedMapVisualization, isUninitialized } = useGetMapVisualizationQuery(
        mapId ?? skipToken
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

    const isNormalized = tab?.normalized ?? false

    return (
        <>
            {tabs ? (
                <EditorNavigation
                    tabs={tabs}
                    selectedTabId={tab?.id}
                    onTabClick={(tab) => dispatch(setTab(tab))}
                    root="/editor/"
                />
            ) : (
                <EmptyNavigation />
            )}
            <div id={editorCss.editor}>
                <div id={editorCss.mapVisualizationList}>
                    {maps && maps.length > 0 ? (
                        <SelectorList
                            items={maps}
                            selectedId={mapId}
                            onClick={(clickedMap) => dispatch(clickMapVisualization(clickedMap))}
                            id={(map) => map.id}
                            label={(map) => map.displayName}
                        />
                    ) : (
                        <EmptySelectorList />
                    )}

                    {!isDrafts(tab) && maps && maps.length === 0 && tab && (
                        <div className={editorCss.actions}>
                            <Link to="/editor/-1" className={editorCss.publishLink}>
                                Publish a draft
                            </Link>

                            <button
                                type="button"
                                className={editorCss.deleteTab}
                                onClick={() => deleteTab(tab.id)}
                            >
                                delete this tab
                            </button>
                        </div>
                    )}
                    {isDrafts(tab) && (
                        <Button
                            id={editorCss.createMap}
                            onClick={() => createMap(undefined)}
                            variant="contained"
                        >
                            Create new map
                        </Button>
                    )}
                </div>
                {map && tab && tabs && (
                    <EditorMap
                        map={map}
                        selection={isUninitialized ? undefined : selectedMapVisualization}
                        detailedView
                        isNormalized={isNormalized}
                        tab={tab}
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
