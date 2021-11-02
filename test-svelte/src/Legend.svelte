<script lang="ts">
    import * as d3 from "d3";
    import LegendTicks from "./LegendTicks.svelte";
    import { ramp } from "./LegendUtils";
    export let color: any;
    export let title: string;
    export let tickSize = 6;
    export let width = 345;
    export let height = 54 + tickSize;
    export let marginTop = 28;
    export let marginRight = 10;
    export let marginBottom = 16 + tickSize;
    export let marginLeft = 10;
    export let ticks = width / 64;
    export let tickFormat: (n: number | { valueOf(): number }) => string;
    export let showHighLowLabels = false;

    let xScale: any;
    let tickValues: number[] | undefined;

    const BACKGROUND_COLOR = "rgba(25, 25, 25, .8)";

    $: {
        if (color.interpolator) {
            xScale = Object.assign(
                color
                    .copy()
                    .interpolator(
                        d3.interpolateRound(marginLeft, width - marginRight)
                    ),
                {
                    range() {
                        return [marginLeft, width - marginRight];
                    },
                }
            );

            // scaleSequentialQuantile doesn’t implement ticks.
            if (!xScale.ticks) {
                const n = Math.round(ticks + 1);
                tickValues = d3
                    .range(n)
                    .map(
                        (i) =>
                            d3.quantile(color.domain(), i / (n - 1)) as number
                    );
            }
        } else if (color.invertExtent) {
            const thresholds = color.thresholds
                ? color.thresholds() // scaleQuantize
                : color.quantiles
                ? color.quantiles() // scaleQuantile
                : color.domain(); // scaleThreshold

            xScale = d3
                .scaleLinear()
                .domain([-1, color.range().length - 1])
                .rangeRound([marginLeft, width - marginRight]);

            tickValues = d3.range(thresholds.length);
            const originalTickFormat = tickFormat;
            tickFormat = (i) => originalTickFormat(thresholds[i.valueOf()]);
        }
    }

    const colorCast = (color: any) => color as string | undefined;
</script>

<svg
    id="legend"
    x="550"
    y="20"
    {width}
    {height}
    viewBox={"0 0 " + width + " " + height}
>
    <rect width="100%" height="100%" fill={BACKGROUND_COLOR} />
    {#if color.interpolator}
        <image
            x={marginLeft}
            y={marginTop}
            width={width - marginLeft - marginRight}
            height={height - marginTop - marginBottom}
            preserveAspectRatio="none"
            xlink:href={ramp(color.interpolator()).toDataURL()}
        />
    {:else if color.invertExtent}
        <g>
            {#each color.range() as color, i (i)}
                <rect
                    x={xScale(i - 1)}
                    y={marginTop}
                    width={xScale(i) - xScale(i - 1)}
                    height={height - marginTop - marginBottom}
                    fill={colorCast(color)}
                />
            {/each}
        </g>
    {/if}
    <LegendTicks
        {height}
        {width}
        {marginBottom}
        {marginLeft}
        {marginRight}
        {marginTop}
        {title}
        {xScale}
        {tickFormat}
        numTicks={ticks}
        {tickSize}
        {tickValues}
        {showHighLowLabels}
    />
</svg>

<style>
    #legend {
        display: block;
        overflow: visible;
    }
</style>
