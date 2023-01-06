import { useEffect } from 'react'
import { json } from 'd3'
import { useDispatch, useSelector } from 'react-redux'
import Header from './Header'
import Navigation from './Navigation'
import DataSelector from './DataSelector'
import css from './Home.module.css'
import { RootState } from './store'
import MapWrapper from './MapWrapper'
import { OverlayName, setTab, setMap, setOverlay, selectSelectedTabId } from './appSlice'
import { TopoJson } from './TopoJson'
import CountryNavigation from './CountryNavigation'
import { useGetMapVisualizationsQuery, useGetTabsQuery } from './MapApi'
import EmptyNavigation from './EmptyNavigation'
import EmptyDataSelector from './EmptyDataSelector'

type TopoJsonFile =
    | 'usa.json'
    | 'roads-topo.json'
    | 'railroads-topo.json'
    | 'waterways-topo.json'
    | 'transmission-lines-topo.json'
    | 'critical-habitats-topo.json'
    | 'endangered-species-topo.json'

type OverlayMap = Record<OverlayName, TopoJsonFile>

const overlayToFile: OverlayMap = {
    Highways: 'roads-topo.json',
    'Major railroads': 'railroads-topo.json',
    'Transmission lines': 'transmission-lines-topo.json',
    'Marine highways': 'waterways-topo.json',
    'Critical water habitats': 'critical-habitats-topo.json',
    'Endangered species': 'endangered-species-topo.json',
}
const mapFile: TopoJsonFile = 'usa.json'

function Home() {
    const dispatch = useDispatch()
    const region = useSelector((state: RootState) => state.app.selectedRegion)
    const { data: tabs } = useGetTabsQuery(false)
    const tabId = useSelector(selectSelectedTabId)
    const { data: mapVisualizations } = useGetMapVisualizationsQuery({
        geographyType: region === 'USA' ? 1 : 2,
    })

    const isNormalized = tabs != null && tabId != null ? tabs[tabId].normalized : false
    const displayedTabs =
        mapVisualizations != null && tabId != null && tabs != null
            ? Object.keys(mapVisualizations).map((tabId) => tabs[Number(tabId)])
            : []

    useEffect(() => {
        json<TopoJson>(mapFile).then((topoJson) => {
            dispatch(setMap(topoJson))
        })

        Object.entries(overlayToFile).forEach(([name, file]) => {
            json<TopoJson>(file).then((topoJson) =>
                dispatch(setOverlay({ name: name as OverlayName, topoJson }))
            )
        })
    }, [dispatch, region])

    return (
        <>
            <Header />
            <CountryNavigation />
            {tabs ? (
                <Navigation
                    tabs={displayedTabs}
                    onTabClick={(tab) => dispatch(setTab(tab.id))}
                    selectedTabId={tabId}
                />
            ) : (
                <EmptyNavigation />
            )}
            {isNormalized && (
                <div id={css.siteOverview}>
                    <p>
                        You can select multiple metrics and adjust their relative importance to view
                        the combined impact. To see additional and supporting data, select the other
                        categories.
                    </p>
                </div>
            )}
            <div id={css.content}>
                {tabs && mapVisualizations && tabId ? (
                    <DataSelector
                        isNormalized={isNormalized}
                        maps={mapVisualizations[tabId] ?? {}}
                    />
                ) : (
                    <EmptyDataSelector />
                )}
                {tabs && mapVisualizations && tabId ? (
                    <MapWrapper
                        isNormalized={isNormalized}
                        allMapVisualizations={mapVisualizations[tabId] ?? {}}
                    />
                ) : (
                    <p>No Map</p>
                )}
            </div>
        </>
    )
}

export default Home
