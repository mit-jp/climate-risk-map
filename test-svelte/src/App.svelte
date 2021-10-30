<script lang="ts">
    import { Data, getData } from "./DataApi";

    import Map from "./Map.svelte";
    import MapSelector from "./MapSelector.svelte";
    import { getDataQueryParams, MapConfig } from "./MapConfigApi";
    import type { MapInfo } from "./MapInfo";

    let mapConfig: MapConfig | undefined;
    let scale: number;
    let rawMapInfo: MapInfo | undefined;
    let mapInfo: MapInfo | undefined;

    $: (async () => {
        if (mapConfig) {
            const queryParams = getDataQueryParams(mapConfig);
            const data = await getData(queryParams);
            rawMapInfo = { data, mapConfig };
        }
    })();
    $: (async () => {
        if (rawMapInfo) {
            mapInfo = {
                ...rawMapInfo,
                data: scaleData(rawMapInfo.data, scale),
            };
        }
    })();

    function scaleData(data: Data, scale: number) {
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                key,
                value ? value * scale : null,
            ])
        );
    }
</script>

<main>
    <MapSelector bind:mapConfig bind:scale />
    <Map {mapInfo} />
</main>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
        background: #000;
        color: #eee;
    }
    main {
        display: flex;
    }
</style>
