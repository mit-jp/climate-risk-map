import { LoadingButton } from '@mui/lab'
import { Button, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Dataset } from '../Dataset'
import {
    Tab,
    useDeleteDatasetMutation,
    useGetDatasetsQuery,
    useGetMapVisualizationsByDatasetQuery,
    useGetTabsQuery,
    useUnpublishMapVisualizationMutation,
    useUpdateDatasetMutation,
} from '../MapApi'
import { MapVisualization } from '../MapVisualization'
import SelectorList, { EmptySelectorList } from '../SelectorList'
import css from './DatasetEditor.module.css'

function MapVisualizations({
    mapVisualizations,
    tabs,
}: {
    mapVisualizations: Record<number, Record<number, MapVisualization>>
    tabs: Tab[]
}) {
    const [unpublish] = useUnpublishMapVisualizationMutation()
    const tabName = (tabs: Tab[], tabId: number) => tabs.find((t) => t.id === tabId)?.name

    return (
        <div className={css.mapVisualizations}>
            <p>
                You cannot delete a dataset while published maps exist. Unpublish these if you want
                to delete the dataset:
            </p>
            <ul>
                {Object.entries(mapVisualizations).map(([tabId, mapVisualizations]) =>
                    Object.values(mapVisualizations).map((mapVisualization) => (
                        <li key={`${tabId} ${mapVisualization.id}`}>
                            <p>
                                <a href={`/editor/${tabId}`} target="_blank" rel="noreferrer">
                                    {tabName(tabs, Number(tabId))}
                                </a>
                                {' > '}
                                {mapVisualization.displayName}
                            </p>
                            <Button
                                className={css.publishButton}
                                onClick={() => {
                                    const id = {
                                        map_visualization: mapVisualization.id,
                                        category: Number(tabId),
                                    }
                                    unpublish(id)
                                }}
                                variant="contained"
                                color="error"
                            >
                                Unpublish
                            </Button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    )
}

function DatasetOptions({ dataset }: { dataset: Dataset }) {
    const { data: mapVisualizations } = useGetMapVisualizationsByDatasetQuery(dataset.id)
    const { data: tabs } = useGetTabsQuery(false)
    const [updateDataset, { isLoading }] = useUpdateDatasetMutation()
    const [deleteDataset, { isLoading: isDeleting }] = useDeleteDatasetMutation()
    const [name, setName] = useState(dataset.name)
    const [description, setDescription] = useState(dataset.description)
    const [units, setUnits] = useState(dataset.units)
    const [shortName, setShortName] = useState(dataset.short_name)

    useEffect(() => {
        setName(dataset.name)
        setDescription(dataset.description)
        setUnits(dataset.units)
        setShortName(dataset.short_name)
    }, [dataset])

    const noDiff = () => {
        return (
            name === dataset.name &&
            description === dataset.description &&
            units === dataset.units &&
            shortName === dataset.short_name
        )
    }

    return (
        <form
            className={css.datasetOptions}
            onSubmit={(e) => {
                updateDataset({
                    id: dataset.id,
                    name,
                    description,
                    units,
                    short_name: shortName,
                })
                e.preventDefault()
            }}
        >
            <TextField value={name} onChange={(e) => setName(e.target.value)} label="name" />
            <TextField value={shortName} label="url name" disabled />
            <TextField
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                label="description"
                multiline
            />
            <TextField value={units} onChange={(e) => setUnits(e.target.value)} label="units" />
            <LoadingButton
                variant="contained"
                type="submit"
                loading={isLoading}
                disabled={noDiff()}
            >
                Save
            </LoadingButton>
            <LoadingButton
                type="button"
                variant="contained"
                loading={isDeleting}
                color="error"
                onClick={() => deleteDataset(dataset.id)}
                disabled={!mapVisualizations || !tabs || Object.keys(mapVisualizations).length > 0}
            >
                Delete
            </LoadingButton>
            {(!mapVisualizations || !tabs) && <p>loading maps...</p>}
            {tabs && mapVisualizations && Object.keys(mapVisualizations).length > 0 && (
                <MapVisualizations mapVisualizations={mapVisualizations} tabs={tabs} />
            )}
        </form>
    )
}

function EmptyDatasetOptions() {
    return <p>select a dataset</p>
}

export default function DatasetEditor() {
    const { data: datasets } = useGetDatasetsQuery(undefined)
    const [datasetId, setDatasetId] = useState<number>()
    const dataset = datasets?.find((d) => d.id === datasetId)

    return (
        <div className={css.datasetEditor}>
            {datasets ? (
                <SelectorList
                    items={datasets}
                    selectedId={datasetId}
                    onClick={(dataset) => setDatasetId(dataset.id)}
                    id={(dataset) => dataset.id}
                    label={(dataset) => dataset.name}
                />
            ) : (
                <EmptySelectorList />
            )}
            {dataset ? <DatasetOptions dataset={dataset} /> : <EmptyDatasetOptions />}
        </div>
    )
}
