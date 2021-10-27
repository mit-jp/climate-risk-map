<script lang="ts">
    import { geoPath } from "d3";
    import type { Data } from "./DataApi";
    import EmptyMap from "./EmptyMap.svelte";
    import FullMap from "./FullMap.svelte";
    import type { MapConfig } from "./MapConfigApi";
    import usa from "./usa.json";
    import type {
        GeometryCollection,
        Objects,
        Topology,
    } from "topojson-specification";
    import { feature } from "topojson-client";
    import type { GeoJsonProperties } from "geojson";
    import type { County } from "./Counties";

    export let mapInfo:
        | { data: Promise<Data>; mapConfig: MapConfig }
        | undefined;

    const path = geoPath();
    const topoJson = usa as any as Topology<Objects<GeoJsonProperties>>;
    const countyFeatures = feature(
        topoJson,
        topoJson.objects.counties as GeometryCollection<GeoJsonProperties>
    ).features;
    const countyPaths: County[] = countyFeatures.map((feature) => ({
        id: feature.id as string,
        path: path(feature) as string,
    }));
</script>

<svg viewBox="0, 0, 1175, 610" xmlns="http://www.w3.org/2000/svg">
    {#if mapInfo}
        {#await mapInfo.data}
            <EmptyMap counties={countyPaths} />
        {:then data}
            <FullMap {data} mapConfig={mapInfo.mapConfig} {countyPaths} />
        {/await}
    {:else}
        <EmptyMap counties={countyPaths} />
    {/if}
</svg>

<style>
    svg {
        min-width: 500px;
        width: 100%;
        align-self: flex-start;
    }
</style>
