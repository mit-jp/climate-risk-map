<script lang="ts">
    import type { MapConfig } from "./MapConfigApi";
    import Color from "./Color";
    import type { Data } from "./DataApi";
    import { geoPath } from "d3-geo";
    import type { TopoJson } from "./MapUtils";
    import { feature } from "topojson-client";

    import type { GeoJsonProperties } from "geojson";
    import type { GeometryCollection } from "topojson-specification";
    import StateMap from "./StateMap.svelte";

    export let topoJson: TopoJson;
    export let mapConfig: MapConfig;
    export let data: Data;

    const path = geoPath();

    $: countyData = feature(
        topoJson,
        topoJson.objects.counties as GeometryCollection<GeoJsonProperties>
    ).features.map((feature) => ({
        id: feature.id as string,
        path: path(feature) as string,
        value: data[feature.id as string] as number,
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
