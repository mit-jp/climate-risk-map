import { geoPath, select } from 'd3'
import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'
import { Map } from 'immutable'
import { useEffect, useRef } from 'react'
import * as topojson from 'topojson-client'
import { MapVisualization } from './MapVisualization'

import Color from './Color'
import { getDomain } from './DataProcessor'
import { TopoJson } from './TopoJson'
import { GeoId } from './appSlice'

type Props = {
    us: TopoJson
    selection: MapVisualization | undefined
    data: Map<GeoId, number> | undefined
    width: number
    height: number
}

const MISSING_DATA_COLOR = '#ccc'

/** Use a canvas d3 renderer instead of drawing everything in an svg */
export default function CanvasMap({ us, selection, data, width, height }: Props) {
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
            const counties = (
                topojson.feature(us, us.objects.counties) as FeatureCollection<
                    Geometry,
                    GeoJsonProperties
                >
            ).features
            const colorScale = Color(false, true, mapSpec, getDomain(data))
            counties.forEach((county) => {
                const value = data.get(Number(county.id))
                context.beginPath()
                path(county)
                context.fillStyle = value != null ? colorScale(value) : MISSING_DATA_COLOR
                context.fill()
            })
        }

        // Counties
        if (selection && data) {
            drawCountyMap(us, selection, data)
        }

        // States
        context.beginPath()
        path(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        context.lineWidth = 0.5
        context.strokeStyle = '#000'
        context.stroke()

        // Nation
        context.beginPath()
        path(topojson.feature(us, us.objects.nation))
        context.lineWidth = 1
        context.strokeStyle = '#000'
        context.stroke()
    }, [data, selection, us, width, height])
    return <canvas ref={canvasRef} width={width} height={height} />
}
