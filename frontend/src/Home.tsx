import { useEffect } from 'react'
import { json } from 'd3'
import { useDispatch } from 'react-redux'
import Footer from './Footer'
import Header from './Header'
import Navigation from './Navigation'
import DataSelector from './DataSelector'
import './App.css'
import { fetchMapVisualizations } from './MapVisualization'
import { store } from './store'
import MapWrapper from './MapWrapper'
import { OverlayName, setMap, setMapVisualizations, setOverlay } from './appSlice'
import SiteOverview from './SiteOverview'
import { TopoJson } from './TopoJson'

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

export const useThunkDispatch = () => useDispatch<typeof store.dispatch>()

function Home() {
    const dispatch = useThunkDispatch()

    useEffect(() => {
        json<TopoJson>(mapFile).then((topoJson) => {
            dispatch(setMap(topoJson))
        })

        Object.entries(overlayToFile).forEach(([name, file]) => {
            json<TopoJson>(file).then((topoJson) =>
                dispatch(setOverlay({ name: name as OverlayName, topoJson }))
            )
        })
        fetchMapVisualizations().then((mapVisualizations) => {
            dispatch(setMapVisualizations(mapVisualizations))
        })
    }, [dispatch])

    return (
        <>
            <Header />
            <Navigation />
            <SiteOverview />
            <div id="content">
                <DataSelector />
                <MapWrapper />
            </div>
            <Footer />
        </>
    )
}

export default Home
