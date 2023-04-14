import Papa from 'papaparse'
import css from './Uploader.module.css'
import { Column } from './uploaderSlice'

export default function CsvPreview({
    csv,
    idColumn = undefined,
    dateColumn = undefined,
    dataColumns = [],
}: {
    csv: Papa.ParseResult<any>
    idColumn?: string
    dateColumn?: string
    dataColumns?: Column[]
}) {
    const getClassName = (column: string): string | undefined => {
        if (column === idColumn) {
            return css.idColumn
        }
        if (column === dateColumn) {
            return css.dateColumn
        }
        if (dataColumns.map((c) => c.name).includes(column)) {
            return css.dataColumn
        }
        return undefined
    }

    return (
        <div id={css.csvPreview}>
            <h2>Preview of the first ten rows</h2>
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
                    {csv.data.map((row, i) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <tr key={i}>
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
