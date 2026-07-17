import * as d3 from 'd3'
import LegendTicks from './LegendTicks'

type Props = {
    colorScheme: any
    title: string
    x?: number
    y?: number
    tickSize?: number
    width?: number
    height?: number
    marginTop?: number
    marginRight?: number
    marginBottom?: number
    marginLeft?: number
    ticks?: number
    tickFormat: (n: number | { valueOf(): number }) => string
    showHighLowLabels?: boolean
}

function ramp(color: any, n = 256) {
    const canvas = document.createElement('canvas')
    canvas.width = n
    canvas.height = 1
    const context = canvas.getContext('2d')
    if (context) {
        for (let i = 0; i < n; i += 1) {
            context.fillStyle = color(i / (n - 1))
            context.fillRect(i, 0, 1, 1)
        }
    }
    return canvas
}

function Legend({
    colorScheme,
    title,
    x = 550,
    y = 20,
    tickSize = 6,
    width = 345,
    height = 54 + tickSize,
    marginTop = 28,
    marginRight = 10,
    marginBottom = 16 + tickSize,
    marginLeft = 10,
    ticks = width / 64,
    tickFormat,
    showHighLowLabels = false,
}: Props) {
    let legend
    let xScale: any
    let tickValues: number[] | undefined
    let theTickFormat = tickFormat

    if (colorScheme.interpolator) {
        xScale = Object.assign(
            colorScheme.copy().interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
            {
                range() {
                    return [marginLeft, width - marginRight]
                },
            }
        )

        // scaleSequentialQuantile doesn’t implement ticks.
        if (!xScale.ticks) {
            const n = Math.round(ticks + 1)
            tickValues = d3
                .range(n)
                .map((i) => d3.quantile(colorScheme.domain(), i / (n - 1)) as number)
        }

        legend = (
            <image
                x={marginLeft}
                y={marginTop}
                width={width - marginLeft - marginRight}
                height={height - marginTop - marginBottom}
                preserveAspectRatio="none"
                xlinkHref={ramp(colorScheme.interpolator()).toDataURL()}
            />
        )
    } else if (colorScheme.invertExtent) {
        let thresholds: any
        if (colorScheme.thresholds) {
            thresholds = colorScheme.thresholds() // scaleQuantize
        } else {
            thresholds = colorScheme.quantiles
                ? colorScheme.quantiles() // scaleQuantile
                : colorScheme.domain() // scaleThreshold
        }

        xScale = d3
            .scaleLinear()
            .domain([-1, colorScheme.range().length - 1])
            .rangeRound([marginLeft, width - marginRight])

        tickValues = d3.range(thresholds.length)
        theTickFormat = (i) => tickFormat(thresholds[i.valueOf()])
        legend = (
            <g>
                {colorScheme.range().map((color: string, i: number) => (
                    <rect
                        // eslint-disable-next-line react/no-array-index-key
                        key={i}
                        x={xScale(i - 1)}
                        y={marginTop}
                        width={xScale(i) - xScale(i - 1)}
                        height={height - marginTop - marginBottom}
                        fill={color}
                    />
                ))}
            </g>
        )
    } else {
        legend = null
    }

    return (
        <svg
            x={x}
            y={y}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            overflow="visible"
            display="block"
            style={{ backgroundColor: 'white' }}
        >
            <rect width="100%" height="100%" fill="rgba(255, 255, 255, 0.8)" />
            {legend}
            <LegendTicks
                height={height}
                width={width}
                marginBottom={marginBottom}
                marginLeft={marginLeft}
                marginRight={marginRight}
                marginTop={marginTop}
                title={title}
                xScale={xScale}
                tickFormat={theTickFormat}
                numTicks={ticks}
                tickSize={tickSize}
                tickValues={tickValues}
                showHighLowLabels={showHighLowLabels}
            />
        </svg>
    )
}

export default Legend
