import { json } from 'd3'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Link, useParams } from 'react-router-dom'
import classNames from 'classnames'
import { Button } from '@mui/material'
import { TopoJson } from '../TopoJson'
import { RootState, store } from '../store'
import editorCss from './Editor.module.css'
import { MapVisualizationPatch } from '../MapVisualization'
import navCss from '../Navigation.module.css'
import {
    clickMapVisualization,
    setTab,
    selectSelectedTabAndMapVisualization,
    setMap,
} from './editorSlice'
import {
    Tab,
    useCreateMapVisualizationMutation,
    useGetMapVisualizationQuery,
    useGetMapVisualizationsQuery,
    useGetTabsQuery,
} from '../MapApi'
import EditorMap from './EditorMap'
import MapVisualizationList, { EmptyMapVisualizationList } from './MapVisualizationList'
import MapOptions, { EmptyMapOptions } from './MapOptions'

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
}

export const useThunkDispatch = () => useDispatch<typeof store.dispatch>()

function EmptyNavigation() {
    return <nav />
}
function Navigation({ tabs, selectedTabId }: { tabs: Tab[]; selectedTabId?: number }) {
    const dispatch = useThunkDispatch()
    const params = useParams()
    const { tabId } = params
    useEffect(() => {
        const tab = Number(tabId)
        if (tab) {
            dispatch(setTab(tab))
        }
    }, [tabId, dispatch])

    return (
        <nav id={navCss.nav}>
            {tabs.map((tab) => (
                <Link
                    key={tab.id}
                    className={classNames({
                        [navCss.selected]: selectedTabId === tab.id,
                        [navCss.uncategorized]: tab.id === -1,
                    })}
                    to={`/editor/${tab.id}`}
                >
                    {tab.name}
                </Link>
            ))}
        </nav>
    )
}

function Editor() {
    const dispatch = useThunkDispatch()
    const { data: allMapVisualizations } = useGetMapVisualizationsQuery(true)
    const { data: tabs } = useGetTabsQuery(true)
    const [createMap] = useCreateMapVisualizationMutation()

    const { selectedTabId, selectedMapVisualizationId } = useSelector(
        selectSelectedTabAndMapVisualization
    )
    const { data: selectedMapVisualization } = useGetMapVisualizationQuery(
        selectedMapVisualizationId ?? skipToken
    )
    const mapVisualizationsForTab =
        allMapVisualizations && selectedTabId !== undefined
            ? Object.values(allMapVisualizations[selectedTabId]).sort((a, b) => a.order - b.order)
            : undefined
    const map = useSelector((state: RootState) => state.editor.map)

    useEffect(() => {
        json<TopoJson>('/usa.json').then((topoJson) => {
            if (topoJson) {
                dispatch(setMap(topoJson))
            }
        })
    }, [dispatch])

    // if we're viewing risk metrics, normalize to 0-1
    const isNormalized = selectedTabId === 8 ?? false

    return (
        <>
            {tabs ? <Navigation tabs={tabs} selectedTabId={selectedTabId} /> : <EmptyNavigation />}
            <div id={editorCss.editor}>
                <div>
                    {mapVisualizationsForTab ? (
                        <MapVisualizationList
                            mapVisualizations={mapVisualizationsForTab}
                            selectedId={selectedMapVisualizationId}
                            onClick={(clickedMap) => dispatch(clickMapVisualization(clickedMap))}
                        />
                    ) : (
                        <EmptyMapVisualizationList />
                    )}
                    <Button onClick={() => createMap(NEW_MAP)}>Create new map</Button>
                </div>
                {map && (
                    <EditorMap
                        map={map}
                        selection={selectedMapVisualization}
                        detailedView
                        isNormalized={isNormalized}
                    />
                )}
                {selectedMapVisualization && !isNormalized ? (
                    <MapOptions mapVisualization={selectedMapVisualization} />
                ) : (
                    <EmptyMapOptions />
                )}
            </div>
        </>
    )
}

export default Editor
