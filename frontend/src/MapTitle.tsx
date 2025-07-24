import { IconButton, styled, Tooltip, TooltipProps, tooltipClasses } from '@mui/material'
import { Info } from '@mui/icons-material'
import { MapVisualization } from './MapVisualization'
import css from './MapTitle.module.css'

const getTitle = (selectedMaps: MapVisualization[]) => {
    if (selectedMaps.length > 1) {
        return 'Combined data'
    }
    if (selectedMaps.length === 0) {
        return ''
    }
    return selectedMaps[0].displayName
}

type Props = {
    selectedMapVisualizations: MapVisualization[]
    isNormalized: boolean
    showStateLevelWarning: boolean
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

function MapTitle({ selectedMapVisualizations, isNormalized, showStateLevelWarning }: Props) {
    return (
        <>
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
            {showStateLevelWarning && (
                <div id={css.stateDataWarning}>
                    <h3 id={css.stateDataWarningTitle}>⚠️ Data Limitation Notice</h3>
                    <p id={css.stateDataWarningParagraph}>
                        This dataset contains state-level data only. <br></br> For accurate
                        analysis, please compare at the national view.
                    </p>
                </div>
            )}
        </>
    )
}

export function EmptyMapTitle() {
    return <div id={css.emptyTitle} />
}
export default MapTitle
