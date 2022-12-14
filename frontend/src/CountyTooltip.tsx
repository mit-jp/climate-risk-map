import { Map } from 'immutable'
import { useEffect, useState, RefObject } from 'react'
import counties from './Counties'
import states, { State } from './States'
import { MapVisualization } from './MapVisualization'
import css from './CountyTooltip.module.css'
import { formatData } from './Formatter'

type TooltipHover = { x: number; y: number; id: string }
type Props = {
    data: Map<string, number> | undefined
    mapRef: RefObject<SVGGElement>
    selectedMap: MapVisualization | undefined
    isNormalized: boolean
}

function CountyTooltip({ data, mapRef, selectedMap, isNormalized }: Props) {
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
                id: event.target.id,
            })
        const onMouseMove = (event: any) =>
            setHover({
                x: event.pageX + 10,
                y: event.pageY - 25,
                id: event.target.id,
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
        const county = counties.get(hover.id)
        const state = states.get(hover.id.slice(0, 2) as State)
        let name = '---'
        if (state && county) {
            name = `${county}, ${state}`
        }
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

export default CountyTooltip
