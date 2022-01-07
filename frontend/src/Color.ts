import * as scales from 'd3-scale-chromatic'
import {
    scaleSequential,
    scaleThreshold,
    schemeRdYlBu,
    interpolateRdYlBu,
    ScaleSequential,
    ScaleThreshold,
    ScaleDiverging,
    scaleDiverging,
    scaleDivergingSymlog,
    scaleSequentialSqrt,
} from 'd3'
import { MapVisualization } from './MapVisualization'

export type ColorScheme =
    | ScaleSequential<string, never>
    | ScaleThreshold<number, string, never>
    | ScaleDiverging<string, never>

const redBlueContinuous = scaleSequential<string>((x) => interpolateRdYlBu(1 - x))
const redBlue = scaleThreshold<number, string, never>(
    [0.05, 0.25, 0.75, 0.95],
    [...schemeRdYlBu[5]].reverse()
)

const colorScheme = (map: MapVisualization): ColorScheme => {
    const domain = map.scale_domain
    const colorPalette = map.color_palette.name
    const interpolator: (x: number) => string = map.reverse_scale
        ? (x) => (scales as any)[`interpolate${colorPalette}`](1 - x)
        : (scales as any)[`interpolate${colorPalette}`]
    const scale: ReadonlyArray<string> = (scales as any)[`scheme${colorPalette}`][domain.length]
    const type = map.scale_type.name

    switch (type) {
        case 'Diverging':
            return scaleDiverging(domain, interpolator)
        case 'Sequential':
            return scaleSequential(domain, interpolator)
        case 'Threshold':
            return scaleThreshold(domain, scale)
        case 'DivergingSymLog':
            return scaleDivergingSymlog(domain, interpolator)
        case 'SequentialSqrt':
            return scaleSequentialSqrt(domain, interpolator)
        default:
            throw new Error(`Unknown scale type: ${type}`)
    }
}

const Color = (
    shouldNormalize: boolean,
    continuous: boolean,
    map: MapVisualization
): ColorScheme => {
    if (shouldNormalize) {
        return continuous ? redBlueContinuous : redBlue
    }
    return colorScheme(map)
}

export default Color
