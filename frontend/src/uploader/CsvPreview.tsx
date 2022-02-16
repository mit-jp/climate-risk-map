import Papa from 'papaparse'
import { useEffect, useState } from 'react'
import css from './Uploader.module.css'

const guessCountyColumn = (csv: Papa.ParseResult<any>): string | undefined => {
    if (csv.meta.fields?.includes('COUNTYFP')) {
        return 'COUNTYFP'
    }
    return undefined
}

const guessStateColumn = (csv: Papa.ParseResult<any>): string | undefined => {
    if (csv.meta.fields?.includes('STATEFP')) {
        return 'STATEFP'
    }
    return undefined
}

export default function CsvPreview({ csv }: { csv: Papa.ParseResult<any> }) {
    const [countyColumn, setCountyColumn] = useState<string | undefined>()
    const [stateColumn, setStateColumn] = useState<string | undefined>()

    useEffect(() => {
        setCountyColumn(guessCountyColumn(csv))
        setStateColumn(guessStateColumn(csv))
    }, [csv])

    const getClassName = (column: string): string | undefined => {
        if (column === countyColumn) {
            return css.countyColumn
        }
        if (column === stateColumn) {
            return css.stateColumn
        }
        return undefined
    }

    return (
        <div id={css.csvPreview}>
            <h2>Preview of the first 10 rows</h2>
            <table>
                <colgroup>
                    {csv.meta.fields?.map((column) => (
                        <col key={column} className={getClassName(column)} />
                    ))}
                </colgroup>
                <thead>
                    <tr>
                        {csv.meta.fields?.map((column) => (
                            <th key={column}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {csv.data.map((row) => (
                        <tr key={row.id}>
                            {csv.meta.fields?.map((column) => (
                                <td key={column}>{row[column]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
