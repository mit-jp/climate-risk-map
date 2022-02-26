import { Autocomplete, TextField } from '@mui/material'
import { Dataset } from '../Dataset'
import { useUpdateMapVisualizationMutation } from '../MapApi'
import { MapVisualization } from '../MapVisualization'

export default function DatasetSelector({
    mapVisualization,
    datasets,
}: {
    mapVisualization: MapVisualization
    datasets: Dataset[]
}) {
    const [updateMap] = useUpdateMapVisualizationMutation()

    return (
        <Autocomplete
            renderInput={(params) => <TextField {...params} label="Dataset" />}
            options={datasets}
            getOptionLabel={(dataset) => dataset.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={datasets.find((dataset) => dataset.id === mapVisualization.dataset)}
            onChange={(_, dataset) =>
                dataset &&
                updateMap({
                    ...mapVisualization,
                    dataset: dataset.id,
                    default_end_date: undefined,
                    default_start_date: undefined,
                    default_source: undefined,
                    pdf_domain: [],
                    color_domain: [],
                })
            }
        />
    )
}
