import {
    Autocomplete,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material'
import { ascending } from 'd3'
import { useState } from 'react'
import {
    useGetColorPalettesQuery,
    useGetScaleTypesQuery,
    useUpdateMapVisualizationMutation,
} from '../MapApi'
import { FormatterType, MapType, MapVisualization } from '../MapVisualization'
import css from './Editor.module.css'

const INPUT_MARGIN = { margin: '0.5em 0' }

function MapOptions({ mapVisualization }: { mapVisualization: MapVisualization }) {
    const { data: colorPalettes } = useGetColorPalettesQuery(undefined)
    const { data: scales } = useGetScaleTypesQuery(undefined)
    const [updateMap] = useUpdateMapVisualizationMutation()
    const [customLegendFormat, setCustomLegendFormat] = useState<boolean>(false)

    return (
        <form id={css.mapOptions}>
            <FormControl component="fieldset">
                <FormLabel component="legend">Map Type</FormLabel>
                <RadioGroup
                    aria-label="map-type"
                    value={mapVisualization.map_type}
                    name="map-type"
                    onChange={(_, mapType) =>
                        updateMap({ ...mapVisualization, map_type: parseInt(mapType, 10) })
                    }
                >
                    <FormControlLabel
                        value={MapType.Choropleth}
                        control={<Radio />}
                        label="Choropleth"
                    />
                    <FormControlLabel value={MapType.Bubble} control={<Radio />} label="Bubble" />
                </RadioGroup>
            </FormControl>
            {mapVisualization.map_type === MapType.Choropleth && (
                <>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Color Scheme</FormLabel>
                        {scales && (
                            <Autocomplete
                                disablePortal
                                value={mapVisualization.scale_type}
                                options={scales}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                sx={INPUT_MARGIN}
                                renderInput={(params) => <TextField {...params} label="Scale" />}
                                onChange={(_, scaleType) =>
                                    scaleType &&
                                    updateMap({ ...mapVisualization, scale_type: scaleType })
                                }
                            />
                        )}
                        {colorPalettes && (
                            <Autocomplete
                                disablePortal
                                value={mapVisualization.color_palette}
                                options={colorPalettes}
                                onChange={(_, colorPalette) =>
                                    colorPalette &&
                                    updateMap({ ...mapVisualization, color_palette: colorPalette })
                                }
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                sx={INPUT_MARGIN}
                                renderInput={(params) => (
                                    <TextField {...params} label="Color Palette" />
                                )}
                            />
                        )}

                        <Autocomplete
                            multiple
                            freeSolo
                            sx={INPUT_MARGIN}
                            value={mapVisualization.color_domain.map((d) => d.toString())}
                            options={[]}
                            renderInput={(params) => <TextField {...params} label="Domain" />}
                            onChange={(_, colorDomain) => {
                                updateMap({
                                    ...mapVisualization,
                                    color_domain: colorDomain
                                        .map(Number)
                                        .filter(Number.isFinite)
                                        .sort(ascending),
                                })
                            }}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={mapVisualization.reverse_scale}
                                    onChange={(_, reverseScale) =>
                                        updateMap({
                                            ...mapVisualization,
                                            reverse_scale: reverseScale,
                                        })
                                    }
                                />
                            }
                            label="Invert"
                        />
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={mapVisualization.show_pdf}
                                onChange={(_, showPdf) =>
                                    updateMap({ ...mapVisualization, show_pdf: showPdf })
                                }
                            />
                        }
                        label="Show Probability Density"
                    />
                </>
            )}

            <FormControl component="fieldset">
                <FormLabel component="legend">Formatter</FormLabel>
                <RadioGroup
                    aria-label="formatter"
                    value={mapVisualization.formatter_type}
                    name="formatter"
                    onChange={(_, formatterType) =>
                        updateMap({
                            ...mapVisualization,
                            formatter_type: parseInt(formatterType, 10),
                        })
                    }
                >
                    <FormControlLabel
                        value={FormatterType.DEFAULT}
                        control={<Radio />}
                        label="Default"
                    />
                    <FormControlLabel
                        value={FormatterType.MONEY}
                        control={<Radio />}
                        label="Money"
                    />
                    <FormControlLabel
                        value={FormatterType.NEAREST_SI_UNIT}
                        control={<Radio />}
                        label="Nearest SI Unit"
                    />
                    <FormControlLabel
                        value={FormatterType.PERCENT}
                        control={<Radio />}
                        label="Percent"
                    />
                </RadioGroup>
                <TextField
                    label="Decimal places"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={mapVisualization.decimals ?? ''}
                    onChange={(e) => {
                        const decimals = parseInt(e.target.value, 10)
                        if (Number.isInteger(decimals) && decimals >= 0) {
                            updateMap({ ...mapVisualization, decimals })
                        }
                    }}
                />
            </FormControl>

            <FormControl component="fieldset">
                <FormLabel component="legend">Legend</FormLabel>
                <TextField
                    sx={INPUT_MARGIN}
                    label="Custom Legend Tick Count"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={mapVisualization.legend_ticks ?? ''}
                    onChange={(e) => {
                        let legendTicks: number | undefined = parseInt(e.target.value, 10)
                        if (Number.isNaN(legendTicks) || legendTicks < 0) {
                            legendTicks = undefined
                        } else if (Number.isInteger(legendTicks) && legendTicks >= 0) {
                            updateMap({ ...mapVisualization, legend_ticks: legendTicks })
                        }
                    }}
                />
                <TextField
                    sx={INPUT_MARGIN}
                    label="Decimal places"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={mapVisualization.legend_decimals ?? mapVisualization.decimals}
                    onChange={(e) => {
                        let legendDecimals: number | undefined = parseInt(e.target.value, 10)
                        if (Number.isNaN(legendDecimals) || legendDecimals < 0) {
                            legendDecimals = undefined
                        } else if (Number.isInteger(legendDecimals) && legendDecimals >= 0) {
                            updateMap({ ...mapVisualization, legend_decimals: legendDecimals })
                        }
                    }}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={
                                mapVisualization.legend_formatter_type !== undefined ||
                                customLegendFormat
                            }
                            onChange={(_, shouldCustomize) => {
                                setCustomLegendFormat(shouldCustomize)
                                shouldCustomize
                                    ? updateMap({
                                          ...mapVisualization,
                                          legend_formatter_type:
                                              mapVisualization.legend_formatter_type,
                                      })
                                    : updateMap({
                                          ...mapVisualization,
                                          legend_formatter_type: undefined,
                                      })
                            }}
                        />
                    }
                    label="Custom legend format"
                />
                {(customLegendFormat || mapVisualization.legend_formatter_type) && (
                    <RadioGroup
                        aria-label="legend-formatter"
                        value={mapVisualization.legend_formatter_type}
                        name="legend-formatter"
                        onChange={(_, legendFormatterType) =>
                            updateMap({
                                ...mapVisualization,
                                legend_formatter_type: parseInt(legendFormatterType, 10),
                            })
                        }
                    >
                        <FormControlLabel
                            value={FormatterType.DEFAULT}
                            control={<Radio />}
                            label="Default"
                        />
                        <FormControlLabel
                            value={FormatterType.MONEY}
                            control={<Radio />}
                            label="Money"
                        />
                        <FormControlLabel
                            value={FormatterType.NEAREST_SI_UNIT}
                            control={<Radio />}
                            label="Nearest SI Unit"
                        />
                    </RadioGroup>
                )}
            </FormControl>
        </form>
    )
}

export function EmptyMapOptions() {
    return <form id={css.mapOptions} />
}
export default MapOptions
