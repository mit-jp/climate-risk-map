import { geoPath, select } from 'd3'
import { Map } from 'immutable'
import { useEffect, useRef } from 'react'
import * as topojson from 'topojson-client'
import { MapVisualization } from './MapVisualization'

import { GeoId } from './appSlice'
import { TopoJson } from './TopoJson'

type Props = {
    us: TopoJson
    selection: MapVisualization | undefined
    data: Map<GeoId, number>
}

/** Use a canvas d3 renderer instead of drawing everything in an svg */
export default function CanvasMap({ us, selection, data }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        // draw map via d3 on canvasRef
        const width = 975
        const height = 610
        const canvas = select(canvasRef.current).attr('width', width).attr('height', height)
        const context = canvas.node()?.getContext('2d')
        if (context == null) {
            return
        }
        const path = geoPath(null, context)
        context.canvas.style.maxWidth = '100%'
        context.lineJoin = 'round'
        context.lineCap = 'round'

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

        context.beginPath()
        path(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        context.lineWidth = 0.5
        context.strokeStyle = '#000'
        context.stroke()

        context.beginPath()
        path(topojson.feature(us, us.objects.nation))
        context.lineWidth = 1
        context.strokeStyle = '#000'
        context.stroke()
    }, [data, selection, us])
    return <canvas ref={canvasRef} />
}