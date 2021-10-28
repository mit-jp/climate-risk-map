<script type="ts">
    import { getMapConfigs } from "./MapConfigApi";
    import type { MapConfig } from "./MapConfigApi";
    import ColorBar from "./ColorBar.svelte";
    import { simpleColor } from "./Color";

    const mapConfigs = getMapConfigs();
    let mapConfigId = 0;

    export let mapConfig: MapConfig | undefined = undefined;
    $: (async () => (mapConfig = (await mapConfigs)[mapConfigId]))();
</script>

<div id="map-configs">
    {#await mapConfigs}
        <p>Loading map configs...</p>
    {:then mapConfigs}
        <form>
            {#each Object.values(mapConfigs) as mapConfig (mapConfig.id)}
                <div class="map-config">
                    <input
                        type="radio"
                        name="map-config"
                        bind:group={mapConfigId}
                        value={mapConfig.id}
                        id={mapConfig.id.toString()}
                    />
                    <label for={mapConfig.id.toString()}>
                        <div class="config-name">{mapConfig.name}</div>
                        <ColorBar colorScheme={simpleColor(mapConfig)} />
                    </label>
                </div>
            {/each}
        </form>
    {:catch error}
        <p>Error loading map configs: {error.message}</p>
    {/await}
</div>

<style>
    #map-configs {
        flex-shrink: 0;
        height: 100vh;
        margin: 0;
        overflow-y: auto;
        width: 500px;
    }
    form {
        margin: 0;
    }
    input {
        display: none;
    }
    input:checked + label,
    label:hover {
        background: rgb(211, 211, 211);
    }
    .map-config {
        display: flex;
        flex-direction: column;
    }
    label {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0.5em;
    }
</style>
