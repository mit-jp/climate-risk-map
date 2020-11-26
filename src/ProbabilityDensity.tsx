import React, { useEffect, useRef } from 'react';
import {scaleLinear, extent, bin, select, line, curveBasis, mean, max, axisBottom, axisLeft } from 'd3';
const height = 150;
const width = 300;
const margin = ({top: 20, right: 30, bottom: 30, left: 40});
function kde(kernel:(x: number) => number, thresholds:number[], data:number[]) {
    return thresholds.map(t => [t, mean(data, d => kernel(t - d))]);
}
function epanechnikov(bandwidth: number) {
    return (x: number) => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
}

const ProbabilityDensity = ({data, bandwidth}: {data: number[], bandwidth: number}) => {
    const x = scaleLinear()
        .domain(extent(data) as [number, number])
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

    const aline = line()
        .curve(curveBasis)
        .x(d => x(d[0]))
        .y(d => y(d[1]));
    const density = kde(epanechnikov(bandwidth), thresholds, data);

    const xAxis = (g: any) => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(axisBottom(x))
        .call((g: any) => g.append("text")
            .attr("x", width - margin.right)
            .attr("y", -6)
            .attr("fill", "#000")
            .attr("text-anchor", "end")
            .attr("font-weight", "bold")
            .text("data"))
    
    const yAxis = (g: any) => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(axisLeft(y).ticks(null, "%"))
        .call((g: any) => g.select(".domain").remove())

    const svgRef = useRef<SVGSVGElement>(null);
    useEffect(() => {
        const svg = select(svgRef.current);
        svg.select("#pdf")
            .attr("fill", "#bbb")
            .selectAll("rect")
            .data(bins)
            .join("rect")
            .attr("x", d => x(d!.x0!) + 1)
            .attr("y", d => y(d!.length / data.length))
            .attr("width", d => x(d!.x1!) - x(d.x0!) - 1)
            .attr("height", d => y(0) - y(d.length / data.length));
        svg.select("#kde")
            .datum(density)
            .attr("fill", "none")
            .attr("stroke", "#000")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("d", aline as any);
        svg.select("#xAxis")
            .call(xAxis);
        svg.select("#yAxis")
            .call(yAxis);
    }, [bandwidth]);
    return <svg ref={svgRef} viewBox="0, 0, 300, 150" width={300} height={150}>
        <g id="pdf"></g>
        <path id="kde"></path>
        <g id="xAxis"></g>
        <g id="yAxis"></g>
    </svg>
};

export default ProbabilityDensity