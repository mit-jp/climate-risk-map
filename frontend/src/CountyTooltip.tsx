import { Map } from 'immutable'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import counties from './Counties'
import states, { State } from './States'
import { getUnitString } from './FullMap'
import { MapVisualization } from './MapVisualization'
import { selectIsNormalized } from './appSlice'
import { createFormatter, Formatter } from './ChoroplethMap'
import './CountyTooltip.css'

const getFormatter = (selectedMap: MapVisualization, isNormalized: boolean): Formatter =>
    createFormatter(selectedMap.formatter_type, selectedMap.decimals, isNormalized)

const getUnits = (dataDefinition: MapVisualization, isNormalized: boolean) =>
    isNormalized ? 'Normalized value' : dataDefinition.units

const formatData = (
    value: number | undefined,
    selectedMap: MapVisualization,
    isNormalized: boolean
) => {
    const formatter = getFormatter(selectedMap, isNormalized)
    if (value === undefined) {
        return 'No data'
    }
    if (isNormalized) {
        return formatter(value)
    }
    const units = getUnits(selectedMap, isNormalized)
    return formatter(value) + getUnitString(units)
}

type TooltipHover = { x: number; y: number; id: string }
type Props = {
    data: Map<string, number> | undefined
    mapRef: React.RefObject<SVGGElement>
    selectedMap: MapVisualization | undefined
}

function CountyTooltip({ data, mapRef, selectedMap }: Props) {
    const isNormalized = useSelector(selectIsNormalized)
    const [hover, setHover] = useState<TooltipHover>()

    useEffect(() => {
        const element = mapRef.current
        if (!element) {
            return
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
        text = `${name}: ${formatData(value, selectedMap, isNormalized)}`
    }

    return (
        <div id="tooltip" style={{ left: hover?.x, top: hover?.y }}>
            {text}
        </div>
    )
}

export default CountyTooltip
