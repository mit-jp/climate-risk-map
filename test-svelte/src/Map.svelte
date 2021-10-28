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
    import counties from "./Counties";
    import states, { State } from "./States";
    import Tooltip from "./Tooltip.svelte";

    export let mapInfo:
        | { data: Promise<Data>; mapConfig: MapConfig }
        | undefined;

    let data: Data | undefined;
    let countyName = "";
    let stateName = "";
    let position = { x: 0, y: 0 };
    let value: number | undefined;

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

    $: (async () => mapInfo?.data.then((d) => (data = d)))();
    $: handleMouseMove = (e: MouseEvent) => {
        const id = (e.target as SVGGElement).id;
        countyName = counties.get(id) ?? "";
        stateName = states.get(id.slice(0, 2) as State) ?? "";
        position = { x: e.clientX, y: e.clientY };
        value = data ? data[id]! : undefined;
    };
    const handleMouseOut = () => {
        countyName = "";
        stateName = "";
    };
</script>

<div id="map">
    {#if countyName && stateName}
        <Tooltip {position} {stateName} {countyName} {value} />
    {/if}
    {#if mapInfo}
        <h1>{mapInfo.mapConfig.name}</h1>
    {/if}
    <svg
        viewBox="0, 0, 1175, 610"
        xmlns="http://www.w3.org/2000/svg"
        on:mousemove={handleMouseMove}
        on:mouseout={handleMouseOut}
        on:blur={handleMouseOut}
    >
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
</div>

<style>
    #map {
        display: flex;
        margin-left: 1em;
        min-width: 500px;
        width: 100%;
        align-self: flex-start;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    h1 {
        font-weight: 100;
    }
</style>
