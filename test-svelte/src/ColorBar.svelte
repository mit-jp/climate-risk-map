<script type="ts">
    import type { ColorScheme } from "src/Color";

    export let colorScheme: ColorScheme;

    let canvas: HTMLCanvasElement;
    $: {
        if (canvas) {
            const n = 300;
            const context = canvas.getContext("2d")!;
            for (let i = 0; i < n; ++i) {
                context.fillStyle = colorScheme(i / (n - 1));
                context.fillRect(i, 0, 1, canvas.height);
            }
        }
    }
</script>

<canvas bind:this={canvas} />

<style>
    canvas {
        margin: 0;
        width: 100%;
        height: 8px;
        image-rendering: -moz-crisp-edges;
        image-rendering: pixelated;
    }
</style>
