import { DataSource } from '../MapVisualization'
import { Dataset } from './uploaderSlice'

export interface NewSource {
    readonly name: string
    readonly description: string
    readonly link: string
}

interface Column {
    readonly name: string
    readonly start_date: string
    readonly end_date: string
}

interface NewDataset {
    readonly columns: Column[]
    readonly name: string
    readonly short_name: string
    readonly units: string
    readonly description: string
}

export default interface UploadData {
    readonly file: File
    readonly state_id_column: string
    readonly county_id_column: string
    readonly source: { ExistingId: number } | { New: NewSource }
    readonly datasets: NewDataset[]
}

export interface FormData {
    stateColumn: string
    countyColumn: string
    source: NewSource | DataSource
    datasets: Dataset[]
    columns: string[]
    freeColumns: string[]
}

export const uploadDataFromForm = (formData: FormData, file: File): UploadData => {
    const { stateColumn, countyColumn, source, datasets } = formData

    return {
        file,
        state_id_column: stateColumn,
        county_id_column: countyColumn,
        source: 'id' in source ? { ExistingId: source.id } : { New: source },
        datasets: datasets.map(({ name, shortName, units, description, columns }) => ({
            name,
            short_name: shortName,
            units,
            description,
            columns: columns.map((column) => ({
                name: column.name,
                start_date: column.dateRange.start.toISODate(),
                end_date: column.dateRange.end.toISODate(),
            })),
        })),
    }
}
