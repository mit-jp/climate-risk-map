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
import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Map } from 'immutable'
import { csvFormat } from 'd3'
import { saveAs } from 'file-saver'
import {
    Overlay,
    OverlayName,
    selectIsNormalized,
    selectSelectedMapVisualizations,
    setDetailedView,
    setShowOverlay,
    setTransmissionLineType,
    setWaterwayValue,
    TransmissionLineType,
} from './appSlice'
import { useThunkDispatch } from './Home'
import { RootState } from './store'
import counties from './Counties'
import states, { State } from './States'
import waterwayTypes, { WaterwayValue } from './WaterwayType'
import { getLegendTitle } from './FullMap'
import { MapVisualization } from './MapVisualization'

const getFilename = (selectedMaps: MapVisualization[], isNormalized: boolean) => {
    const unitString = getLegendTitle(selectedMaps, isNormalized)
    if (unitString === 'Mean of selected data') {
        return unitString
    }
    return selectedMaps[0].name + unitString
}

type Props = {
    processedData: Map<string, number> | undefined
}

function MapControls({ processedData }: Props) {
    const dispatch = useThunkDispatch()
    const isNormalized = useSelector(selectIsNormalized)
    const selectedMapVisualizations = useSelector(selectSelectedMapVisualizations)
    const overlays = useSelector((state: RootState) => state.app.overlays)
    const detailedView = useSelector((state: RootState) => state.app.detailedView)
    const waterwayValue = useSelector((state: RootState) => state.app.waterwayValue)
    const transmissionLineType = useSelector((state: RootState) => state.app.transmissionLineType)
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
        const objectData = processedData
            ?.sortBy((_, fipsCode) => fipsCode)
            .map((value, fipsCode) => {
                const county = counties.get(fipsCode)
                const state = states.get(fipsCode.slice(0, 2) as State)
                return { fipsCode, state, county, value }
            })
            .valueSeq()
            .toArray()
        if (objectData) {
            const csv = csvFormat(objectData, ['fipsCode', 'state', 'county', 'value'])
            const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' })
            saveAs(blob, `${getFilename(selectedMapVisualizations, isNormalized)}.csv`)
        }
    }

    const downloadImage = () => {
        const svg = document.getElementById('map-svg')
        if (svg?.outerHTML) {
            const blob = new Blob([svg.outerHTML], { type: 'text/plain' })
            saveAs(blob, `${getFilename(selectedMapVisualizations, isNormalized)}.svg`)
        }
    }

    return (
        <div id="map-controls">
            {mapToggleUI()}
            {isNormalized && processedData && (
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
            {processedData && (
                <Button variant="outlined" onClick={downloadData}>
                    Download data
                </Button>
            )}
            {processedData && (
                <Button variant="outlined" onClick={downloadImage}>
                    Download Image
                </Button>
            )}
        </div>
    )
}

export default MapControls
