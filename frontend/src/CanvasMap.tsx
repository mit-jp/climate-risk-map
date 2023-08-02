import { ScalePower, color as d3Color, geoPath, scaleSqrt, select } from 'd3'
import type { Feature, GeoJsonProperties, Geometry } from 'geojson'
import { Map } from 'immutable'
import { useEffect, useRef } from 'react'
import * as topojson from 'topojson-client'
import type { GeometryCollection } from 'topojson-specification'
import { USACounties as getCounties, countries as getCountries } from './ChoroplethMap'
import Color from './Color'
import { getDomain } from './DataProcessor'
import { MapType, MapVisualization } from './MapVisualization'
import { TopoJson } from './TopoJson'
import { GeoId } from './appSlice'

type UsaMapProps = {
    us: TopoJson
    mapSpec: MapVisualization | undefined
    data: Map<GeoId, number> | undefined
    width: number
    height: number
    normalize?: boolean
    detailedView?: boolean
}

const MISSING_DATA_COLOR = '#ccc'

const makeRegionToRadius =
    (valueToRadius: ScalePower<number, number, never>, data: Map<GeoId, number>) =>
    (county: Feature<Geometry, GeoJsonProperties>) => {
        const value = data.get(Number(county.id)) ?? 0
        return valueToRadius(value)
    }

function makeOpaque(colorString: string, opacity: number) {
    const color = d3Color(colorString)?.rgb()
    return color ? `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})` : null
}
export function UsaMap({
    us,
    mapSpec,
    data,
    width,
    height,
    normalize = false,
    detailedView = false,
}: UsaMapProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        const canvas = select(canvasRef.current)
        const context = canvas.node()?.getContext('2d')
        if (context == null) {
            return
        }
        context.clearRect(0, 0, width, height)
        const path = geoPath().context(context)
        context.canvas.style.maxWidth = '100%'
        context.lineJoin = 'round'
        context.lineCap = 'round'

        const drawChoropleth = (
            us: TopoJson,
            mapSpec: MapVisualization,
            data: Map<GeoId, number>
        ) => {
            const counties = getCounties(us)
            const colorScale = Color(normalize, detailedView, mapSpec, getDomain(data))
            counties.forEach((county) => {
                const value = data.get(Number(county.id))
                context.beginPath()
                path(county)
                context.fillStyle = value != null ? colorScale(value) : MISSING_DATA_COLOR
                context.fill()
            })
        }

        const drawBubbles = (us: TopoJson, mapSpec: MapVisualization, data: Map<GeoId, number>) => {
            const { max } = getDomain(data)
            const valueToRadius = scaleSqrt([0, max], [0, 40])
            const regionToRadius = makeRegionToRadius(valueToRadius, data)
            const counties = getCounties(us)
            counties.forEach((county) => {
                context.beginPath()
                context.arc(
                    path.centroid(county)[0],
                    path.centroid(county)[1],
                    regionToRadius(county),
                    0,
                    2 * Math.PI
                )
                context.fillStyle = makeOpaque(mapSpec.bubble_color, 0.5) ?? MISSING_DATA_COLOR
                context.fill()
                context.strokeStyle = 'rgba(225,225,225,0.5)'
                context.lineWidth = 1
                context.stroke()
            })
        }

        // Data
        if (mapSpec && data) {
            switch (mapSpec.map_type) {
                case MapType.Choropleth:
                    drawChoropleth(us, mapSpec, data)
                    break
                case MapType.Bubble:
                    drawBubbles(us, mapSpec, data)
                    break
                default:
                    throw new Error(`Unknown map type: ${mapSpec.map_type}`)
            }
        }

        // States
        context.beginPath()
        path(topojson.mesh(us, us.objects.states as GeometryCollection, (a, b) => a !== b))
        context.lineWidth = 0.5
        context.strokeStyle = '#000'
        context.stroke()

        // Nation
        context.beginPath()
        path(topojson.feature(us, us.objects.nation))
        context.lineWidth = 1
        context.strokeStyle = '#000'
        context.stroke()
    }, [data, mapSpec, us, width, height, normalize, detailedView])
    return <canvas ref={canvasRef} width={width} height={height} />
}

type WorldMapProps = {
    world: TopoJson
    mapSpec: MapVisualization | undefined
    data: Map<GeoId, number> | undefined
    width: number
    height: number
    normalize?: boolean
    detailedView?: boolean
}

export function WorldMap({
    world,
    mapSpec,
    data,
    width,
    height,
    normalize = false,
    detailedView = false,
}: WorldMapProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        const canvas = select(canvasRef.current)
        const context = canvas.node()?.getContext('2d')
        if (context == null) {
            return
        }
        context.clearRect(0, 0, width, height)
        const path = geoPath().context(context)
        context.canvas.style.maxWidth = '100%'
        context.lineJoin = 'round'
        context.lineCap = 'round'

        const drawWorldMap = (
            world: TopoJson,
            mapSpec: MapVisualization,
            data: Map<GeoId, number>
        ) => {
            const countries = getCountries(world)
            const colorScale = Color(normalize, detailedView, mapSpec, getDomain(data))
            countries.forEach((country) => {
                const value = data.get(Number(country.id))
                context.beginPath()
                path(country)
                context.fillStyle = value != null ? colorScale(value) : MISSING_DATA_COLOR
                context.fill()
            })
        }

        const drawEmptyWorldMap = (world: TopoJson) => {
            const countries = getCountries(world)
            countries.forEach((country) => {
                context.beginPath()
                path(country)
                context.fillStyle = MISSING_DATA_COLOR
                context.fill()
            })
        }

        if (mapSpec && data) {
            drawWorldMap(world, mapSpec, data)
        } else {
            drawEmptyWorldMap(world)
        }
    }, [data, mapSpec, world, width, height, normalize, detailedView])
    return <canvas ref={canvasRef} width={width} height={height} />
}
