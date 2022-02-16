import Papa from 'papaparse'

export default function CsvTable({ csv }: { csv: Papa.ParseResult<any> }) {
    return (
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
    )
}
