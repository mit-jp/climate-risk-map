import { csvFormat } from 'd3'
import { saveAs } from 'file-saver'
import { Map } from 'immutable'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import COUNTIES from './Counties'
import { getLegendTitle } from './FullMap'
import css from './MapControls.module.css'
import { MapVisualization } from './MapVisualization'
import MASSACHUSETTS_CITIES from './MassachusettsCities'
import NATIONS from './Nations'
import states from './States'
import waterwayTypes, { WaterwayValue } from './WaterwayType'
import {
    GeoId,
    Overlay,
    OverlayName,
    REGION_FOR,
    TransmissionLineType,
    setDetailedView,
    setShowOverlay,
    setTransmissionLineType,
    setWaterwayValue,
    stateId,
} from './appSlice'
import { RootState } from './store'
import TOUR_TARGET from './tour/tourTargets'
import { Button, HelpOutline, Select } from './ui'

const getFilename = (selectedMaps: MapVisualization[], isNormalized: boolean) => {
    const unitString = getLegendTitle(selectedMaps, isNormalized)
    if (unitString === 'Mean of selected data') {
        return unitString
    }
    return selectedMaps[0].displayName + unitString
}

const transmissionLinesTypes: TransmissionLineType[] = [
    'Level 2 (230kV-344kV)',
    'Level 3 (>= 345kV)',
    'Level 2 & 3 (>= 230kV)',
]

function OverlaySubControl({ name }: { name: OverlayName }) {
    const dispatch = useDispatch()
    const waterwayValue = useSelector((state: RootState) => state.app.waterwayValue)
    const transmissionLineType = useSelector((state: RootState) => state.app.transmissionLineType)
    if (name === 'Transmission lines') {
        return (
            <Select
                label="Type"
                value={transmissionLineType}
                className={css.overlayOptions}
                onChange={(event) =>
                    dispatch(setTransmissionLineType(event.target.value as TransmissionLineType))
                }
            >
                {transmissionLinesTypes.map((value) => (
                    <option key={value} value={value}>
                        {value}
                    </option>
                ))}
            </Select>
        )
    }
    if (name === 'Marine highways') {
        return (
            <Select
                label="Tonnage"
                value={waterwayValue}
                className={css.overlayOptions}
                onChange={(event) =>
                    dispatch(setWaterwayValue(event.target.value as WaterwayValue))
                }
            >
                {waterwayTypes.map(({ name, value }) => (
                    <option key={value} value={value}>
                        {name}
                    </option>
                ))}
            </Select>
        )
    }
    return null
}

function OverlayCheckBoxes({ overlays }: { overlays: Record<OverlayName, Overlay> }) {
    const dispatch = useDispatch()

    return (
        <>
            {Object.entries(overlays).map(([overlayName, overlay]) => (
                <div key={overlayName} className={css.overlay}>
                    <label>
                        <input
                            type="checkbox"
                            onChange={(event) =>
                                dispatch(
                                    setShowOverlay({
                                        name: overlayName as OverlayName,
                                        shouldShow: event.target.checked,
                                    })
                                )
                            }
                            title={overlayName}
                        />
                        {overlayName}
                    </label>
                    {overlay.shouldShow && <OverlaySubControl name={overlayName as OverlayName} />}
                </div>
            ))}
        </>
    )
}

function triggerImageDownload(imgURL: string, maps: MapVisualization[], isNormalized: boolean) {
    const a = document.createElement('a')
    a.download = getFilename(maps, isNormalized)
    a.target = '_blank'
    a.href = imgURL

    a.click()
}

type Props = {
    data: Map<GeoId, number> | undefined
    isNormalized: boolean
    maps: MapVisualization[]
}

