<script lang="ts">
    import type { MapConfig } from "./MapConfigApi";
    import Color from "./Color";
    import type { Data } from "./DataApi";
    import { geoPath } from "d3-geo";
    import type { TopoJson } from "./MapUtils";
    import StateMap from "./StateMap.svelte";
    import type { County } from "./Counties";

    export let topoJson: TopoJson;
    export let countyPaths: County[];
    export let mapConfig: MapConfig;
    export let data: Data;

    const path = geoPath();

    $: countyData = countyPaths.map((county) => ({
        ...county,
        value: data[county.id] as number,
    }));
    $: getColor = Color(mapConfig);
</script>

<g id="counties">
    {#each countyData as county (county.id)}
        <path
            id={county.id}
            fill={county.value ? getColor(county.value) : "#555"}
            d={county.path}
        />
    {/each}
</g>
<StateMap {topoJson} />

<style>
    path:hover {
        fill-opacity: 0.3;
        stroke: black;
    }
</style>
