import { geoPath } from 'd3'
import type { Feature, GeoJsonProperties, Geometry } from 'geojson'
import { useSelector } from 'react-redux'
import { feature } from 'topojson-client'
import type { GeometryCollection } from 'topojson-specification'
import { TopoJson } from './TopoJson'
import { OverlayName, selectMapTransform } from './appSlice'
import { RootState } from './store'

const linePath = geoPath()
const pointPath = geoPath().pointRadius(1)

function Overlays() {
    const overlays = useSelector((state: RootState) => state.app.overlays)
    const waterwayValue = useSelector((state: RootState) => state.app.waterwayValue)
    const transmissionLineType = useSelector((state: RootState) => state.app.transmissionLineType)
    const transform = useSelector(selectMapTransform)

    const generatePaths = (name: OverlayName, topoJson: TopoJson) => {
        let { features } = feature(
            topoJson,
            topoJson.objects.overlay as GeometryCollection<GeoJsonProperties>
        )
        let strokeWidth: (d: Feature<Geometry, GeoJsonProperties>) => number
        let color: (d: Feature<Geometry, GeoJsonProperties>) => string
        let fill: (d: Feature<Geometry, GeoJsonProperties>) => string = () => 'none'
        let path = linePath
        switch (name) {
            case 'Highways':
                strokeWidth = (d) => (1 / d.properties!.scalerank) * 5
                color = () => 'grey'
                break
            case 'Marine highways':
                strokeWidth = (d) => Math.sqrt(d.properties![waterwayValue] / 5_000_000)
                color = () => '#0099ff'
                break
            case 'Transmission lines':
                strokeWidth = (d) => (d.properties!.V >= 345 ? 2 : 1)
                color = (d) => (d.properties!.V < 345 ? '#1b9e77' : '#d95f02')
                switch (transmissionLineType) {
                    case 'Level 2 (230kV-344kV)':
                        features = features.filter((d) => d.properties!.V < 345)
                        break
                    case 'Level 3 (>= 345kV)':
                        features = features.filter((d) => d.properties!.V >= 345)
                        break
                    default:
                }
                break
            case 'Major railroads':
                strokeWidth = () => 1
                color = () => 'grey'
                break
            case 'Critical water habitats':
                strokeWidth = () => 1
                color = () => '#0099ff'
                break
            case 'Endangered species':
                color = () => 'none'
                fill = () => 'rgba(235, 33, 100, 0.2)'
                strokeWidth = () => 0
                path = pointPath
                break
            default:
        }
        return features.map((f, index) => (
            <path
                key={f.id ?? index}
                stroke={color(f)}
                strokeWidth={strokeWidth(f)}
                fill={fill(f)}
                d={path(f) ?? undefined}
                style={{ transition: 'stroke-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
        ))
    }

    return (
        <>
            {Object.entries(overlays)
                .filter(([, overlay]) => overlay.shouldShow && overlay.topoJson)
                .map(([name, overlay]) => [name, overlay.topoJson] as [OverlayName, TopoJson])
                .map(([name, topoJson]) => (
                    <g id={name.replaceAll(' ', '-')} key={name} transform={transform}>
                        {generatePaths(name, topoJson)}
                    </g>
                ))}
        </>
    )
}

export default Overlays
