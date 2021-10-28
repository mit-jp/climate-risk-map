<script lang="ts">
    import type { County } from "./Counties";

    export let counties: County[];
</script>

<g id="counties">
    {#each counties as county (county.id)}
        <path fill={"#eee"} d={county.path} id={county.id} />
    {/each}
</g>

<style>
    path:hover {
        fill-opacity: 0.3;
        stroke: black;
    }
</style>
