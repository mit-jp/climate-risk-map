import { LoadingButton } from '@mui/lab'
import { TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { DataSource, useGetDataSourcesQuery, useUpdateDataSourceMutation } from '../MapApi'
import SelectorList, { EmptySelectorList } from '../SelectorList'
import css from './DatasetEditor.module.css'

function DataSourceOptions({ dataSource }: { dataSource: DataSource }) {
    const [updateDataSource, { isLoading }] = useUpdateDataSourceMutation()
    const [name, setName] = useState(dataSource.name)
    const [description, setDescription] = useState(dataSource.description)
    const [link, setLink] = useState(dataSource.link)

    useEffect(() => {
        setName(dataSource.name)
        setDescription(dataSource.description)
        setLink(dataSource.link)
    }, [dataSource])

    const noDiff = () => {
        return (
            name === dataSource.name &&
            description === dataSource.description &&
            link === dataSource.link
        )
    }

    return (
        <form
            className={css.datasetOptions}
            onSubmit={(e) => {
                updateDataSource({
                    id: dataSource.id,
                    name,
                    description,
                    link,
                })
                e.preventDefault()
            }}
        >
            <TextField value={name} onChange={(e) => setName(e.target.value)} label="name" />
            <TextField
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                label="description"
                multiline
            />
            <TextField
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                label="link"
            />
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

function EmptyDataSourceOptions() {
    return <p>select a data source</p>
}

export default function DataSourceEditor() {
    const { data: dataSources } = useGetDataSourcesQuery(undefined)
    const [dataSourceId, setDatasetId] = useState<number>()
    const dataSource = dataSources?.find((d) => d.id === dataSourceId)

    return (
        <div className={css.datasetEditor}>
            {dataSources ? (
                <SelectorList
                    items={dataSources}
                    selectedId={dataSourceId}
                    onClick={(dataSource) => setDatasetId(dataSource.id)}
                    id={(dataset) => dataset.id}
                    label={(dataset) => dataset.name}
                />
            ) : (
                <EmptySelectorList />
            )}
            {dataSource ? (
                <DataSourceOptions dataSource={dataSource} />
            ) : (
                <EmptyDataSourceOptions />
            )}
        </div>
    )
}
