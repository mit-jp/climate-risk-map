import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    Tooltip,
} from '@mui/material'
import { csvFormat } from 'd3'
import { saveAs } from 'file-saver'
import { Map } from 'immutable'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import counties from './Counties'
import { getLegendTitle } from './FullMap'
import css from './MapControls.module.css'
import { MapVisualization } from './MapVisualization'
import nations from './Nations'
import states from './States'
import waterwayTypes, { WaterwayValue } from './WaterwayType'
import {
    GeoId,
    Overlay,
    OverlayName,
    Region,
    TransmissionLineType,
    clickMap,
    setDetailedView,
    setShowOverlay,
    setTransmissionLineType,
    setWaterwayValue,
    stateId,
} from './appSlice'
import { RootState } from './store'

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
            <FormControl>
                <InputLabel shrink className={css.overlayOptionsLabel} id="transmission-lines-type">
                    Type
                </InputLabel>
                <Select
                    labelId="transmission-lines-type"
                    value={transmissionLineType}
                    className={css.overlayOptions}
                    onChange={(event) =>
                        dispatch(
                            setTransmissionLineType(event.target.value as TransmissionLineType)
                        )
                    }
                >
                    {transmissionLinesTypes.map((value) => (
                        <MenuItem key={value} value={value}>
                            {value}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        )
    }
    if (name === 'Marine highways') {
        return (
            <FormControl>
                <InputLabel shrink className={css.overlayOptionsLabel} id="waterway-type">
                    Tonnage
                </InputLabel>
                <Select
                    labelId="waterway-type"
                    value={waterwayValue}
                    className={css.overlayOptions}
                    onChange={(event) =>
                        dispatch(setWaterwayValue(event.target.value as WaterwayValue))
                    }
                >
                    {waterwayTypes.map(({ name, value }) => (
                        <MenuItem key={value} value={value}>
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        )
    }
    return null
}

function OverlayCheckBoxes({ overlays }: { overlays: Record<OverlayName, Overlay> }) {
    const dispatch = useDispatch()

    return (
        <>
            {Object.entries(overlays).map(([overlayName, overlay]) => (
                <Fragment key={overlayName}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={(_, value) =>
                                    dispatch(
                                        setShowOverlay({
                                            name: overlayName as OverlayName,
                                            shouldShow: value,
                                        })
                                    )
                                }
                                title={overlayName}
                                color="primary"
                            />
                        }
                        label={overlayName}
                    />
                    {overlay.shouldShow && <OverlaySubControl name={overlayName as OverlayName} />}
                </Fragment>
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

    const countyId = useSelector((state: RootState) => state.app.county)
    const zoomTo = useSelector((state: RootState) => state.app.zoomTo)
    const region: Region = maps[0]?.geography_type === 1 ? 'USA' : 'World'
    const params = useParams()
    const { tabId } = params

    const UsaCsv = (sortedData: Map<number, number> | undefined) => {
        const objectData = sortedData
            ?.map((value, id) => {
                const county = counties.get(id)
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
                const nation = nations.get(id)
                return { id, nation, value }
            })
            .valueSeq()
            .toArray()
        if (objectData) {
            return csvFormat(objectData, ['id', 'nation', 'value'])
        }
        return undefined
    }

    const downloadData = () => {
        const sortedData = data?.sortBy((_, id) => id)
        const csv = region === 'USA' ? UsaCsv(sortedData) : WorldCsv(sortedData)
        if (csv) {
            const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' })
            saveAs(blob, `${getFilename(maps, isNormalized)}.csv`)
        }
    }

    const downloadImageSVG = () => {
        const svg = document.getElementById('map-svg')
        if (svg?.outerHTML) {
            const blob = new Blob([svg.outerHTML], { type: 'text/plain' })
            saveAs(blob, `${getFilename(maps, isNormalized)}.svg`)
        }
    }

    const downloadImagePNG = () => {
        const svg = document.getElementById('map-svg')
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
        <div id={css.mapControls}>
            <div>
                {countyId && (
                    <Button
                        variant="outlined"
                        onClick={() => window.open(`/report-card/${tabId ?? '8'}/${countyId}`)}
                    >
                        View report card for {counties.get(countyId)},{' '}
                        {states.get(stateId(countyId))}
                    </Button>
                )}
            </div>
            <div id={css.overlays}>
                {region === 'USA' && <OverlayCheckBoxes overlays={overlays} />}
                {isNormalized && data && (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={detailedView}
                                onChange={(_, value) => dispatch(setDetailedView(value))}
                                name="detailed-view"
                                color="primary"
                            />
                        }
                        label="Detailed View"
                    />
                )}
            </div>
            <div>
                {data && (
                    <Button variant="outlined" onClick={downloadData}>
                        Download Data
                    </Button>
                )}
                {data && (
                    <Button variant="outlined" onClick={downloadImageSVG}>
                        Download Image (SVG)
                    </Button>
                )}
                {data && (
                    <Tooltip title="Google Chrome is recommended to download PNG images" arrow>
                        <Button variant="outlined" onClick={downloadImagePNG}>
                            Download Image (PNG)
                        </Button>
                    </Tooltip>
                )}
            </div>
        </div>
    )
}

export default MapControls
