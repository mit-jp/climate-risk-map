<script lang="ts">
    import { MapConfig, MapType } from "./MapConfigApi";
    import type { Data } from "./DataApi";
    import ChoroplethMap from "./ChoroplethMap.svelte";
    import BubbleMap from "./BubbleMap.svelte";
    import type { TopoJson } from "./MapUtils";
    import type { County } from "./Counties";
    import { getLegendTitle } from "./LegendUtils";

    export let topoJson: TopoJson;
    export let countyPaths: County[];
    export let mapConfig: MapConfig;
    export let data: Data;

    $: legendTitle = getLegendTitle([mapConfig], false);
</script>

{#if mapConfig.map_type === MapType.Choropleth}
    <ChoroplethMap {topoJson} {countyPaths} {mapConfig} {data} {legendTitle} />
{:else if mapConfig.map_type === MapType.Bubble}
    <BubbleMap {topoJson} {data} {legendTitle} />
{:else}
    <p>Map type not supported</p>
{/if}
