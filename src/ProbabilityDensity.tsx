import React, { useEffect, useRef } from 'react';
import { scaleLinear, extent, bin, select, mean, max, axisBottom, axisLeft } from 'd3';
import { DataIdParams } from './DataDefinitions';
import Color from './Color';
const margin = ({ top: 20, right: 30, bottom: 30, left: 40 });
type Props = {
    data: number[] | undefined,
    selections: DataIdParams[] | undefined,
    xRange?: [number, number] | undefined,
    width?: number,
    height?: number,
    formatter?: any,
};

const ProbabilityDensity = ({ data, selections, xRange=undefined, width=300, height=200, formatter}: Props) => {
    const svgRef = useRef<SVGSVGElement>(null);
    useEffect(() => {
        if (data === undefined || selections === undefined) {
            return;
        }
        const domain = xRange === undefined ? extent(data) as [number, number] : xRange;
        const x = scaleLinear()
            .domain(domain)
            .nice()
            .range([margin.left, width - margin.right]);
        const thresholds = x.ticks(40)
        const bins = bin()
            .domain(x.domain() as [number, number])
            .thresholds(thresholds)
            (data)
        const y = scaleLinear()
            .domain([0, max(bins, d => d.length)! / data.length])
            .range([height - margin.bottom, margin.top]);

        const xAxis = (g: any) => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(axisBottom(x).tickFormat(formatter))
        const yAxis = (g: any) => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(axisLeft(y).ticks(null))
            .call((g: any) => g.select(".domain").remove())
        const svg = select(svgRef.current);
        const color = Color(selections);
        svg.select("#pdf")
            .selectAll("rect")
            .data(bins)
            .join("rect")
            .attr("fill", d => color(mean([d.x1!, d.x0!]) as any))
            .attr("x", d => x(d.x0!) + 1)
            .attr("y", d => y(d.length / data.length))
            .attr("width", d => x(d.x1!) - x(d.x0!) - 1)
            .attr("height", d => y(0) - y(d.length / data.length));
        svg.select("#xAxis")
            .call(xAxis);
        svg.select("#yAxis")
            .call(yAxis);
    }, [data, selections, xRange]);

    if (data === undefined || selections === undefined) {
        return null;
    }
    return <svg
        ref={svgRef}
        viewBox={"0 0 " + width.toString() + " " + height.toString()}
        width={width}
        height={height}
        x={850}
        y={350}
    >
        <g id="pdf"></g>
        <g id="xAxis"></g>
        <g id="yAxis"></g>
    </svg>
};

export default ProbabilityDensity