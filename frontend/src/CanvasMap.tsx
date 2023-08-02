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
    data: Map<GeoId, number>
}

const MISSING_DATA_COLOR = '#ccc'

/** Use a canvas d3 renderer instead of drawing everything in an svg */
export default function CanvasMap({ us, selection, data }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        const canvas = select(canvasRef.current)
        const context = canvas.node()?.getContext('2d')
        if (context == null) {
            return
        }
        const path = geoPath().context(context)
        context.canvas.style.maxWidth = '100%'
        context.lineJoin = 'round'
        context.lineCap = 'round'

        const drawFullMap = (us: TopoJson, mapSpec: MapVisualization, data: Map<GeoId, number>) => {
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

        const drawEmptyMap = (us: TopoJson) => {
            context.beginPath()
            path(
                topojson.mesh(
                    us,
                    us.objects.counties,
                    (a, b) => a !== b && ((a.id / 1000) | 0) === ((b.id / 1000) | 0)
                )
            )
            context.lineWidth = 0.5
            context.strokeStyle = '#aaa'
            context.stroke()
        }

        // Counties
        selection == null ? drawEmptyMap(us) : drawFullMap(us, selection, data)

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
    }, [data, selection, us])
    return <canvas ref={canvasRef} width={975} height={610} />
}
