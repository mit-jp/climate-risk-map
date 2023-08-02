import { geoPath, select } from 'd3'
import { Map } from 'immutable'
import { useEffect, useRef } from 'react'
import * as topojson from 'topojson-client'
import type { GeometryCollection } from 'topojson-specification'
import { MapVisualization } from './MapVisualization'

import { USACounties as getCounties, countries as getCountries } from './ChoroplethMap'
import Color from './Color'
import { getDomain } from './DataProcessor'
import { TopoJson } from './TopoJson'
import { GeoId } from './appSlice'

type UsaMapProps = {
    us: TopoJson
    mapSpec: MapVisualization | undefined
    data: Map<GeoId, number> | undefined
    width: number
    height: number
    normalize?: boolean
}

const MISSING_DATA_COLOR = '#ccc'

export function UsaMap({ us, mapSpec, data, width, height, normalize = false }: UsaMapProps) {
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

        const drawCountyMap = (
            us: TopoJson,
            mapSpec: MapVisualization,
            data: Map<GeoId, number>
        ) => {
            const counties = getCounties(us)
            const colorScale = Color(normalize, true, mapSpec, getDomain(data))
            counties.forEach((county) => {
                const value = data.get(Number(county.id))
                context.beginPath()
                path(county)
                context.fillStyle = value != null ? colorScale(value) : MISSING_DATA_COLOR
                context.fill()
            })
        }

        // Counties
        if (mapSpec && data) {
            drawCountyMap(us, mapSpec, data)
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
    }, [data, mapSpec, us, width, height])
    return <canvas ref={canvasRef} width={width} height={height} />
}

type WorldMapProps = {
    world: TopoJson
    mapSpec: MapVisualization | undefined
    data: Map<GeoId, number> | undefined
    width: number
    height: number
    normalize?: boolean
}

export function WorldMap({
    world,
    mapSpec,
    data,
    width,
    height,
    normalize = false,
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
            const colorScale = Color(normalize, true, mapSpec, getDomain(data))
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
    }, [data, mapSpec, world, width, height])
    return <canvas ref={canvasRef} width={width} height={height} />
}
