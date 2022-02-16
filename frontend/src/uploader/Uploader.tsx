import React, { useState } from 'react'
import FileInfo from './FileInfo'
import css from './Uploader.module.css'

function stopPropagation(e: React.DragEvent) {
    e.stopPropagation()
    e.preventDefault()
}

function Uploader() {
    const [file, setFile] = useState<File>()

    const handleFiles = (files: FileList) => {
        setFile(files[0])
    }

    const onDrop = (e: React.DragEvent) => {
        e.stopPropagation()
        e.preventDefault()

        const { files } = e.dataTransfer
        handleFiles(files)
    }

    return (
        <div id={css.uploader}>
            <h1>Upload more data</h1>
            <form
                id={css.dropzone}
                onDragEnter={stopPropagation}
                onDragOver={stopPropagation}
                onDrop={onDrop}
            >
                Drop files to upload or
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
            </form>
            {file && <FileInfo file={file} />}
        </div>
    )
}
export default Uploader
