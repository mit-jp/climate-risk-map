import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
} from '@mui/material'
import { csvFormat } from 'd3'
import { saveAs } from 'file-saver'
import { Map } from 'immutable'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import counties from './Counties'
import { getLegendTitle } from './FullMap'
import css from './MapControls.module.css'
import { MapVisualization } from './MapVisualization'
import states from './States'
import waterwayTypes, { WaterwayValue } from './WaterwayType'
import {
    GeoId,
    Overlay,
    OverlayName,
    TransmissionLineType,
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

type Props = {
    data: Map<GeoId, number> | undefined
    isNormalized: boolean
    maps: MapVisualization[]
}

function MapControls({ data, isNormalized, maps }: Props) {
    const dispatch = useDispatch()
    const overlays = useSelector((state: RootState) => state.app.overlays)
    const detailedView = useSelector((state: RootState) => state.app.detailedView)
    const waterwayValue = useSelector((state: RootState) => state.app.waterwayValue)
    const transmissionLineType = useSelector((state: RootState) => state.app.transmissionLineType)
    const countyId = useSelector((state: RootState) => state.app.county)
    const params = useParams()
    const { tabId } = params
    const navigate = useNavigate()
    const transmissionLinesTypes: TransmissionLineType[] = [
        'Level 2 (230kV-344kV)',
        'Level 3 (>= 345kV)',
        'Level 2 & 3 (>= 230kV)',
    ]

    const subControl = (overlayName: OverlayName) => {
        if (overlayName === 'Transmission lines') {
            return (
                <FormControl>
                    <InputLabel shrink id="transmission-lines-type">
                        Type
                    </InputLabel>
                    <Select
                        labelId="transmission-lines-type"
                        value={transmissionLineType}
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
        if (overlayName === 'Marine highways') {
            return (
                <FormControl>
                    <InputLabel shrink id="waterway-type">
                        Tonnage
                    </InputLabel>
                    <Select
                        labelId="waterway-type"
                        value={waterwayValue}
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

    const mapToggleUI = () => {
        return (Object.entries(overlays) as [OverlayName, Overlay][]).map(
            ([overlayName, overlay]) => {
                return (
                    <Fragment key={overlayName}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={(_, value) =>
                                        dispatch(
                                            setShowOverlay({ name: overlayName, shouldShow: value })
                                        )
                                    }
                                    title={overlayName}
                                    color="primary"
                                />
                            }
                            label={overlayName}
                        />
                        {overlay.shouldShow && subControl(overlayName)}
                    </Fragment>
                )
            }
        )
    }

    const downloadData = () => {
        const objectData = data
            ?.sortBy((_, fipsCode) => fipsCode)
            .map((value, fipsCode) => {
                const county = counties.get(fipsCode)
                const state = states.get(stateId(fipsCode))
                return { fipsCode, state, county, value }
            })
            .valueSeq()
            .toArray()
        if (objectData) {
            const csv = csvFormat(objectData, ['fipsCode', 'state', 'county', 'value'])
            const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' })
            saveAs(blob, `${getFilename(maps, isNormalized)}.csv`)
        }
    }

    const downloadImage = () => {
        const svg = document.getElementById('map-svg')
        if (svg?.outerHTML) {
            const blob = new Blob([svg.outerHTML], { type: 'text/plain' })
            saveAs(blob, `${getFilename(maps, isNormalized)}.svg`)
        }
    }

    return (
        <div id={css.mapControls}>
            {countyId && (
                <Button
                    variant="outlined"
                    onClick={() => navigate(`/report-card/${tabId ?? '8'}/${countyId}`)}
                >
                    View report card for {counties.get(countyId)}, {states.get(stateId(countyId))}
                </Button>
            )}
            {mapToggleUI()}
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
            {data && (
                <Button variant="outlined" onClick={downloadData}>
                    Download data
                </Button>
            )}
            {data && (
                <Button variant="outlined" onClick={downloadImage}>
                    Download Image
                </Button>
            )}
        </div>
    )
}

export default MapControls
