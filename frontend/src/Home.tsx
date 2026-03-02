import { json } from 'd3'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RegionNavigation from './CountryNavigation'
import DataSelector from './DataSelector'
import EmptyDataSelector from './EmptyDataSelector'
import EmptyNavigation from './EmptyNavigation'
import Header from './Header'
import css from './Home.module.css'
import { useGetMapVisualizationsQuery, useGetTabsQuery } from './MapApi'
import MapWrapper from './MapWrapper'
import mapCss from './MapWrapper.module.css'
import Navigation from './Navigation'
import { TopoJson } from './TopoJson'
import { OverlayName, Region, selectSelectedTab, setMap, setOverlay, setTab } from './appSlice'
import { RootState } from './store'
import TourPlanner from './tour/TourPlanner'
import ViewTourButton from './tour/ViewTourButton'
import Loading from './LoadingScreen'

// Map overlays
type TopoJsonFile =
    | 'usa.json'
    | 'world.json'
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
const usaFile: { name: TopoJsonFile; region: Region } = { name: 'usa.json', region: 'USA' }
const worldFile: { name: TopoJsonFile; region: Region } = { name: 'world.json', region: 'World' }

function Home() {
    const dispatch = useDispatch()
    const region = useSelector((state: RootState) => state.app.region)
    const { data: tabs, isLoading: tabsLoading } = useGetTabsQuery(false)
    const tab = useSelector(selectSelectedTab)
    const { data: mapVisualizations, isLoading: mapVisualizationsLoading } =
        useGetMapVisualizationsQuery({
            geographyType: region === 'USA' ? 1 : 2,
        })

    const isNormalized = tab?.normalized ?? false
    const displayedTabs =
        mapVisualizations != null && tabs != null
            ? tabs.filter((tab) => tab.id in mapVisualizations)
            : []

    useEffect(() => {
        const file = region === 'USA' ? usaFile : worldFile
        json<TopoJson>(file.name).then((topoJson) => {
            dispatch(setMap(topoJson ? { topoJson, region } : undefined))
        })

        Object.entries(overlayToFile).forEach(([name, file]) => {
            json<TopoJson>(file).then((topoJson) =>
                dispatch(setOverlay({ name: name as OverlayName, topoJson }))
            )
        })
    }, [dispatch, region])

    return (
        <>
            <TourPlanner />
            <Header />
            <div className={css.navDiv} id="navdiv">
                {tabs ? (
                    <Navigation
                        tabs={displayedTabs}
                        onTabClick={(tab) => dispatch(setTab(tab))}
                        selectedTabId={tab?.id}
                    />
                ) : (
                    <EmptyNavigation />
                )}
                <RegionNavigation />
            </div>
            {isNormalized && (
                <aside className={css.siteOverview}>
                    <p>
                        Select multiple metrics and adjust their relative importance to view the
                        combined impact. To see additional and supporting data, select the other
                        categories.
                    </p>
                </aside>
            )}
            <main className={css.content}>
                {tabs && mapVisualizations && tab ? (
                    <DataSelector
                        isNormalized={isNormalized}
                        maps={mapVisualizations[tab.id] ?? {}}
                    />
                ) : (
                    <EmptyDataSelector />
                )}

                {(tabsLoading || mapVisualizationsLoading) && <Loading />}
                {!tabsLoading && !mapVisualizationsLoading && tabs && mapVisualizations && tab && (
                    <MapWrapper
                        isNormalized={isNormalized}
                        allMapVisualizations={mapVisualizations[tab.id] ?? {}}
                    />
                )}
                {!tabsLoading &&
                    !mapVisualizationsLoading &&
                    !(tabs && mapVisualizations && tab) && <p className={mapCss.map}>No Map</p>}
            </main>
            <ViewTourButton />
        </>
    )
}

export default Home
