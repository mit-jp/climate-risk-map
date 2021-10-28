<script type="ts">
    export let position: { x: number; y: number } = { x: 0, y: 0 };
    export let stateName: string;
    export let countyName: string;
    export let value: number | undefined;
</script>

<div id="tooltip" style="top: {position.y}px; left: {position.x}px">
    <h2>{countyName}, {stateName}</h2>
    <p>{value ?? "—"}</p>
</div>

<style>
    #tooltip {
        pointer-events: none;
        position: fixed;
        display: block;
        z-index: 1000;
        border-radius: 4px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
        background-color: white;
        opacity: 0.95;
        padding: 0.5em 1em;
    }
    #tooltip h2 {
        font-size: 1em;
        padding: 0;
        margin: 0;
    }
</style>
