import { useDispatch, useSelector } from 'react-redux'
import { clickMap, Region, stateId } from './appSlice'
import COUNTIES from './Counties'
import css from './MapTitle.module.css'
import { MapVisualization } from './MapVisualization'
import states from './States'
import { RootState } from './store'
import { Info, Tooltip } from './ui'

const getTitle = (selectedMaps: MapVisualization[]) => {
    if (selectedMaps.length > 1) {
        return 'Combined data'
    }
    if (selectedMaps.length === 0) {
        return ''
    }
    return selectedMaps[0].displayName
}

const getSubtitle = (countyId: number | undefined, region: Region) => {
    if (countyId) {
        const countyName = COUNTIES.get(countyId) || 'Unknown County'
        const stateIdValue = stateId(countyId)
        const stateName = stateIdValue ? states.get(stateIdValue) : 'Unknown State'
        return `${countyName}, ${stateName}`
    }
    return {
        USA: 'United States',
        World: 'World',
        EssexMassachusetts: 'Essex County, Massachusetts',
    }[region]
}

type Props = {
    selectedMapVisualizations: MapVisualization[]
    isNormalized: boolean
    showStateLevelWarning: boolean
}

function MapTitle({ selectedMapVisualizations, isNormalized, showStateLevelWarning }: Props) {
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
                    Zoom Out
                </button>
            )}
            {/* the tooltip sits beside the heading, not inside it, so it
                does not inherit the heading's larger em font size */}
            <div id={css.mapTitle}>
                <h3>{getTitle(selectedMapVisualizations)}</h3>
                {isNormalized && (
                    <Tooltip tip="The normalized value is the percentile of the raw data. If you select multiple data, we take the mean of the ranked values.">
                        <Info className={css.infoIcon} />
                    </Tooltip>
                )}
            </div>
            <p id={css.mapSubtitle}>{getSubtitle(countyId, region)}</p>
            {showStateLevelWarning && (
                <div id={css.stateDataWarning} className={zoomTo ? css.zoomed : ''}>
                    {' '}
                    <h3 id={css.stateDataWarningTitle}>⚠️ Data Limitation Notice</h3>
                    <p id={css.stateDataWarningParagraph}>
                        This dataset contains state-level data. <br /> For accurate analysis, we
                        have disabled state analysis while state-level data is enabled.
                    </p>
                </div>
            )}
        </div>
    )
}

export function EmptyMapTitle() {
    const dispatch = useDispatch()
    const zoomTo = useSelector((state: RootState) => state.app.zoomTo)
    return (
        <div className={css.mapTitleContainer}>
            {zoomTo && (
                <button
                    type="button"
                    className={css.zoomOutButton}
                    onClick={() => dispatch(clickMap(-1))}
                >
                    Zoom Out
                </button>
            )}
            <h1 id={css.noMetricTitle}>No metric selected</h1>
        </div>
    )
}
export default MapTitle
