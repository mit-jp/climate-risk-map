import { ScalePower, select, Selection } from 'd3'
import { useEffect, useRef } from 'react'

function drawBubbleLegend(
    g: Selection<SVGGElement | null, unknown, null, undefined>,
    radius: ScalePower<number, number, never>,
    title: string
) {
    const legend = g
        .attr('fill', '#777')
        .attr('transform', 'translate(915,508)')
        .attr('text-anchor', 'middle')
        .style('font', '10px sans-serif')
        .selectAll('g')
        .data(radius.ticks(4).slice(1))
        .join('g')

    legend.selectAll('*').remove()

    g.selectAll('text')
        .data([title])
        .join('text')
        .attr('y', -90)
        .text((d) => d)

    legend
        .append('circle')
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .attr('cy', (d) => -radius(d))
        .attr('r', radius)

    legend
        .append('text')
        .attr('y', (d) => -2 * radius(d))
        .attr('dy', '1.3em')
        .text(radius.tickFormat(4, 's'))
}

type Props = { radius: ScalePower<number, number, never>; title: string }

function BubbleLegend({ radius, title }: Props) {
    const gRef = useRef<SVGGElement>(null)
    useEffect(() => {
        const g = select(gRef.current)
        drawBubbleLegend(g, radius, title)
    }, [radius, title])

    return <g id="bubble-legend" ref={gRef} />
}

export default BubbleLegend
