<script lang="ts">
    import type { Data } from "./DataApi";
    import EmptyMap from "./EmptyMap.svelte";
    import FullMap from "./FullMap.svelte";
    import type { MapConfig } from "./MapConfigApi";
    import usa from "./usa.json";
    import type { Objects, Topology } from "topojson-specification";
    import counties from "./Counties";
    import states, { State } from "./States";
    import Tooltip from "./Tooltip.svelte";
    import { feature } from "topojson-client";
    import type { GeoJsonProperties } from "geojson";
    import type { GeometryCollection } from "topojson-specification";
    import { geoPath } from "d3";

    export let mapInfo: { data: Data; mapConfig: MapConfig } | undefined;

    let countyName = "";
    let stateName = "";
    let position = { x: 0, y: 0 };
    let value: number | undefined;

    const path = geoPath();
    const topoJson = usa as any as Topology<Objects<GeoJsonProperties>>;
    const countyPaths = feature(
        topoJson,
        topoJson.objects.counties as GeometryCollection<GeoJsonProperties>
    ).features.map((feature) => ({
        id: feature.id! as string,
        path: path(feature)!,
    }));

    $: handleMouseMove = (e: MouseEvent) => {
        const id = (e.target as SVGGElement).id;
        countyName = counties.get(id) ?? "";
        stateName = states.get(id.slice(0, 2) as State) ?? "";
        position = { x: e.clientX, y: e.clientY };
        value = mapInfo?.data[id]!;
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
            <FullMap
                data={mapInfo.data}
                mapConfig={mapInfo.mapConfig}
                {countyPaths}
                {topoJson}
            />
        {:else}
            <EmptyMap {topoJson} {countyPaths} />
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
