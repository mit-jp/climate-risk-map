<script lang="ts">
    import { Data, getData } from "./DataApi";

    import Map from "./Map.svelte";
    import MapSelector from "./MapSelector.svelte";
    import { getDataQueryParams, MapConfig } from "./MapConfigApi";
    import type { MapInfo } from "./MapInfo";

    let mapConfig: MapConfig | undefined;
    let scale: number;
    let mapInfo: MapInfo | undefined;

    $: (async () => {
        if (mapConfig) {
            const queryParams = getDataQueryParams(mapConfig);
            const data = await getData(queryParams);
            const scaledData = Object.fromEntries(
                Object.entries(data).map(([key, value]) => [
                    key,
                    value ? value * scale : null,
                ])
            );
            mapInfo = {
                data: scaledData,
                mapConfig,
            };
        }
    })();
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
