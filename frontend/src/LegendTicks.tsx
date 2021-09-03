import React from "react";

type Props = {
    height: number;
    marginBottom: number;
    marginLeft: number;
    marginTop: number;
    title: string;
    xScale: any;
    numTicks: number;
    tickFormat: (n: number | { valueOf(): number }) => string;
    tickSize: number;
    tickValues?: number[];
};

const LegendTicks = ({
    height,
    marginBottom,
    marginLeft,
    marginTop,
    title,
    xScale,
    numTicks,
    tickFormat,
    tickSize,
    tickValues,
}: Props) => {
    const y1 = marginTop + marginBottom - height;
    const y2 = y1 + height - marginTop - marginBottom + tickSize;
    const ticks = tickValues || xScale.ticks(numTicks) as number[];

    return (
        <g
            transform={`translate(0,${height - marginBottom})`}
            fill="none"
            fontSize="10"
            fontFamily="sans-serif"
            textAnchor="middle">
            <g className="ticks">
                {ticks.map((tick, i) => {
                    const x = xScale(tick);
                    return (
                        <React.Fragment key={i}>
                            <line x1={x} x2={x} y1={y1} y2={y2} stroke="black" />
                            <text
                                x={x}
                                y={y2 + tickSize + 5}
                                fill="black"
                                textAnchor="middle"
                                fontSize={10}
                            >
                                {tickFormat(tick)}
                            </text>
                        </React.Fragment>
                    );
                })}
            </g>
            <text
                x={marginLeft}
                y={y1 - 6}
                fontSize={14}
                fill="currentColor"
                textAnchor="start"
                className="title">
                {title}
            </text>
        </g >
    );
};

export default LegendTicks;