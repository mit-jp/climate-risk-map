<script lang="ts">
    import { geoPath } from "d3";
    import {
        makeCountyToRadius,
        makeValueToRadius,
        TopoJson,
    } from "./MapUtils";
    import type { Data } from "./DataApi";
    import NationMap from "./NationMap.svelte";
    import { feature } from "topojson-client";
    import type { GeoJsonProperties } from "geojson";
    import type { GeometryCollection } from "topojson-specification";
    import StateMap from "./StateMap.svelte";

    export let topoJson: TopoJson;
    export let data: Data;

    const path = geoPath();

    $: countyFeatures = feature(
        topoJson,
        topoJson.objects.counties as GeometryCollection<GeoJsonProperties>
    ).features;
    $: valueToRadius = makeValueToRadius(countyFeatures, data);
    $: countyToRadius = makeCountyToRadius(valueToRadius, data);
</script>

<NationMap {topoJson} />
<StateMap {topoJson} />
<g id="bubbles">
    {#each countyFeatures as county (county.id)}
        <circle
            transform={`translate(${path.centroid(county)})`}
            r={countyToRadius(county)}
        />
    {/each}
</g>

<style>
    circle {
        stroke-opacity: 0.5;
        fill-opacity: 0.5;
        fill: rgb(34, 139, 69);
        stroke: #fff;
    }
</style>
