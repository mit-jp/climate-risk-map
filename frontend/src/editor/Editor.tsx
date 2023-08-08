import { Button } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import EmptyNavigation from '../EmptyNavigation'
import {
    Tab,
    useCreateMapSpecMutation,
    useDeleteTabMutation,
    useGetMapSpecQuery,
    useGetMapSpecsQuery,
    useGetTabsQuery,
} from '../MapApi'
import SelectorList, { EmptySelectorList } from '../SelectorList'
import editorCss from './Editor.module.css'
import EditorMap from './EditorMap'
import EditorNavigation from './EditorNavigation'
import MapOptions, { EmptyMapOptions } from './MapOptions'
import { clickMapSpec, selectSelectedTabAndMapSpec, setTab } from './editorSlice'

export const isDrafts = (tab: Tab | undefined) => tab?.id === -1

function Editor() {
    const dispatch = useDispatch()
    const { data: allMapSpecs } = useGetMapSpecsQuery({ includeDrafts: true })
    const { data: tabs } = useGetTabsQuery(true)
    const [createMap] = useCreateMapSpecMutation()
    const [deleteTab] = useDeleteTabMutation()

    const { selectedTab: tab, selectedMapSpecId: maybeMapSpecId } = useSelector(
        selectSelectedTabAndMapSpec
    )
    const maps =
        allMapSpecs && tab !== undefined
            ? Object.values(allMapSpecs[tab.id] ?? []).sort((a, b) => a.order - b.order)
            : undefined
    const mapId = maps?.find((m) => m.id === maybeMapSpecId) ? maybeMapSpecId : undefined
    const { data: mapSpec, isUninitialized } = useGetMapSpecQuery(mapId ?? skipToken)
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
                <div id={editorCss.mapSpecList}>
                    {maps && maps.length > 0 ? (
                        <SelectorList
                            items={maps}
                            selectedId={mapId}
                            onClick={(clickedMap) => dispatch(clickMapSpec(clickedMap))}
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
                {tab && tabs && (
                    <EditorMap
                        mapSpec={isUninitialized ? undefined : mapSpec}
                        detailedView
                        isNormalized={isNormalized}
                        tab={tab}
                        tabs={tabs.filter((tab) => !isDrafts(tab))}
                    />
                )}
                {!isUninitialized && mapSpec && !isNormalized ? (
                    <MapOptions mapSpec={mapSpec} />
                ) : (
                    <EmptyMapOptions />
                )}
            </div>
        </>
    )
}

export default Editor
