import { DataSource } from '../MapVisualization'
import { Dataset } from './uploaderSlice'

export interface NewSource {
    readonly name: string
    readonly description: string
    readonly link: string
}

interface Column {
    readonly name: string
}

interface NewDataset {
    readonly geography_type: number
    readonly columns: Column[]
    readonly name: string
    readonly short_name: string
    readonly units: string
    readonly description: string
}

export default interface UploadData {
    readonly file: File
    readonly id_column: string
    readonly geography_type: number
    readonly date_column: string
    readonly source: { ExistingId: number } | { New: NewSource }
    readonly datasets: NewDataset[]
}

export interface FormData {
    geographyType: number
    idColumn: string
    dateColumn: string
    source: NewSource | DataSource
    datasets: Dataset[]
    columns: string[]
    freeColumns: string[]
}

export const uploadDataFromForm = (formData: FormData, file: File): UploadData => {
    const { idColumn, dateColumn, geographyType, source, datasets } = formData

    return {
        file,
        id_column: idColumn,
        date_column: dateColumn,
        geography_type: geographyType,
        source: 'id' in source ? { ExistingId: source.id } : { New: source },
        datasets: datasets.map(({ name, shortName, units, description, columns }) => ({
            geography_type: formData.geographyType,
            name,
            short_name: shortName,
            units,
            description,
            columns: columns.map((column) => ({
                name: column.name,
            })),
        })),
    }
}
