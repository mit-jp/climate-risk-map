<script lang="ts">
    import { geoPath } from "d3-geo";
    import type { TopoJson } from "./MapUtils";
    import StateMap from "./StateMap.svelte";
    import type { County } from "./Counties";

    const path = geoPath();

    export let topoJson: TopoJson;
    export let countyPaths: County[];
</script>

<g id="counties">
    {#each countyPaths as county (county.id)}
        <path fill={"#333"} d={county.path} id={county.id} />
    {/each}
</g>

<StateMap {topoJson} />

<style>
    #counties path:hover {
        fill-opacity: 0.3;
        stroke: black;
    }
</style>
