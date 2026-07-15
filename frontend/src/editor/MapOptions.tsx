import { ascending } from 'd3'
import { useEffect, useState } from 'react'
import {
    useGetColorPalettesQuery,
    useGetScaleTypesQuery,
    useUpdateMapVisualizationMutation,
    useGetSubcategoriesQuery,
} from '../MapApi'
import { FormatterType, MapType, MapVisualization } from '../MapVisualization'
import { Combobox, TextField } from '../ui'
import css from './Editor.module.css'

const INPUT_MARGIN = { margin: '0.5em 0' }

type UpdateMap = (mapVisualization: MapVisualization) => void

function Radio({
    name,
    value,
    current,
    onChange,
    label,
}: {
    name: string
    value: number
    current: number | undefined
    onChange: (value: number) => void
    label: string
}) {
    return (
        <label className="ui-choice">
            <input
                type="radio"
                className="ui-radio"
                name={name}
                value={value}
                checked={current === value}
                onChange={(event) => onChange(parseInt(event.target.value, 10))}
            />
            {label}
        </label>
    )
}

/** Comma-separated numbers, committed when the field loses focus */
function DomainInput({
    mapVisualization,
    updateMap,
}: {
    mapVisualization: MapVisualization
    updateMap: UpdateMap
}) {
    const domain = mapVisualization.color_domain.join(', ')
    const [text, setText] = useState(domain)
    useEffect(() => setText(domain), [domain])

    return (
        <TextField
            label="Domain"
            placeholder="e.g. 0, 50, 100"
            style={INPUT_MARGIN}
            value={text}
            onChange={(event) => setText(event.target.value)}
            onBlur={() =>
                updateMap({
                    ...mapVisualization,
                    color_domain: text
                        .split(',')
                        .map((value) => value.trim())
                        .filter((value) => value !== '')
                        .map(Number)
                        .filter(Number.isFinite)
                        .sort(ascending),
                })
            }
        />
    )
}

