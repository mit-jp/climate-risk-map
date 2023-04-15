import { LoadingButton } from '@mui/lab'
import { TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Dataset } from '../Dataset'
import { useGetDatasetsQuery, useUpdateDatasetMutation } from '../MapApi'
import SelectorList, { EmptySelectorList } from '../SelectorList'
import css from './DatasetEditor.module.css'

function DatasetOptions({ dataset }: { dataset: Dataset }) {
    const [updateDataset, { isLoading }] = useUpdateDatasetMutation()
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
