import { Autocomplete, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Checkbox } from "@mui/material";
import { useGetColorPalettesQuery, useGetScaleTypesQuery, useUpdateMapVisualizationMutation } from "../MapApi";
import { FormatterType, MapType, MapVisualization } from "../MapVisualization";

const MapOptions = ({ mapVisualization }: { mapVisualization: MapVisualization }) => {
    const { data: colorPalettes } = useGetColorPalettesQuery(undefined);
    const { data: scales } = useGetScaleTypesQuery(undefined);
    const [updateMap] = useUpdateMapVisualizationMutation();

    return <form id="map-options">
        <FormControl component="fieldset">
            <FormLabel component="legend">Map Type</FormLabel>
            <RadioGroup
                aria-label="map-type"
                value={mapVisualization.map_type}
                name="map-type"
                onChange={(_, map_type) => updateMap({ ...mapVisualization, map_type: parseInt(map_type) })}
            >
                <FormControlLabel value={MapType.Choropleth} control={<Radio />} label="Choropleth" />
                <FormControlLabel value={MapType.Bubble} control={<Radio />} label="Bubble" />
            </RadioGroup>
        </FormControl>
        <FormControl component="fieldset">
            <FormLabel component="legend">Color Scheme</FormLabel>
            {scales && <Autocomplete
                disablePortal
                value={mapVisualization.scale_type}
                options={scales}
                getOptionLabel={option => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Scale" />}
                onChange={(_, scale_type) => scale_type && updateMap({ ...mapVisualization, scale_type })}
            />}
            {colorPalettes && <Autocomplete
                disablePortal
                value={mapVisualization.color_palette}
                options={colorPalettes}
                onChange={(_, color_palette) => color_palette && updateMap({ ...mapVisualization, color_palette })}
                getOptionLabel={option => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Color Palette" />}
            />}
            <FormControlLabel
                control={<Checkbox
                    checked={mapVisualization.reverse_scale}
                    onChange={(_, reverse_scale) => updateMap({ ...mapVisualization, reverse_scale })}
                />}
                label="Invert" />
        </FormControl>
        <FormControlLabel
            control={<Checkbox
                checked={mapVisualization.show_pdf}
                onChange={(_, show_pdf) => updateMap({ ...mapVisualization, show_pdf })}
            />}
            label="Show Probability Density" />

        <FormControl component="fieldset">
            <FormLabel component="legend">Formatter</FormLabel>
            <RadioGroup
                aria-label="formatter"
                value={mapVisualization.formatter_type}
                name="formatter"
                onChange={(_, formatter_type) => updateMap({ ...mapVisualization, formatter_type: parseInt(formatter_type) })}
            >
                <FormControlLabel value={FormatterType.DEFAULT} control={<Radio />} label="Default" />
                <FormControlLabel value={FormatterType.MONEY} control={<Radio />} label="Money" />
                <FormControlLabel value={FormatterType.NEAREST_SI_UNIT} control={<Radio />} label="Nearest SI Unit" />
            </RadioGroup>
            <TextField
                label="Decimal places"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                value={mapVisualization.decimals ?? ""}
                onChange={e => {
                    const decimals = parseInt(e.target.value);
                    if (Number.isInteger(decimals)) {
                        updateMap({ ...mapVisualization, decimals })
                    }
                }}
            />
        </FormControl>

        <FormControl component="fieldset">
            <FormLabel component="legend">Legend</FormLabel>
            <TextField
                label="Custom Legend Tick Count"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                value={mapVisualization.legend_ticks ?? ""}
                onChange={e => {
                    let legend_ticks: number | null = parseInt(e.target.value);
                    if (Number.isNaN(legend_ticks)) {
                        legend_ticks = null;
                    }
                    updateMap({ ...mapVisualization, legend_ticks })
                }}
            />
            <TextField
                label="Decimal places"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                value={mapVisualization.decimals}
            />
        </FormControl>

    </form>;
}

export const EmptyMapOptions = () => <form id="map-options"></form>;
export default MapOptions;