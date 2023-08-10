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
import { MouseEvent, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import * as topojson from 'topojson-client'
import { feature } from 'topojson-client'
import type { GeometryCollection } from 'topojson-specification'
import css from './CanvasMap.module.css'
import Color from './Color'
import counties from './Counties'
import tooltipCss from './CountyTooltip.module.css'
import { getDomain } from './DataProcessor'
import { formatData } from './Formatter'
import { GeographyType, MapSpec, MapType } from './MapVisualization'
import nations from './Nations'
import states from './States'
import { TopoJson } from './TopoJson'
import { GeoId, clickMap, stateId } from './appSlice'
import usaRaw from './usa.json'
import worldRaw from './world.json'

const USA = usaRaw as unknown as TopoJson
const COUNTIES = feature(
    USA,
    USA.objects.counties as GeometryCollection<GeoJsonProperties>
).features
const STATE_PATH = topojson.mesh(USA, USA.objects.states as GeometryCollection, (a, b) => a !== b)
const NATION_PATH = topojson.feature(USA, USA.objects.nation)

const WORLD = worldRaw as unknown as TopoJson
const NATIONS = feature(
    WORLD,
    WORLD.objects.countries as GeometryCollection<GeoJsonProperties>
).features

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

function geoName(id: number, geoType: GeographyType): string | undefined {
    switch (geoType) {
        case GeographyType.UsaCounty: {
            const county = counties.get(id)
            const state = states.get(stateId(id))
            return county && state ? `${county}, ${state}` : undefined
        }
        case GeographyType.World:
            return nations.get(id) ?? undefined
        case GeographyType.UsaState:
            return states.get(id) ?? undefined
        default:
            throw new Error(`Unknown geography type ${geoType}`)
    }
}

function format({
    id,
    value,
    mapSpec,
    geoType,
    normalize,
}: {
    id: number
    value: number | undefined
    mapSpec: MapSpec
    geoType: GeographyType
    normalize: boolean
}): string {
    let text = ''
    if (!mapSpec) return text
    const name = geoName(id, geoType) ?? '---'
    text = `${name}: ${formatData(value, {
        type: mapSpec.formatter_type,
        decimals: mapSpec.decimals,
        units: mapSpec.units,
        isNormalized: normalize,
    })}`
    return text
}

export function GenericMap({
    draw,
    format = ({ value }) => value?.toLocaleString() || 'No data',
    width = 975,
    height = 610,
    features,
    data,
    transform,
}: {
    draw: (drawPath: GeoPath<any, GeoPermissibleObjects>, context: CanvasRenderingContext2D) => void
    format?: ({ id, value }: { id: number; value: number | undefined }) => string
    width?: number
    height?: number
    features: Feature<Geometry, GeoJsonProperties>[]
    data: Map<GeoId, number> | undefined
    transform?: { scale: number; translate: [number, number] }
}) {
    const mapCanvasRef = useRef<HTMLCanvasElement>(null)
    const highlightCanvasRef = useRef<HTMLCanvasElement>(null)
    const [value, setValue] = useState<number | undefined>()
    const [id, setId] = useState<number | undefined>()
    const [hover, setHover] = useState<{ x: number; y: number } | undefined>()
    const dispatch = useDispatch()

    useEffect(() => {
        const context = highlightCanvasRef.current?.getContext('2d')
        if (!context) return
        context.clearRect(0, 0, width, height)
        if (transform) {
            context.translate(transform.translate[0], transform.translate[1])
            context.scale(transform.scale, transform.scale)
        } else {
            context.resetTransform()
        }
    }, [transform, width, height])

    useEffect(() => {
        const context = select(mapCanvasRef.current).node()?.getContext('2d')
        if (context == null) return

        context.clearRect(0, 0, width, height)

        if (transform) {
            context.translate(transform.translate[0], transform.translate[1])
            context.scale(transform.scale, transform.scale)
        } else {
            context.resetTransform()
        }

        const drawPath = geoPath().context(context)
        context.lineJoin = 'round'
        context.lineCap = 'round'

        draw(drawPath, context)
    }, [draw, height, width, transform])

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

    const hoverInfo = (event: MouseEvent<HTMLCanvasElement>) => {
        if (!features) return null
        const canvas = highlightCanvasRef.current
        const context = canvas?.getContext('2d')
        if (!canvas || !context) return null

        // Get the scaling factor
        const rect = canvas.getBoundingClientRect()
        let scaleX = canvas.width / rect.width
        let scaleY = canvas.height / rect.height
        let translateX = -rect.left
        let translateY = -rect.top

        if (transform) {
            scaleX /= transform.scale
            scaleY /= transform.scale
            translateX -= transform.translate[0]
            translateY -= transform.translate[1]
        }

        // Translate mouse coordinates to canvas coordinates
        const x = (event.clientX + translateX) * scaleX
        const y = (event.clientY + translateY) * scaleY

        const results = indexRef.current?.search(x, y, x, y)
        if (!results || results.length === 0) {
            return { feature: null, context }
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
        feature = features[found]

        return { feature, context }
    }

    const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
        const info = hoverInfo(event)
        if (!info) return

        const { feature, context } = info
        context.clearRect(0, 0, width, height)

        if (feature == null) {
            setValue(undefined)
            setId(undefined)
            setHover(undefined)
            return
        }

        const value = data?.get(Number(feature.id))
        setValue(value)
        setId(Number(feature.id))
        setHover({ x: event.clientX + 10, y: event.clientY - 25 })

        // Draw the highlight over the currently hovered feature
        const drawPath = geoPath().context(context)
        context.lineJoin = 'round'
        context.lineCap = 'round'
        context.lineWidth = 0.5
        context.fillStyle = 'rgba(225,225,225,0.5)'
        context.strokeStyle = 'rgba(0,0,0,0.5)'
        context.beginPath()
        drawPath(feature)
        context.fill()
        context.stroke()
    }

    return (
        <>
            <div className={css.container}>
                <canvas
                    className={css.map}
                    ref={mapCanvasRef}
                    width={width}
                    height={height}
                    onMouseMove={handleMouseMove}
                    onClick={() => {
                        if (id != null) dispatch(clickMap(id))
                    }}
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
            {id !== undefined && (
                <div id={tooltipCss.tooltip} style={{ left: hover?.x, top: hover?.y }}>
                    {format({ id, value })}
                </div>
            )}
        </>
    )
}

export function UsaMap({
    mapSpec,
    data,
    normalize = false,
    detailedView = true,
    transform,
}: {
    mapSpec: MapSpec | undefined
    data: Map<GeoId, number> | undefined
    normalize?: boolean
    detailedView?: boolean
    transform?: { scale: number; translate: [number, number] }
}) {
    const draw = (
        drawPath: GeoPath<any, GeoPermissibleObjects>,
        context: CanvasRenderingContext2D
    ) => {
        // Nation
        context.beginPath()
        drawPath(NATION_PATH)
        context.fillStyle = EMPTY_MAP_COLOR
        context.fill()

        //  Counties
        if (mapSpec && data) {
            switch (mapSpec.map_type) {
                case MapType.Choropleth: {
                    const colorScale = Color(normalize, detailedView, mapSpec, getDomain(data))
                    COUNTIES.forEach((county) => {
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
                    COUNTIES.forEach((county) => {
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
        drawPath(STATE_PATH)
        context.lineWidth = 1
        context.strokeStyle = '#fff'
        context.stroke()
    }

    const handleFormat = mapSpec
        ? ({ id, value }: { id: number; value: number | undefined }) =>
              format({
                  id,
                  value,
                  mapSpec,
                  geoType: GeographyType.UsaCounty,
                  normalize,
              })
        : undefined

    return (
        <GenericMap
            features={COUNTIES}
            data={data}
            draw={draw}
            transform={transform}
            format={handleFormat}
        />
    )
}

type WorldMapProps = {
    mapSpec: MapSpec | undefined
    data: Map<GeoId, number> | undefined
    normalize?: boolean
    detailedView?: boolean
    transform?: { scale: number; translate: [number, number] }
}

export function WorldMap({
    mapSpec,
    data,
    normalize = false,
    detailedView = false,
    transform,
}: WorldMapProps) {
    const draw = (
        drawPath: GeoPath<any, GeoPermissibleObjects>,
        context: CanvasRenderingContext2D
    ) => {
        if (mapSpec && data) {
            const colorScale = Color(normalize, detailedView, mapSpec, getDomain(data))
            NATIONS.forEach((country) => {
                const value = data.get(Number(country.id))
                context.beginPath()
                drawPath(country)
                context.fillStyle = value != null ? colorScale(value) : MISSING_DATA_COLOR
                context.fill()
            })
        } else {
            NATIONS.forEach((country) => {
                context.beginPath()
                drawPath(country)
                context.fillStyle = MISSING_DATA_COLOR
                context.fill()
            })
        }
    }
    const handleFormat = mapSpec
        ? ({ id, value }: { id: number; value: number | undefined }) =>
              format({
                  id,
                  value,
                  mapSpec,
                  geoType: GeographyType.World,
                  normalize,
              })
        : undefined
    return (
        <GenericMap
            draw={draw}
            features={NATIONS}
            data={data}
            transform={transform}
            format={handleFormat}
        />
    )
}

type Props = {
    mapSpec: MapSpec | undefined
    data: Map<GeoId, number> | undefined
    normalize?: boolean
    detailedView?: boolean
}

export default function CanvasMap({ mapSpec, data, normalize, detailedView }: Props) {
    if (!mapSpec) {
        return null
    }
    switch (mapSpec.geography_type) {
        case GeographyType.World:
            return (
                <WorldMap
                    mapSpec={mapSpec}
                    data={data}
                    detailedView={detailedView}
                    normalize={normalize}
                />
            )
        case GeographyType.UsaCounty:
            return (
                <UsaMap
                    mapSpec={mapSpec}
                    data={data}
                    detailedView={detailedView}
                    normalize={normalize}
                />
            )
        default:
            return <p>map type {mapSpec.geography_type} is unsupported</p>
    }
}
