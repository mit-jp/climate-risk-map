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
export const redBlue = scaleThreshold<number, string, never>(
    [0.05, 0.25, 0.75, 0.95],
    [...schemeRdYlBu[5]].reverse()
)

const colorScheme = (
    map: MapVisualization,
    trueDomain: { min: number; median: number; max: number }
): ColorScheme => {
    const colorPalette = map.color_palette.name
    const type = map.scale_type.name
    let domain: number[]
    if (type === 'Diverging' || type === 'DivergingSymLog') {
        domain =
            map.color_domain.length >= 3
                ? map.color_domain
                : [trueDomain.min, trueDomain.median, trueDomain.max]
    } else {
        domain = map.color_domain.length >= 2 ? map.color_domain : [trueDomain.min, trueDomain.max]
    }

    const interpolator: (x: number) => string = map.reverse_scale
        ? (x) => (scales as any)[`interpolate${colorPalette}`](1 - x)
        : (scales as any)[`interpolate${colorPalette}`]

    switch (type) {
        case 'Diverging':
            return scaleDiverging(domain, interpolator)
        case 'Sequential':
            return scaleSequential(domain, interpolator)
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
    map: MapVisualization,
    trueDomain: { min: number; median: number; max: number }
): ColorScheme => {
    if (shouldNormalize) {
        return continuous ? redBlueContinuous : redBlue
    }
    return colorScheme(map, trueDomain)
}

export default Color
