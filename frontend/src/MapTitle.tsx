import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Region, stateId } from './appSlice'
import COUNTIES from './Counties'
import css from './MapTitle.module.css'
import { MapVisualization } from './MapVisualization'
import states from './States'
import { RootState } from './store'
import TOUR_TARGET from './tour/tourTargets'
import { Button, Info, Tooltip } from './ui'

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
    const countyId = useSelector((state: RootState) => state.app.county)
    const region = useSelector((state: RootState) => state.app.region)
    const { tabId } = useParams()
    const subtitle = getSubtitle(countyId, region)

    return (
        <>
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
            {/* the subtitle names the selected place; with a county selected
                it doubles as the link to that county's report card */}
            {countyId ? (
                <div id={TOUR_TARGET.reportCard} className={css.subtitle}>
                    <Button
                        className={css.reportCardButton}
                        onClick={() => window.open(`/report-card/${tabId ?? '8'}/${countyId}`)}
                    >
                        View report card for {subtitle}
                    </Button>
                    <Tooltip tip="Shows detailed county information including national and state percentiles for all metrics. Higher percentiles indicate higher risk.">
                        <Info />
                    </Tooltip>
                </div>
            ) : (
                <p className={css.subtitle}>{subtitle}</p>
            )}
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
        </>
    )
}

export function EmptyMapTitle() {
    return <h1 id={css.noMetricTitle}>No metric selected</h1>
}
export default MapTitle
