import { ScalePower, color as d3Color, geoContains, geoPath, scaleSqrt, select } from 'd3'
import Flatbush from 'flatbush'
import type { Feature, GeoJsonProperties, Geometry } from 'geojson'
import { Map } from 'immutable'
import React, { useEffect, useRef, useState } from 'react'
import * as topojson from 'topojson-client'
import type { GeometryCollection } from 'topojson-specification'
import css from './CanvasMap.module.css'
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
const EMPTY_MAP_COLOR = '#eee'

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
const dpi = window.devicePixelRatio || 1
export function UsaMap({
    us,
    mapSpec,
    data,
    width,
    height,
    normalize = false,
    detailedView = false,
}: UsaMapProps) {
    const mapCanvasRef = useRef<HTMLCanvasElement>(null)
    const highlightCanvasRef = useRef<HTMLCanvasElement>(null)
    const indexRef = useRef<Flatbush | null>(null)
    const counties = getCounties(us)
    const [value, setValue] = useState<number | undefined>()
    useEffect(() => {
        const canvas = select(mapCanvasRef.current)
        const context = canvas.node()?.getContext('2d')
        if (context == null) {
            return
        }
        context.clearRect(0, 0, width, height)
        const path = geoPath().context(context)
        context.lineJoin = 'round'
        context.lineCap = 'round'

        const drawChoropleth = (
            us: TopoJson,
            mapSpec: MapVisualization,
            data: Map<GeoId, number>
        ) => {
            indexRef.current = new Flatbush(counties.length)
            const colorScale = Color(normalize, detailedView, mapSpec, getDomain(data))
            counties.forEach((county) => {
                const bounds = path.bounds(county)
                indexRef.current?.add(
                    Math.floor(bounds[0][0]),
                    Math.floor(bounds[0][1]),
                    Math.ceil(bounds[1][0]),
                    Math.ceil(bounds[1][1])
                )
                const value = data.get(Number(county.id))
                context.beginPath()
                path(county)
                context.fillStyle = value != null ? colorScale(value) : MISSING_DATA_COLOR
                context.fill()
            })
            indexRef.current.finish()
        }

        const drawBubbles = (us: TopoJson, mapSpec: MapVisualization, data: Map<GeoId, number>) => {
            const { max } = getDomain(data)
            const valueToRadius = scaleSqrt([0, max], [0, 40])
            const regionToRadius = makeRegionToRadius(valueToRadius, data)
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

        // Nation
        context.beginPath()
        path(topojson.feature(us, us.objects.nation))
        context.fillStyle = EMPTY_MAP_COLOR
        context.fill()

        if (mapSpec && data) {
            //  Counties
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

            // States
            context.beginPath()
            path(topojson.mesh(us, us.objects.states as GeometryCollection, (a, b) => a !== b))
            context.lineWidth = 1
            context.strokeStyle = '#fff'
            context.stroke()
        }
    }, [data, mapSpec, us, width, height, normalize, detailedView, counties])
    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const canvas = highlightCanvasRef.current
        const context = canvas?.getContext('2d')
        if (canvas && context) {
            // Get the scaling factor
            const rect = canvas.getBoundingClientRect()
            const scaleX = canvas.width / rect.width
            const scaleY = canvas.height / rect.height

            // Translate mouse coordinates to canvas coordinates
            const x = (event.clientX - rect.left) * scaleX
            const y = (event.clientY - rect.top) * scaleY

            const results = indexRef.current?.search(x, y, x, y)
            if (!results || results.length === 0) {
                return
            }
            let found = results[0]
            let county = counties[found]
            // flatbush always returns an array of indexes and sometimes the good one is not the first one
            // let's search our result for the polygon that is under our mouse coordinates
            // https://observablehq.com/@luissevillano/using-flatbush-for-faster-hover-events-in-canvas-maps
            results.forEach((idx) => {
                county = counties[idx]
                if (geoContains(county, [x, y])) {
                    found = idx
                }
            })
            setValue(data?.get(Number(county.id)))

            // Draw the highlight over the currently hovered county
            context.clearRect(0, 0, width, height)
            const path = geoPath().context(context)
            context.lineJoin = 'round'
            context.lineCap = 'round'
            context.beginPath()
            path(county)
            context.fillStyle = 'rgba(225,225,225,0.5)'
            context.fill()
        }
    }
    return (
        <>
            <p>Value: {value}</p>
            <div className={css.container}>
                <canvas
                    className={css.map}
                    ref={mapCanvasRef}
                    width={width}
                    height={height}
                    onMouseMove={handleMouseMove}
                />
                <canvas
                    className={css.highlight}
                    ref={highlightCanvasRef}
                    width={width}
                    height={height}
                />
            </div>
        </>
    )
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
        context.setTransform(dpi, 0, 0, dpi, 0, 0)
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
    return <canvas ref={canvasRef} width={width * dpi} height={height * dpi} />
}
