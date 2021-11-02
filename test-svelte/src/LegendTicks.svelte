<script lang="ts">
    export let height: number;
    export let width: number;
    export let marginBottom: number;
    export let marginLeft: number;
    export let marginRight: number;
    export let marginTop: number;
    export let title: string;
    export let xScale: any;
    export let numTicks: number;
    export let tickFormat: (n: number | { valueOf(): number }) => string;
    export let tickSize: number;
    export let tickValues: number[] | undefined;
    export let showHighLowLabels: boolean;

    const y1 = marginTop + marginBottom - height;
    const y2 = y1 + height - marginTop - marginBottom + tickSize;
    const ticks = tickValues || (xScale.ticks(numTicks) as number[]);
    const tickLabels = ticks.map((tick, i) => ({
        x: xScale(tick),
        label: tickFormat(tick),
    }));
</script>

<g
    transform={`translate(0,${height - marginBottom})`}
    fill="none"
    font-size="10"
    font-family="sans-serif"
    text-anchor="middle"
>
    {#if showHighLowLabels}
        <text
            x={marginLeft}
            y={y1 - 6}
            font-size={14}
            fill="currentColor"
            text-anchor="start"
        >
            Low
        </text>
        <text
            x={marginLeft + (width - marginRight) / 2}
            y={y1 - 6}
            font-size={14}
            fill="currentColor"
            text-anchor="middle"
        >
            Medium
        </text>
        <text
            x={marginLeft + width - marginRight}
            y={y1 - 6}
            font-size={14}
            fill="currentColor"
            text-anchor="end"
        >
            High
        </text>
    {/if}

    <g class="ticks">
        {#each tickLabels as { x, label }, i (i)}
            <line x1={x} x2={x} {y1} {y2} stroke="currentColor" />
            <text
                {x}
                y={y2 + tickSize + 5}
                fill="currentColor"
                text-anchor="middle"
                font-size={10}
            >
                {label}
            </text>
        {/each}
    </g>
    <text
        x={marginLeft}
        y={showHighLowLabels ? y1 - 18 : y1 - 6}
        font-size={14}
        fill="currentColor"
        text-anchor="start"
        class="title"
    >
        {title}
    </text>
</g>
