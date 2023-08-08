import { format } from 'd3'
import { FormatterType, MapSpec } from './MapVisualization'

type FormatterParams = {
    type: FormatterType
    decimals: number
    isNormalized: boolean
    units: string
}

export type Formatter = (n: number | { valueOf(): number }) => string

export const riskMetricFormatter = (d: number | { valueOf(): number }) =>
    format('.0%')(d).slice(0, -1)

export const createFormatter = ({
    isNormalized,
    type,
    decimals,
}: {
    isNormalized: boolean
    type: FormatterType
    decimals: number
}) => {
    if (isNormalized) {
        return riskMetricFormatter
    }
    switch (type) {
        case FormatterType.MONEY:
            return format(`$,.${decimals}s`)
        case FormatterType.NEAREST_SI_UNIT:
            return format('~s')
        case FormatterType.PERCENT:
            return (d: number | { valueOf(): number }) => format(`.${decimals}%`)(d).slice(0, -1)
        case FormatterType.DEFAULT:
        default:
            return format(`,.${decimals}f`)
    }
}

export const getUnitString = ({
    units,
    isNormalized,
}: {
    units: string
    isNormalized: boolean
}) => {
    const unitString = isNormalized ? 'Normalized value' : units
    if (!unitString) {
        return ''
    }

    return unitString.startsWith('%') ? unitString : ` ${unitString}`
}

export const formatData = (value: number | undefined, params: FormatterParams) => {
    const formatter = createFormatter(params)
    if (value == null) {
        return 'No data'
    }
    if (params.isNormalized) {
        return formatter(value)
    }
    return formatter(value) + getUnitString(params)
}

export const getLegendFormatter = (selectedMaps: MapSpec[], isNormalized: boolean): Formatter => {
    const firstMap = selectedMaps[0]
    const type = firstMap.legend_formatter_type ?? firstMap.formatter_type
    const decimals = firstMap.legend_decimals ?? firstMap.decimals
    return createFormatter({ type, decimals, isNormalized })
}
