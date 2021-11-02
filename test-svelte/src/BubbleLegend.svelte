<script lang="ts">
    import type { ScalePower } from "d3";

    export let radius: ScalePower<number, number, never>;
    export let title: string;

    // start > 0 so we don't have a circle of radius 0
    $: ticks = radius.ticks(4).slice(1);
</script>

<g id="bubble-legend" fill="currentColor" transform="translate(915, 508)">
    {#each ticks as tick}
        <g>
            <circle cy={-radius(tick)} r={radius(tick)} stroke="currentColor" />
            <text y={-2 * radius(tick)} dy="1.3em">
                {radius.tickFormat(4, "s")(tick)}
            </text>
        </g>
    {/each}
    <text y="-90">{title}</text>
</g>

<style>
    #bubble-legend {
        text-anchor: middle;
        font-size: 10px;
    }

    circle {
        fill: none;
    }
</style>
