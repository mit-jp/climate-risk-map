<script lang="ts">
    import { MapConfig, MapType } from "./MapConfigApi";
    import type { Data } from "./DataApi";
    import ChoroplethMap from "./ChoroplethMap.svelte";
    import BubbleMap from "./BubbleMap.svelte";
    import type { TopoJson } from "./MapUtils";

    export let topoJson: TopoJson;
    export let mapConfig: MapConfig;
    export let data: Data;
</script>

{#if mapConfig.map_type === MapType.Choropleth}
    <ChoroplethMap {topoJson} {mapConfig} {data} />
{:else if mapConfig.map_type === MapType.Bubble}
    <BubbleMap {topoJson} {data} />
{:else}
    <p>Map type not supported</p>
{/if}
