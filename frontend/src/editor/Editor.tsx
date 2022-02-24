import { json } from 'd3'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Link, useParams } from 'react-router-dom'
import { TopoJson } from '../TopoJson'
import { RootState, store } from '../store'
import editorCss from './Editor.module.css'
import navCss from '../Navigation.module.css'
import {
    clickMapVisualization,
    setTab,
    selectSelectedTabAndMapVisualization,
    setMap,
} from './editorSlice'
import {
    Tab,
    useGetMapVisualizationQuery,
    useGetMapVisualizationsQuery,
    useGetTabsQuery,
} from '../MapApi'
import EditorMap from './EditorMap'
import MapVisualizationList, { EmptyMapVisualizationList } from './MapVisualizationList'
import MapOptions, { EmptyMapOptions } from './MapOptions'
import DataTab from '../DataTab'
import { TabIdToTab, TabToId } from '../MapVisualization'

export const useThunkDispatch = () => useDispatch<typeof store.dispatch>()

function EmptyNavigation() {
    return <nav />
}
function Navigation({ tabs, selectedTabId }: { tabs: Tab[]; selectedTabId?: DataTab }) {
    const dispatch = useThunkDispatch()
    const params = useParams()
    const { tabId } = params
    useEffect(() => {
        const tab = TabIdToTab[Number(tabId)]
        if (tab) {
            dispatch(setTab(tab))
        }
    }, [tabId, dispatch])

    return (
        <nav id={navCss.nav}>
            {tabs.map((tab) => (
                <Link
                    key={tab.id}
                    className={selectedTabId === TabIdToTab[tab.id] ? navCss.selected : undefined}
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
    const { data: allMapVisualizations } = useGetMapVisualizationsQuery(undefined)
    const { data: tabs } = useGetTabsQuery(undefined)
    const { selectedTabId, selectedMapVisualizationId } = useSelector(
        selectSelectedTabAndMapVisualization
    )
    const { data: selectedMapVisualization } = useGetMapVisualizationQuery(
        selectedMapVisualizationId ?? skipToken
    )
    const mapVisualizationsForTab =
        allMapVisualizations && selectedTabId !== undefined
            ? Object.values(allMapVisualizations[TabToId[selectedTabId]]).sort(
                  (a, b) => a.order - b.order
              )
            : undefined
    const map = useSelector((state: RootState) => state.editor.map)

    useEffect(() => {
        json<TopoJson>('/usa.json').then((topoJson) => {
            if (topoJson) {
                dispatch(setMap(topoJson))
            }
        })
    }, [dispatch])

    const isNormalized = selectedTabId === DataTab.RiskMetrics ?? false

    return (
        <>
            {tabs ? <Navigation tabs={tabs} selectedTabId={selectedTabId} /> : <EmptyNavigation />}
            <div id={editorCss.editor}>
                {mapVisualizationsForTab ? (
                    <MapVisualizationList
                        mapVisualizations={mapVisualizationsForTab}
                        selectedId={selectedMapVisualizationId}
                        onClick={(clickedMap) => dispatch(clickMapVisualization(clickedMap))}
                    />
                ) : (
                    <EmptyMapVisualizationList />
                )}
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
