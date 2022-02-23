import React, { useState } from 'react'
import Papa from 'papaparse'
import FileInfo from './FileInfo'
import css from './Uploader.module.css'
import CsvPreview from './CsvPreview'

function stopPropagation(e: React.DragEvent) {
    e.stopPropagation()
    e.preventDefault()
}

function Uploader() {
    const [file, setFile] = useState<File>()
    const [csv, setCsv] = useState<Papa.ParseResult<any> | undefined>()

    const handleFiles = (files: FileList) => {
        const loadedFile = files[0]
        setFile(loadedFile)
        Papa.parse(loadedFile, {
            header: true,
            preview: 10,
            complete(data) {
                setCsv(data)
            },
        })
    }

    const onDrop = (e: React.DragEvent) => {
        e.stopPropagation()
        e.preventDefault()

        const { files } = e.dataTransfer
        handleFiles(files)
    }

    return (
        <div onDragEnter={stopPropagation} onDragOver={stopPropagation} onDrop={onDrop}>
            <h1>Drag and drop a csv file</h1>
            Or click to
            <input
                type="file"
                accept="text/csv"
                onChange={(event) => {
                    const { files } = event.target
                    if (files) {
                        handleFiles(files)
                    }
                }}
            />
            {file && <FileInfo file={file} />}
            {csv && <CsvPreview csv={csv} />}
            {file && !csv && <p>loading...</p>}
        </div>
    )
}
export default Uploader
