import { Dataset } from '../Dataset'
import { useUpdateMapVisualizationMutation } from '../MapApi'
import { MapVisualization } from '../MapVisualization'
import { Combobox } from '../ui'

export default function DatasetSelector({
    mapVisualization,
    datasets,
}: {
    mapVisualization: MapVisualization
    datasets: Dataset[]
}) {
    const [updateMap] = useUpdateMapVisualizationMutation()

    return (
        <Combobox
            label="Dataset"
            options={datasets}
            getLabel={(dataset) => dataset.name}
            value={datasets.find((dataset) => dataset.id === mapVisualization.dataset) ?? null}
            onChange={(dataset) =>
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
