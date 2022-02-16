import Papa from 'papaparse'
import css from './Uploader.module.css'

export default function CsvPreview({ csv }: { csv: Papa.ParseResult<any> }) {
    return (
        <div id={css.csvPreview}>
            <h2>Preview of the first 10 rows</h2>
            <table>
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
