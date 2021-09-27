import { Autocomplete, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { useGetColorPalettesQuery, useUpdateMapVisualizationMutation } from "../MapApi";
import { MapVisualization, ScaleType } from "../MapVisualization";

const scales: ScaleType[] = [
    "Diverging",
    "Sequential",
    "DivergingSymLog",
    "Threshold",
    "SequentialSqrt",
];

const MapOptions = ({ mapVisualization }: { mapVisualization: MapVisualization }) => {
    const { data: colorPalettes } = useGetColorPalettesQuery(undefined);
    const [setColorPalette] = useUpdateMapVisualizationMutation();
    return <form id="map-options">
        <FormControl component="fieldset">
            <FormLabel component="legend">Map Type</FormLabel>
            <RadioGroup
                aria-label="map-type"
                defaultValue="choropleth"
                name="map-type"
            >
                <FormControlLabel value="choropleth" control={<Radio />} label="Choropleth" />
                <FormControlLabel value="bubble" control={<Radio />} label="Bubble" />
            </RadioGroup>
        </FormControl>
        <FormControl component="fieldset">
            <FormLabel component="legend">Color Scheme</FormLabel>
            <Autocomplete
                disablePortal
                defaultValue={mapVisualization.scale_type}
                options={scales}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Scale" />}
            />
            {colorPalettes && <Autocomplete
                disablePortal
                value={mapVisualization.color_palette}
                options={colorPalettes}
                onChange={(_, colorPalette) => colorPalette && setColorPalette({ ...colorPalette, mapVisualizationId: mapVisualization.id })}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Color Palette" />}
            />}
        </FormControl>
    </form>;
}

export const EmptyMapOptions = () => <form id="map-options"></form>;
export default MapOptions;