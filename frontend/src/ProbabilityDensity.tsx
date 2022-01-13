import { useEffect, useRef } from 'react'
import {
    scaleLinear,
    extent,
    bin as createBins,
    select,
    mean,
    max,
    axisBottom,
    axisLeft,
    line,
    curveBasis,
    Bin,
} from 'd3'
import Color from './Color'
import { MapVisualization } from './MapVisualization'

const margin = { top: 20, right: 30, bottom: 30, left: 40 }
type Props = {
    data: number[] | undefined
    map: MapVisualization | undefined
    shouldNormalize: boolean
    xRange?: [number, number] | undefined | []
    width?: number
    height?: number
    formatter?: any
    continuous: boolean
}

function epanechnikov(bandwidth: number) {
    return (x: number) => {
        const y = x / bandwidth
        if (Math.abs(y) <= 1) {
            return (0.75 * (1 - y * y)) / bandwidth
        }
        return 0
    }
}

function kde(
    kernel: (x: number) => number,
    thresholds: number[],
    data: number[]
): [number, number][] {
    return thresholds.map((t: number) => [t, mean(data, (d: number) => kernel(t - d))!])
}

function ProbabilityDensity({
    data,
    map,
    shouldNormalize,
    xRange = undefined,
    width = 300,
    height = 200,
    formatter,
    continuous = true,
}: Props) {
    const svgRef = useRef<SVGSVGElement>(null)
    useEffect(() => {
        if (data === undefined || map === undefined) {
            return
        }
        const domain =
            xRange === undefined || xRange.length === 0
                ? (extent(data) as [number, number])
                : xRange
        const x = scaleLinear()
            .domain(domain)
            .nice()
            .range([margin.left, width - margin.right])
        const thresholds = x.ticks(40)
        const bins = createBins()
            .domain(x.domain() as [number, number])
            .thresholds(thresholds)(data)
        const bandwidth = (domain[1] - domain[0]) / 40
        const density = kde(epanechnikov(bandwidth), thresholds, data)
        const yValues = density.map(([, yValue]) => yValue)
        const y = scaleLinear()
            .domain([0, max(bins, (d) => d.length)! / data.length])
            .range([height - margin.bottom, margin.top])
        const yLine = scaleLinear()
            .domain([0, max(yValues)!])
            .range([height - margin.bottom, margin.top])

        const xAxis = (g: any) =>
            g
                .attr('transform', `translate(0,${height - margin.bottom})`)
                .call(axisBottom(x).tickFormat(formatter).ticks(6))
                .call((item: any) => item.select('.domain').remove())
        const yAxis = (g: any) =>
            g
                .attr('transform', `translate(${margin.left},0)`)
                .call(axisLeft(y).ticks(null))
                .call((item: any) => item.select('.domain').remove())
        const svg = select(svgRef.current)
        const color = Color(shouldNormalize, continuous, map)
        const kdeLine: any = line()
            .curve(curveBasis)
            .x((d) => x(d[0]))
            .y((d) => yLine(d[1]))
        function binWidth(bin: Bin<number, number>) {
            const binnedWidth = x(bin.x1!) - x(bin.x0!)
            return binnedWidth > 0 ? binnedWidth - 1 : 0
        }

        svg.select('#histogram')
            .selectAll('rect')
            .data(bins)
            .join('rect')
            .attr('fill', (d) => color(mean([d.x1!, d.x0!]) as any))
            .attr('x', (d) => x(d.x0!) + 1)
            .attr('y', (d) => y(d.length / data.length))
            .attr('width', (d) => binWidth(d))
            .attr('height', (d) => y(0) - y(d.length / data.length))
        svg.select('#kde')
            .datum(density)
            .attr('fill', 'none')
            .attr('stroke', '#000')
            .attr('stroke-width', 1.5)
            .attr('stroke-linejoin', 'round')
            .attr('d', kdeLine)
        svg.select('#xAxis').call(xAxis)
        svg.select('#yAxis').call(yAxis)
    }, [data, map, shouldNormalize, xRange, formatter, height, width, continuous])

    if (data === undefined || map === undefined) {
        return null
    }
    return (
        <svg
            ref={svgRef}
            viewBox={`0 0 ${width.toString()} ${height.toString()}`}
            width={width}
            height={height}
            x={850}
            y={362}
        >
            <rect width="100%" height="100%" fill="rgba(255, 255, 255, 0.8)" />
            <g id="histogram" />
            <path id="kde" />
            <g id="xAxis" />
            <g id="yAxis" />
        </svg>
    )
}

export default ProbabilityDensity
