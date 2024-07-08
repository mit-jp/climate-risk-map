import { LoadingButton } from '@mui/lab'
import Papa from 'papaparse'
import React, { FormEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    GeographyType,
    UploadError,
    useGetDataSourcesQuery,
    useGetGeographyTypesQuery,
    useUploadMutation,
} from '../MapApi'
import CsvPreview from './CsvPreview'
import MetadataForm from './MetadataForm'
import UploadData, { FormData, uploadDataFromForm } from './UploadData'
import css from './Uploader.module.css'
import { selectCsv, selectDataColumns, selectMetadata, setCsv } from './uploaderSlice'

function stopPropagation(e: React.DragEvent) {
    e.stopPropagation()
    e.preventDefault()
}

const valid = (metadata: FormData, file: File, csv: Papa.ParseResult<any>) => {
    const validColumns = csv.meta?.fields ?? []
    return (
        validColumns.includes(metadata.idColumn) &&
        metadata.datasets.length > 0 &&
        (typeof metadata.source === 'number' ||
            (metadata.source.description.length > 0 &&
                metadata.source.link.length > 0 &&
                metadata.source.name.length > 0)) &&
        metadata.datasets.every((d) => d.name.length > 0 && validColumns.includes(d.column))
    )
}

const pretty = (any: object): string => JSON.stringify(any, null, 2)

function Error({
    e,
    geographyTypes,
    geographyType,
}: {
    e: UploadError
    geographyTypes?: GeographyType[]
    geographyType?: number
}) {
    const idName = `${geographyTypes?.find((g) => g.id === geographyType)?.name} ID` ?? 'Geo ID'
    const details = (e: UploadError) => {
        switch (e.name) {
            case 'InvalidCsv':
                return <p>Invalid csv file: {e}</p>
            case 'MissingColumn':
                return (
                    <p>
                        Missing column {e.info.column} at row {e.info.row}:{pretty(e.info.record)}
                    </p>
                )
            case 'GeoIdNotNumeric':
                return (
                    <p>
                        {idName} {e.info.geo_id} at row {e.info.row} is not valid
                    </p>
                )
            case 'InvalidGeoIds':
                return (
                    <>
                        <p>These {idName}s are invalid:</p>
                        <ul>
                            {e.info.map((geoId) => (
                                <li key={`${geoId.id} ${geoId.geography_type}`}>{geoId.id}</li>
                            ))}
                        </ul>
                    </>
                )
            case 'DuplicateDataInCsv':
                return (
                    <p>
                        Row {e.info.row} has the same dataset, date, and {idName} as a previous row:
                        {pretty(e.info.parsed_data)}.
                    </p>
                )
            case 'DuplicateDatasets':
                return (
                    <>
                        <p>Duplicate dataset{e.info.length > 1 ? 's' : ''}</p>
                        <ul>
                            {e.info.map((dataset) => (
                                <li key={`${dataset.short_name} ${dataset.name}`}>
                                    name: {dataset.name}, short_name: {dataset.short_name}
                                </li>
                            ))}
                        </ul>
                    </>
                )
            case 'DataNonNumeric':
                return (
                    <>
                        <p>At least one value must be numeric.</p>
                        <p>
                            Make sure values do not have symbols attached in csv (e.g. $, %, etc.)
                        </p>
                    </>
                )
            case 'DuplicateDataSource':
                return <p>Duplicate data source: {e.info.name}</p>
            case 'DataSourceIncomplete':
                return <p>Data source incomplete</p>
            case 'DataSourceLinkInvalid':
                return <p>Data source link is invalid: {e.info}</p>
            case 'MissingMetadata':
                return <p>Missing metadata</p>
            case 'InvalidMetadata':
                return <p>Invalid metadata: {e.info}</p>
            case 'MissingFile':
                return <p>Missing file</p>
            case 'Internal':
                return <p>Something went wrong on the server. Contact an admin.</p>
            case 'InvalidYear':
                return (
                    <p>
                        Invalid year {e.info.year} on row {e.info.row}
                    </p>
                )
            default: {
                const exhaustiveCheck: never = e
                return exhaustiveCheck
            }
        }
    }
    return <div className={css.error}>{details(e)}</div>
}

function Uploader() {
    const [file, setFile] = useState<File>()
    const dispatch = useDispatch()
    const dataColumns = useSelector(selectDataColumns)
    const csv = useSelector(selectCsv)
    const metadata = useSelector(selectMetadata)
    const [upload, { error, isLoading, isSuccess, isError }] = useUploadMutation()
    const { data: dataSources } = useGetDataSourcesQuery(undefined)
    const { data: geographyTypes } = useGetGeographyTypesQuery(undefined)

    const handleFiles = (files: FileList) => {
        const loadedFile = files[0]
        setFile(loadedFile)
        Papa.parse(loadedFile, {
            header: true,
            preview: 10,
            complete(data) {
                dispatch(setCsv(data))
            },
        })
    }

    const onDrop = (e: React.DragEvent) => {
        e.stopPropagation()
        e.preventDefault()

        const { files } = e.dataTransfer
        handleFiles(files)
    }
    const submitUpload = (e: FormEvent) => {
        e.preventDefault()
        if (!metadata || !file || !csv || !valid(metadata, file, csv)) {
            return
        }
        const uploadData: UploadData = uploadDataFromForm(metadata, file)
        upload(uploadData)
    }

    return (
        <div
            id={css.uploader}
            onDragEnter={stopPropagation}
            onDragOver={stopPropagation}
            onDrop={onDrop}
        >
            <form onSubmit={submitUpload}>
                {!file && <h1>Drag and drop a csv file</h1>}
                <input
                    name="file"
                    type="file"
                    accept="text/csv"
                    onChange={(event) => {
                        const { files } = event.target
                        if (files) {
                            handleFiles(files)
                        }
                    }}
                />
                {file && (!metadata || !dataSources) && <p>loading...</p>}
                {csv && metadata && (
                    <>
                        <h2>Preview of the first ten rows</h2>

                        <CsvPreview
                            csv={csv}
                            idColumn={metadata.idColumn}
                            dateColumn={metadata.dateColumn}
                            dataColumns={dataColumns}
                        />
                    </>
                )}
                {metadata && dataSources && geographyTypes && (
                    <MetadataForm
                        freeColumns={metadata.freeColumns}
                        geographyType={metadata.geographyType}
                        idColumn={metadata.idColumn}
                        dateColumn={metadata.dateColumn}
                        source={metadata.source}
                        datasets={metadata.datasets}
                        geographyTypes={geographyTypes}
                        columns={metadata.columns}
                        dataSources={dataSources}
                    />
                )}
                {metadata && dataSources && (
                    <LoadingButton
                        variant="contained"
                        id={css.submit}
                        type="submit"
                        loading={isLoading}
                    >
                        Submit
                    </LoadingButton>
                )}
                {isSuccess && (
                    <div className={css.success}>
                        <p>Upload successful</p>
                        <p>
                            View your datasets in the <a href="/dataset-editor">dataset editor</a>
                        </p>
                        <p>
                            Edit the data sources in the{' '}
                            <a href="/data-source-editor">data source editor</a>
                        </p>
                        <p>
                            Create maps in the <a href="/editor/-1">map editor</a>
                        </p>
                    </div>
                )}
                {isError && error && (
                    <Error
                        e={error as UploadError}
                        geographyTypes={geographyTypes}
                        geographyType={metadata?.geographyType}
                    />
                )}
            </form>
        </div>
    )
}
export default Uploader
