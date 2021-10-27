<script type="ts">
    import { getMapConfigs } from "./MapConfigApi";
    import type { MapVisualization } from "./MapConfigApi";

    const mapConfigs = getMapConfigs();
    let mapConfigId = 0;
    export let mapConfig: MapVisualization | undefined;

    $: (async () => (mapConfig = (await mapConfigs)[mapConfigId]))();
</script>

<div id="map-configs">
    {#await mapConfigs}
        <p>Loading map configs...</p>
    {:then mapConfigs}
        <form>
            {#each Object.values(mapConfigs) as mapConfig (mapConfig.id)}
                <label>
                    <input
                        type="radio"
                        name="map-config"
                        bind:group={mapConfigId}
                        value={mapConfig.id}
                    />
                    {mapConfig.name}
                </label>
            {/each}
        </form>
    {:catch error}
        <p>Error loading map configs: {error.message}</p>
    {/await}
</div>

<style>
    #map-configs {
        width: 900px;
    }
    label {
        display: block;
    }
</style>
