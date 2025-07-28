import { styled, Tooltip, TooltipProps, tooltipClasses } from '@mui/material'
import { Info } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { MapVisualization } from './MapVisualization'
import css from './MapTitle.module.css'
import { clickMap } from './appSlice'
import { RootState } from './store'

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
    const zoomTo = useSelector((state: RootState) => state.app.zoomTo)
    const dispatch = useDispatch()
    return (
        <div className={css.mapTitleContainer}>
            {zoomTo && (
                // creates a button that zooms back out if zoomed into a state or country
                <button
                    type="button"
                    className={css.zoomOutButton}
                    onClick={() => dispatch(clickMap(-1))}
                >
                    ←
                </button>
            )}
            <h3 id={css.mapTitle}>
                {getTitle(selectedMapVisualizations)}
                {isNormalized && (
                    <BigTooltip
                        title="The normalized value is the percentile
                of the raw data. If you select multiple data,
                we take the mean of the ranked values."
                    >
                        <Info
                            sx={{
                                verticalAlign: 'middle',
                                marginLeft: '8px',
                                marginBottom: '3px',
                            }}
                        />
                    </BigTooltip>
                )}
            </h3>
        </div>
    )
}

export function EmptyMapTitle() {
    return <div id={css.emptyTitle} />
}
export default MapTitle
