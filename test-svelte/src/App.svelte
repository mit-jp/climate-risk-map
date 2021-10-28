<script lang="ts">
    import { getData } from "./DataApi";

    import Map from "./Map.svelte";
    import MapSelector from "./MapSelector.svelte";
    import { getDataQueryParams, MapConfig } from "./MapConfigApi";

    let mapConfig: MapConfig | undefined;
    $: mapInfo = mapConfig
        ? {
              mapConfig,
              data: getData(getDataQueryParams(mapConfig)),
          }
        : undefined;
</script>

<main>
    <MapSelector bind:mapConfig />
    <Map {mapInfo} />
</main>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
    }
    main {
        display: flex;
    }
</style>