function MapOptions({ mapVisualization }: { mapVisualization: MapVisualization }) {
    const { data: colorPalettes } = useGetColorPalettesQuery(undefined)
    const { data: scales } = useGetScaleTypesQuery(undefined)
    const { data: subcategories } = useGetSubcategoriesQuery(undefined)
    const [updateMap] = useUpdateMapVisualizationMutation()
    const [customLegendFormat, setCustomLegendFormat] = useState<boolean>(false)

    const subcategoryOptions: { id: number | null; name: string }[] = [
        { id: null, name: 'None' },
        ...(subcategories ?? []),
    ]

    return (
        <form id={css.mapOptions}>
            <fieldset className="ui-fieldset">
                <legend>Map Type</legend>
                <Radio
                    name="map-type"
                    value={MapType.Choropleth}
                    current={mapVisualization.map_type}
                    onChange={(mapType) => updateMap({ ...mapVisualization, map_type: mapType })}
                    label="Choropleth"
                />
                <Radio
                    name="map-type"
                    value={MapType.Bubble}
                    current={mapVisualization.map_type}
                    onChange={(mapType) => updateMap({ ...mapVisualization, map_type: mapType })}
                    label="Bubble"
                />
            </fieldset>
            {mapVisualization.map_type === MapType.Choropleth && (
                <>
                    <fieldset className="ui-fieldset">
                        <legend>Color Scheme</legend>
                        {scales && (
                            <Combobox
                                label="Scale"
                                value={mapVisualization.scale_type}
                                options={scales}
                                getLabel={(option) => option.name}
                                style={INPUT_MARGIN}
                                onChange={(scaleType) =>
                                    updateMap({ ...mapVisualization, scale_type: scaleType })
                                }
                            />
                        )}
                        {colorPalettes && (
                            <Combobox
                                label="Color Palette"
                                value={mapVisualization.color_palette}
                                options={colorPalettes}
                                getLabel={(option) => option.name}
                                style={INPUT_MARGIN}
                                onChange={(colorPalette) =>
                                    updateMap({ ...mapVisualization, color_palette: colorPalette })
                                }
                            />
                        )}

                        <DomainInput mapVisualization={mapVisualization} updateMap={updateMap} />

                        <label className="ui-choice">
                            <input
                                type="checkbox"
                                className="ui-checkbox"
                                checked={mapVisualization.reverse_scale}
                                onChange={(event) =>
                                    updateMap({
                                        ...mapVisualization,
                                        reverse_scale: event.target.checked,
                                    })
                                }
                            />
                            Invert
                        </label>
                    </fieldset>

                    <label className="ui-choice">
                        <input
                            type="checkbox"
                            className="ui-checkbox"
                            checked={mapVisualization.show_pdf}
                            onChange={(event) =>
                                updateMap({ ...mapVisualization, show_pdf: event.target.checked })
                            }
                        />
                        Show Probability Density
                    </label>
                </>
            )}

            <fieldset className="ui-fieldset">
                <legend>Formatter</legend>
                <Radio
                    name="formatter"
                    value={FormatterType.DEFAULT}
                    current={mapVisualization.formatter_type}
                    onChange={(formatterType) =>
                        updateMap({ ...mapVisualization, formatter_type: formatterType })
                    }
                    label="Default"
                />
                <Radio
                    name="formatter"
                    value={FormatterType.MONEY}
                    current={mapVisualization.formatter_type}
                    onChange={(formatterType) =>
                        updateMap({ ...mapVisualization, formatter_type: formatterType })
                    }
                    label="Money"
                />
                <Radio
                    name="formatter"
                    value={FormatterType.NEAREST_SI_UNIT}
                    current={mapVisualization.formatter_type}
                    onChange={(formatterType) =>
                        updateMap({ ...mapVisualization, formatter_type: formatterType })
                    }
                    label="Nearest SI Unit"
                />
                <Radio
                    name="formatter"
                    value={FormatterType.PERCENT}
                    current={mapVisualization.formatter_type}
                    onChange={(formatterType) =>
                        updateMap({ ...mapVisualization, formatter_type: formatterType })
                    }
                    label="Percent"
                />
                <TextField
                    label="Decimal places"
                    type="number"
                    value={mapVisualization.decimals ?? ''}
                    onChange={(e) => {
                        const decimals = parseInt(e.target.value, 10)
                        if (Number.isInteger(decimals) && decimals >= 0) {
                            updateMap({ ...mapVisualization, decimals })
                        }
                    }}
                />
            </fieldset>

            {mapVisualization.map_type === MapType.Choropleth && (
                <fieldset className="ui-fieldset">
                    <legend>Combinatory Metrics</legend>
                    {subcategories && (
                        <Combobox
                            label="Subcategory"
                            value={
                                subcategoryOptions.find(
                                    (option) => option.id === mapVisualization.subcategory
                                ) ?? null
                            }
                            options={subcategoryOptions}
                            getLabel={(option) => option.name}
                            style={INPUT_MARGIN}
                            onChange={(subcategory) =>
                                updateMap({
                                    ...mapVisualization,
                                    // null (not undefined) so the server clears the subcategory
                                    subcategory: subcategory.id as number | undefined,
                                })
                            }
                        />
                    )}
                </fieldset>
            )}

            <fieldset className="ui-fieldset">
                <legend>Legend</legend>
                <TextField
                    style={INPUT_MARGIN}
                    label="Custom Legend Tick Count"
                    type="number"
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
                    style={INPUT_MARGIN}
                    label="Decimal places"
                    type="number"
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

                <label className="ui-choice">
                    <input
                        type="checkbox"
                        className="ui-checkbox"
                        checked={
                            mapVisualization.legend_formatter_type !== undefined ||
                            customLegendFormat
                        }
                        onChange={(event) => {
                            const shouldCustomize = event.target.checked
                            setCustomLegendFormat(shouldCustomize)
                            shouldCustomize
                                ? updateMap({
                                      ...mapVisualization,
                                      legend_formatter_type: mapVisualization.legend_formatter_type,
                                  })
                                : updateMap({
                                      ...mapVisualization,
                                      legend_formatter_type: undefined,
                                  })
                        }}
                    />
                    Custom legend format
                </label>
                {(customLegendFormat || mapVisualization.legend_formatter_type) && (
                    <>
                        <Radio
                            name="legend-formatter"
                            value={FormatterType.DEFAULT}
                            current={mapVisualization.legend_formatter_type}
                            onChange={(legendFormatterType) =>
                                updateMap({
                                    ...mapVisualization,
                                    legend_formatter_type: legendFormatterType,
                                })
                            }
                            label="Default"
                        />
                        <Radio
                            name="legend-formatter"
                            value={FormatterType.MONEY}
                            current={mapVisualization.legend_formatter_type}
                            onChange={(legendFormatterType) =>
                                updateMap({
                                    ...mapVisualization,
                                    legend_formatter_type: legendFormatterType,
                                })
                            }
                            label="Money"
                        />
                        <Radio
                            name="legend-formatter"
                            value={FormatterType.NEAREST_SI_UNIT}
                            current={mapVisualization.legend_formatter_type}
                            onChange={(legendFormatterType) =>
                                updateMap({
                                    ...mapVisualization,
                                    legend_formatter_type: legendFormatterType,
                                })
                            }
                            label="Nearest SI Unit"
                        />
                    </>
                )}
            </fieldset>
        </form>
    )
}

export function EmptyMapOptions() {
    return <form id={css.mapOptions} />
}
export default MapOptions
