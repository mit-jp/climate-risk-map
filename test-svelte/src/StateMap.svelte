<script lang="ts">
    import { geoPath } from "d3";

    import { mesh } from "topojson-client";
    import type { GeometryCollection } from "topojson-specification";
    import type { TopoJson } from "./MapUtils";

    export let topoJson: TopoJson;

    $: statePath = geoPath()(
        mesh(
            topoJson,
            topoJson.objects.states as GeometryCollection,
            (a, b) => a !== b
        )
    )!;
</script>

<g id="states">
    <path d={statePath} stroke="#777" fill="none" stroke-linejoin="round" />
</g>
