import { Info } from '@mui/icons-material'
import { IconButton, Tooltip, TooltipProps, styled, tooltipClasses } from '@mui/material'
import css from './MapTitle.module.css'
import { MapSpec } from './MapVisualization'

const getTitle = (selectedMaps: MapSpec[]) => {
    if (selectedMaps.length > 1) {
        return 'Combined data'
    }
    if (selectedMaps.length === 0) {
        return ''
    }
    return selectedMaps[0].displayName
}

type Props = {
    selectedMapVisualizations: MapSpec[]
    isNormalized: boolean
}

const BigTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow placement="top" classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
        fontSize: theme.typography.fontSize,
    },
}))

function MapTitle({ selectedMapVisualizations, isNormalized }: Props) {
    return (
        <h3 id={css.mapTitle}>
            {getTitle(selectedMapVisualizations)}
            {isNormalized && (
                <BigTooltip
                    title="The normalized value is the percentile
                of the raw data. If you select multiple data,
                we take the mean of the ranked values."
                >
                    <IconButton aria-label="info" size="large">
                        <Info />
                    </IconButton>
                </BigTooltip>
            )}
        </h3>
    )
}

export function EmptyMapTitle() {
    return <div id={css.emptyTitle} />
}
export default MapTitle
