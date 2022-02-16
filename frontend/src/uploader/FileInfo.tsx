import Papa from 'papaparse'
import { useEffect, useState } from 'react'
import CsvTable from './CsvTable'

export default function FileInfo({ file }: { file: File }) {
    const [csv, setCsv] = useState<Papa.ParseResult<any> | undefined>()

    useEffect(() => {
        Papa.parse(file, {
            header: true,
            preview: 10,
            complete(data) {
                setCsv(data)
            },
        })
    }, [file, setCsv])

    return (
        <div>
            <p>{file.name}</p>
            <p>size: {file.size}</p>
            <p>type: {file.type}</p>
            {csv && <CsvTable csv={csv} />}
            {!csv && <p>loading...</p>}
        </div>
    )
}