function MapControls({ data, isNormalized, maps }: Props) {
    const dispatch = useDispatch()
    const overlays = useSelector((state: RootState) => state.app.overlays)
    const detailedView = useSelector((state: RootState) => state.app.detailedView)
    const activeOverlayCount = Object.values(overlays).filter(
        (overlay) => overlay.shouldShow
    ).length

    const countyId = useSelector((state: RootState) => state.app.county)
    const geographyType = maps[0]?.geography_type
    const region = REGION_FOR[geographyType]
    const params = useParams()
    const { tabId } = params

    const UsaCsv = (sortedData: Map<number, number> | undefined) => {
        const objectData = sortedData
            ?.map((value, id) => {
                const county = COUNTIES.get(id)
                const state = states.get(stateId(id))
                return { id, state, county, value }
            })
            .valueSeq()
            .toArray()
        if (objectData) {
            return csvFormat(objectData, ['id', 'state', 'county', 'value'])
        }
        return undefined
    }

    const WorldCsv = (sortedData: Map<number, number> | undefined) => {
        const objectData = sortedData
            ?.map((value, id) => {
                const nation = NATIONS.get(id)
                return { id, nation, value }
            })
            .valueSeq()
            .toArray()
        if (objectData) {
            return csvFormat(objectData, ['id', 'nation', 'value'])
        }
        return undefined
    }

    const MassachusettsCsv = (sortedData: Map<number, number> | undefined) => {
        const objectData = sortedData
            ?.map((value, id) => {
                const city = MASSACHUSETTS_CITIES.get(id)
                return { id, city, value }
            })
            .valueSeq()
            .toArray()
        if (objectData) {
            return csvFormat(objectData, ['id', 'city', 'value'])
        }
        return undefined
    }

    const downloadData = () => {
        const sortedData = data?.sortBy((_, id) => id)
        const csv = {
            USA: UsaCsv,
            World: WorldCsv,
            EssexMassachusetts: MassachusettsCsv,
        }[region](sortedData)

        if (csv) {
            const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' })
            saveAs(blob, `${getFilename(maps, isNormalized)}.csv`)
        }
    }

    const downloadImageSVG = () => {
        const svg = document.getElementById(TOUR_TARGET.map)
        if (svg?.outerHTML) {
            const blob = new Blob([svg.outerHTML], { type: 'text/plain' })
            saveAs(blob, `${getFilename(maps, isNormalized)}.svg`)
        }
    }

    const downloadImagePNG = () => {
        const svg = document.getElementById(TOUR_TARGET.map)
        if (svg?.outerHTML) {
            const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' })
            const DOMURL = window.URL || window.webkitURL || window
            const url = DOMURL.createObjectURL(blob)

            const img = new Image()
            img.width = 3525
            img.height = 1830
            img.src = url

            // eslint-disable-next-line func-names
            img.onload = function () {
                const canvas = document.createElement('canvas')
                canvas.width = 3525
                canvas.height = 1830
                const ctx = canvas.getContext('2d')

                ctx?.drawImage(img, 0, 0, 3525, 1830)
                DOMURL.revokeObjectURL(url)

                const imgURL = canvas.toDataURL('image/png')

                triggerImageDownload(imgURL, maps, isNormalized)
            }
        }
    }

    return (
        <>
            <div id={css.countyControls}>
                {countyId && (
                    <div id={TOUR_TARGET.reportCard}>
                        <Button
                            id={css.reportCardButton}
                            variant="outlined"
                            onClick={() => window.open(`/report-card/${tabId ?? '8'}/${countyId}`)}
                        >
                            View report card for {COUNTIES.get(countyId)},{' '}
                            {states.get(stateId(countyId))}
                        </Button>
                        <details className="ui-popover" id={css.reportCardTooltip}>
                            <summary
                                className="ui-icon-button"
                                aria-label="about the report card"
                                role="button"
                            >
                                <HelpOutline size={20} />
                            </summary>
                            <div>
                                <p>
                                    Shows detailed county information including national and state
                                    percentiles for all metrics. Higher percentiles indicate higher
                                    risk.
                                </p>
                            </div>
                        </details>
                    </div>
                )}
            </div>
            <div id={css.mapControls}>
                {region === 'USA' && (
                    <>
                        <Button
                            variant="outlined"
                            id={TOUR_TARGET.overlays}
                            popovertarget="map-layers-panel"
                        >
                            Map layers
                            {activeOverlayCount > 0 && ` · ${activeOverlayCount}`} ▾
                        </Button>
                        <div id="map-layers-panel" popover="auto">
                            <OverlayCheckBoxes overlays={overlays} />
                        </div>
                    </>
                )}
                {isNormalized && data && (
                    <label>
                        <input
                            type="checkbox"
                            className="ui-switch"
                            checked={detailedView}
                            onChange={(event) => dispatch(setDetailedView(event.target.checked))}
                            name="detailed-view"
                        />
                        Detailed View
                    </label>
                )}
                {data && (
                    <>
                        <Button
                            variant="outlined"
                            className={css.downloadButton}
                            id={TOUR_TARGET.downloads}
                            popovertarget="download-panel"
                        >
                            Download ▾
                        </Button>
                        <div id="download-panel" popover="auto">
                            <Button
                                onClick={downloadData}
                                popovertarget="download-panel"
                                popovertargetaction="hide"
                            >
                                Data (CSV)
                            </Button>
                            <Button
                                onClick={downloadImageSVG}
                                popovertarget="download-panel"
                                popovertargetaction="hide"
                            >
                                Image (SVG)
                            </Button>
                            <Button
                                onClick={downloadImagePNG}
                                popovertarget="download-panel"
                                popovertargetaction="hide"
                            >
                                Image (PNG)
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default MapControls
