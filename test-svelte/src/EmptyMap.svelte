<script lang="ts">
    import type { County } from "./Counties";

    export let counties: County[];
</script>

<g id="counties">
    {#each counties as county (county.id)}
        <path fill={"#eee"} d={county.path} />
    {/each}
</g>
