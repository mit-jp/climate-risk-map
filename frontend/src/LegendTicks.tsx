import { Fragment } from "react";

type Props = {
    height: number;
    width: number;
    marginBottom: number;
    marginLeft: number;
    marginRight: number;
    marginTop: number;
    title: string;
    xScale: any;
    numTicks: number;
    tickFormat: (n: number | { valueOf(): number }) => string;
    tickSize: number;
    tickValues?: number[];
    showHighLowLabels: boolean;
};

const LegendTicks = ({
    height,
    width,
    marginBottom,
    marginLeft,
    marginRight,
    marginTop,
    title,
    xScale,
    numTicks,
    tickFormat,
    tickSize,
    tickValues,
    showHighLowLabels,
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
            {
                showHighLowLabels &&
                <Fragment>
                    <text
                        x={marginLeft}
                        y={y1 - 6}
                        fontSize={14}
                        fill="currentColor"
                        textAnchor="start"
                        className="high-low-label">
                        Low
                    </text>
                    <text
                        x={marginLeft + (width - marginRight) / 2}
                        y={y1 - 6}
                        fontSize={14}
                        fill="currentColor"
                        textAnchor="middle"
                        className="high-low-label">
                        Medium
                    </text>
                    <text
                        x={marginLeft + width - marginRight}
                        y={y1 - 6}
                        fontSize={14}
                        fill="currentColor"
                        textAnchor="end"
                        className="high-low-label">
                        High
                    </text>
                </Fragment>
            }
            <g className="ticks">
                {ticks.map((tick, i) => {
                    const x = xScale(tick);
                    return (
                        <Fragment key={i}>
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
                        </Fragment>
                    );
                })}
            </g>
            <text
                x={marginLeft}
                y={showHighLowLabels ? y1 - 18 : y1 - 6}
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