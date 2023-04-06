import { Map } from 'immutable'
import { RefObject, useEffect, useState } from 'react'
import counties from './Counties'
import css from './CountyTooltip.module.css'
import { formatData } from './Formatter'
import { MapVisualization } from './MapVisualization'
import nations from './Nations'
import states from './States'
import { GeoId, stateId } from './appSlice'

type TooltipHover = { x: number; y: number; id: number }
type Props = {
    data: Map<GeoId, number> | undefined
    mapRef: RefObject<SVGGElement>
    selectedMap: MapVisualization | undefined
    isNormalized: boolean
}

const countyName = (id: number): string | undefined => {
    const county = counties.get(id)
    const state = states.get(stateId(id))
    return county && state ? `${county}, ${state}` : undefined
}

const nationName = (id: number): string | undefined => nations.get(id) ?? undefined

function MapTooltip({ data, mapRef, selectedMap, isNormalized }: Props) {
    const [hover, setHover] = useState<TooltipHover>()

    useEffect(() => {
        const element = mapRef.current
        if (!element) {
            return () => {}
        }

        const onTouchMove = (event: any) =>
            setHover({
                x: event.touches[0].pageX + 30,
                y: event.touches[0].pageY - 45,
                id: Number(event.target.id),
            })
        const onMouseMove = (event: any) =>
            setHover({
                x: event.pageX + 10,
                y: event.pageY - 25,
                id: Number(event.target.id),
            })
        const onHoverEnd = () => setHover(undefined)

        element.addEventListener('mouseout', onHoverEnd)
        element.addEventListener('touchend', onHoverEnd)
        element.addEventListener('mousemove', onMouseMove)
        element.addEventListener('touchmove', onTouchMove)
        return () => {
            element.removeEventListener('mouseout', onHoverEnd)
            element.removeEventListener('touchend', onHoverEnd)
            element.removeEventListener('mousemove', onMouseMove)
            element.removeEventListener('touchmove', onTouchMove)
        }
    }, [mapRef, data])

    if (!hover || !data || !selectedMap) {
        return null
    }

    let text = ''
    if (hover?.id) {
        const name =
            selectedMap.geography_type === 1 ? countyName(hover.id) : nationName(hover.id) ?? '---'
        const value = data?.get(hover.id)
        text = `${name}: ${formatData(value, {
            type: selectedMap.formatter_type,
            decimals: selectedMap.decimals,
            units: selectedMap.units,
            isNormalized,
        })}`
    }

    return (
        <div id={css.tooltip} style={{ left: hover?.x, top: hover?.y }}>
            {text}
        </div>
    )
}

export default MapTooltip
