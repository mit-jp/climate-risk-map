<script lang="ts">
    import type { MapConfig } from "./MapConfigApi";
    import Color from "./Color";
    import type { Data } from "./DataApi";
    import type { County } from "./Counties";

    export let countyPaths: County[];
    export let mapConfig: MapConfig;
    export let data: Data;

    const countyData: County[] = countyPaths.map((county) => ({
        ...county,
        value: data[county.id] as number,
    }));
    $: getColor = Color(mapConfig);
</script>

<g id="counties">
    {#each countyData as county (county.id)}
        <path
            id={county.id}
            fill={county.value ? getColor(county.value) : "#eee"}
            d={county.path}
        />
    {/each}
</g>

<style>
    path:hover {
        fill-opacity: 0.3;
        stroke: black;
    }
</style>
