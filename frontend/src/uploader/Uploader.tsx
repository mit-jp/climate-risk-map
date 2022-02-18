import React, { FormEvent, useState } from 'react'
import Papa from 'papaparse'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@mui/material'
import css from './Uploader.module.css'
import { selectCsv, selectDataColumns, selectMetadata, setCsv } from './uploaderSlice'
import CsvPreview from './CsvPreview'
import MetadataForm from './MetadataForm'
import UploadData, { uploadDataFromForm, FormData } from './UploadData'
import { useGetDataSourcesQuery, useUploadMutation } from '../MapApi'

function stopPropagation(e: React.DragEvent) {
    e.stopPropagation()
    e.preventDefault()
}

const valid = (metadata: FormData, file: File, csv: Papa.ParseResult<any>) => {
    const validColumns = csv.meta?.fields ?? []
    return (
        metadata.stateColumn !== metadata.countyColumn &&
        validColumns.includes(metadata.stateColumn) &&
        validColumns.includes(metadata.countyColumn) &&
        metadata.datasets.length > 0 &&
        (typeof metadata.source === 'number' ||
            (metadata.source.description.length > 0 &&
                metadata.source.link.length > 0 &&
                metadata.source.name.length > 0)) &&
        metadata.datasets.every(
            (d) =>
                d.name.length > 0 &&
                d.shortName.length > 0 &&
                d.columns.every((c) => validColumns.includes(c.name))
        )
    )
}

function Uploader() {
    const [file, setFile] = useState<File>()
    const dispatch = useDispatch()
    const dataColumns = useSelector(selectDataColumns)
    const csv = useSelector(selectCsv)
    const metadata = useSelector(selectMetadata)
    const [upload] = useUploadMutation()
    const { data: dataSources } = useGetDataSourcesQuery(undefined)

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
                {metadata && dataSources && (
                    <MetadataForm
                        freeColumns={metadata.freeColumns}
                        stateColumn={metadata.stateColumn}
                        countyColumn={metadata.countyColumn}
                        source={metadata.source}
                        datasets={metadata.datasets}
                        columns={metadata.columns}
                        dataSources={dataSources}
                    />
                )}
                {metadata && dataSources && (
                    <Button variant="contained" id={css.submit} type="submit">
                        Submit
                    </Button>
                )}
            </form>

            {csv && metadata && (
                <CsvPreview
                    csv={csv}
                    stateColumn={metadata.stateColumn}
                    countyColumn={metadata.countyColumn}
                    dataColumns={dataColumns}
                />
            )}
        </div>
    )
}
export default Uploader
