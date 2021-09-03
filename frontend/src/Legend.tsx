import React from "react";
import * as d3 from "d3";
import LegendTicks from "./LegendTicks";

type Props = {
    color: any,
    title: string,
    tickSize?: number,
    width?: number,
    height?: number,
    marginTop?: number,
    marginRight?: number,
    marginBottom?: number,
    marginLeft?: number,
    ticks?: number,
    tickFormat?: any,
    tickValues?: any,
};

const Legend = ({
    color,
    title,
    tickSize = 6,
    width = 345,
    height = 54 + tickSize,
    marginTop = 28,
    marginRight = 10,
    marginBottom = 16 + tickSize,
    marginLeft = 10,
    ticks = width / 64,
    tickFormat,
    tickValues,
}: Props) => {
    let legend;
    const tickAdjust = (g: any) => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
    let x: any;

    if (color.interpolator) {
        x = Object.assign(
            color.copy().interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
            { range() { return [marginLeft, width - marginRight]; } }
        );

        // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
        if (!x.ticks) {
            if (tickValues === undefined) {
                const n = Math.round(ticks + 1);
                tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
            }
            if (typeof tickFormat !== "function") {
                tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
            }
        }

        legend = <image
            x={marginLeft}
            y={marginTop}
            width={width - marginLeft - marginRight}
            height={height - marginTop - marginBottom}
            preserveAspectRatio="none"
            xlinkHref={ramp(color.interpolator()).toDataURL()}
        />;
    } else if (color.invertExtent) {
        const thresholds
            = color.thresholds ? color.thresholds() // scaleQuantize
                : color.quantiles ? color.quantiles() // scaleQuantile
                    : color.domain(); // scaleThreshold

        const thresholdFormat
            = tickFormat === undefined ? (d: any) => d
                : typeof tickFormat === "string" ? d3.format(tickFormat)
                    : tickFormat;

        x = d3.scaleLinear()
            .domain([-1, color.range().length - 1])
            .rangeRound([marginLeft, width - marginRight]);

        tickValues = d3.range(thresholds.length);
        tickFormat = (i: number) => thresholdFormat(thresholds[i], i);
        legend = <g>
            {color.range().map((color: string, i: number) =>
                <rect
                    x={x(i - 1)}
                    y={marginTop}
                    width={x(i) - x(i - 1)}
                    height={height - marginTop - marginBottom}
                    fill={color}
                />
            )}
        </g>;
    } else {
        legend = null;
    }

    return (
        <svg
            id="legend"
            x="550"
            y="20"
            width={width}
            height={height}
            viewBox={"0 0 " + width + " " + height}
            overflow="visible"
            display="block"
            style={{ backgroundColor: "white" }}>
            <rect
                width="100%"
                height="100%"
                fill="rgba(255, 255, 255, 0.8)"
            />
            {legend}
            <LegendTicks
                height={height}
                marginBottom={marginBottom}
                marginLeft={marginLeft}
                marginTop={marginTop}
                title={title}
                tickAdjust={tickAdjust}
                x={x}
            />
        </svg >);
}

function ramp(color: any, n = 256) {
    var canvas = document.createElement('canvas');
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    if (context) {
        for (let i = 0; i < n; ++i) {
            context.fillStyle = color(i / (n - 1));
            context.fillRect(i, 0, 1, 1);
        }
    }
    return canvas;
}

export default Legend;
