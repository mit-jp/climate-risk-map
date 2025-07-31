import { styled, Tooltip, TooltipProps, tooltipClasses } from '@mui/material'
import { Info } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { MapVisualization } from './MapVisualization'
import { stateId, clickMap } from './appSlice'
import css from './MapTitle.module.css'
import { RootState } from './store'
import counties from './Counties'
import states from './States'

const getTitle = (selectedMaps: MapVisualization[]) => {
    if (selectedMaps.length > 1) {
        return 'Combined data'
    }
    if (selectedMaps.length === 0) {
        return ''
    }
    return selectedMaps[0].displayName
}

const getSubtitle = (countyId: number | undefined, region: string) => {
    if (countyId) {
        const countyName = counties.get(countyId) || 'Unknown County'
        const stateIdValue = stateId(countyId)
        const stateName = stateIdValue ? states.get(stateIdValue) : 'Unknown State'
        return `${countyName}, ${stateName}`
    }
    if (region === 'USA') {
        return 'United States'
    }
    return 'World'
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
    const countyId = useSelector((state: RootState) => state.app.county)
    const region = useSelector((state: RootState) => state.app.region)
    return (
        <div className={css.mapTitleContainer}>
            {zoomTo && (
                // creates a button that zooms back out if zoomed into a state or country
                <button
                    type="button"
                    className={css.zoomOutButton}
                    onClick={() => dispatch(clickMap(-1))}
                >
                    {/* <ZoomOut
                        fontSize="medium"
                        sx={{
                            verticalAlign: 'middle',
                        }}
                    /> */}
                    Zoom Out
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
            <p id={css.mapSubtitle}>{getSubtitle(countyId, region)}</p>
        </div>
    )
}

export function EmptyMapTitle() {
    return (
        <div id={css.emptyTitle}>
            <h1 id={css.noMetricTitle}>No metric selected</h1>
        </div>
    )
}
export default MapTitle
