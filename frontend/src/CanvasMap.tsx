import {
    GeoPath,
    GeoPermissibleObjects,
    ScalePower,
    color as d3Color,
    geoContains,
    geoPath,
    scaleSqrt,
    select,
} from 'd3'
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

export function GenericMap({
    draw,
    width = 975,
    height = 610,
    features,
    data,
}: {
    draw: (drawPath: GeoPath<any, GeoPermissibleObjects>, context: CanvasRenderingContext2D) => void
    width?: number
    height?: number
    features: Feature<Geometry, GeoJsonProperties>[]
    data: Map<GeoId, number> | undefined
}) {
    const mapCanvasRef = useRef<HTMLCanvasElement>(null)
    const highlightCanvasRef = useRef<HTMLCanvasElement>(null)
    const [value, setValue] = useState<number | undefined>()

    useEffect(() => {
        const context = select(mapCanvasRef.current).node()?.getContext('2d')
        if (context == null) return

        context.clearRect(0, 0, width, height)
        const drawPath = geoPath().context(context)
        context.lineJoin = 'round'
        context.lineCap = 'round'

        draw(drawPath, context)
    }, [draw, height, width])

    // Create a spatial index for the features
    const indexRef = useRef<Flatbush | null>(null)
    useEffect(() => {
        if (features) {
            indexRef.current = new Flatbush(features.length)
            features.forEach((feature) => {
                const bounds = geoPath().bounds(feature)
                indexRef.current?.add(
                    Math.floor(bounds[0][0]),
                    Math.floor(bounds[0][1]),
                    Math.ceil(bounds[1][0]),
                    Math.ceil(bounds[1][1])
                )
            })
            indexRef.current.finish()
        }
    }, [features])

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (!features) return
        const canvas = highlightCanvasRef.current
        const context = canvas?.getContext('2d')
        if (!canvas || !context) return

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
        let feature = features[found]
        // flatbush always returns an array of indexes and sometimes the good one is not the first one
        // let's search our result for the polygon that is under our mouse coordinates
        // https://observablehq.com/@luissevillano/using-flatbush-for-faster-hover-events-in-canvas-maps
        results.forEach((idx) => {
            feature = features[idx]
            if (geoContains(feature, [x, y])) {
                found = idx
            }
        })
        setValue(data?.get(Number(feature.id)))

        // Draw the highlight over the currently hovered feature
        context.clearRect(0, 0, width, height)
        const drawPath = geoPath().context(context)
        context.lineJoin = 'round'
        context.lineCap = 'round'
        context.beginPath()
        drawPath(feature)
        context.fillStyle = 'rgba(225,225,225,0.5)'
        context.fill()
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
                {features && (
                    <canvas
                        className={css.highlight}
                        ref={highlightCanvasRef}
                        width={width}
                        height={height}
                    />
                )}
            </div>
        </>
    )
}

export function UsaMap({
    map,
    mapSpec,
    data,
    normalize = false,
    detailedView = true,
}: {
    map: TopoJson
    mapSpec: MapVisualization | undefined
    data: Map<GeoId, number> | undefined
    normalize?: boolean
    detailedView?: boolean
}) {
    const counties = getCounties(map)

    const draw = (
        drawPath: GeoPath<any, GeoPermissibleObjects>,
        context: CanvasRenderingContext2D
    ) => {
        // Nation
        context.beginPath()
        drawPath(topojson.feature(map, map.objects.nation))
        context.fillStyle = EMPTY_MAP_COLOR
        context.fill()

        //  Counties
        if (mapSpec && data) {
            switch (mapSpec.map_type) {
                case MapType.Choropleth: {
                    const colorScale = Color(normalize, detailedView, mapSpec, getDomain(data))
                    counties.forEach((county) => {
                        const value = data.get(Number(county.id))
                        context.beginPath()
                        drawPath(county)
                        context.fillStyle = value != null ? colorScale(value) : MISSING_DATA_COLOR
                        context.fill()
                    })
                    break
                }
                case MapType.Bubble: {
                    const { max } = getDomain(data)
                    const valueToRadius = scaleSqrt([0, max], [0, 40])
                    const regionToRadius = makeRegionToRadius(valueToRadius, data)
                    counties.forEach((county) => {
                        context.beginPath()
                        context.arc(
                            drawPath.centroid(county)[0],
                            drawPath.centroid(county)[1],
                            regionToRadius(county),
                            0,
                            2 * Math.PI
                        )
                        context.fillStyle =
                            makeOpaque(mapSpec.bubble_color, 0.5) ?? MISSING_DATA_COLOR
                        context.fill()
                        context.strokeStyle = 'rgba(225,225,225,0.5)'
                        context.lineWidth = 1
                        context.stroke()
                    })
                    break
                }
                default:
                    throw new Error(`Unknown map type: ${mapSpec.map_type}`)
            }
        }

        // States
        context.beginPath()
        drawPath(topojson.mesh(map, map.objects.states as GeometryCollection, (a, b) => a !== b))
        context.lineWidth = 1
        context.strokeStyle = '#fff'
        context.stroke()
    }

    return <GenericMap features={counties} data={data} draw={draw} />
}

type WorldMapProps = {
    world: TopoJson
    mapSpec: MapVisualization | undefined
    data: Map<GeoId, number> | undefined
    normalize?: boolean
    detailedView?: boolean
}

export function WorldMap({
    world,
    mapSpec,
    data,
    normalize = false,
    detailedView = false,
}: WorldMapProps) {
    const countries = getCountries(world)
    const draw = (
        drawPath: GeoPath<any, GeoPermissibleObjects>,
        context: CanvasRenderingContext2D
    ) => {
        if (mapSpec && data) {
            const colorScale = Color(normalize, detailedView, mapSpec, getDomain(data))
            countries.forEach((country) => {
                const value = data.get(Number(country.id))
                context.beginPath()
                drawPath(country)
                context.fillStyle = value != null ? colorScale(value) : MISSING_DATA_COLOR
                context.fill()
            })
        } else {
            countries.forEach((country) => {
                context.beginPath()
                drawPath(country)
                context.fillStyle = MISSING_DATA_COLOR
                context.fill()
            })
        }
    }
    return <GenericMap draw={draw} features={countries} data={data} />
}
