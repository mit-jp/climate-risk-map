<script lang="ts">
    import { geoPath } from "d3-geo";
    import { feature } from "topojson-client";
    import type { GeometryCollection } from "topojson-specification";
    import type { GeoJsonProperties } from "geojson";

    import type { TopoJson } from "./MapUtils";

    export let topoJson: TopoJson;

    $: nationPath = geoPath()(
        feature(
            topoJson,
            topoJson.objects.nation as GeometryCollection<GeoJsonProperties>
        ).features[0]
    )!;
</script>

<g id="nation">
    <path d={nationPath} stroke="white" fill="#eee" stroke-line-join="round" />
</g>
