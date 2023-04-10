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
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
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
    if (name === 'Marine highways') {
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

function Overlays({ overlays }: { overlays: Record<OverlayName, Overlay> }) {
    const dispatch = useDispatch()

    return (
        <>
            {Object.entries(overlays).map(([overlayName, overlay]) => (
                <>
                    <FormControlLabel
                        key={overlayName}
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
                </>
            ))}
        </>
    )
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
    const region: Region = maps[0]?.geography_type === 1 ? 'USA' : 'World'
    const params = useParams()
    const { tabId } = params
    const navigate = useNavigate()

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
            {region === 'USA' && <Overlays overlays={overlays} />}
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
