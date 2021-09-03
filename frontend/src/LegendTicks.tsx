import React from "react";

type Props = {
    height: number;
    marginBottom: number;
    marginLeft: number;
    marginTop: number;
    title: string;
    tickAdjust: (g: any) => any;
    x: any;
};

const LegendTicks = ({ height, marginBottom, marginLeft, marginTop, title, x }: Props) => (
    <g
        transform={`translate(0,${height - marginBottom})`}
        fill="none"
        font-fontSize="10"
        font-family="sans-serif"
        text-anchor="middle">
        {/* .call(
            d3.axisBottom(x)
                .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
                .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
                .tickSize(tickSize)
                .tickValues(tickValues)
        )
        .call(tickAdjust)
        .call(g => g.select(".domain").remove()); */}
        <text
            x={marginLeft}
            y={marginTop + marginBottom - height - 6}
            font-size={14}
            fill="currentColor"
            text-anchor="start"
            className="title">
            {title}
        </text>
    </g >
);

export default LegendTicks;