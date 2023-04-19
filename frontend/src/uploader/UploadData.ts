import { DataSource } from '../MapVisualization'

export interface NewSource {
    readonly name: string
    readonly description: string
    readonly link: string
}

export interface NewDataset {
    readonly uuid: string
    readonly column: string
    readonly name: string
    readonly units: string
    readonly description: string
}

export interface ExistingDataset {
    readonly uuid: string
    readonly column: string
    readonly id: number
}

export default interface UploadData {
    readonly file: File
    readonly id_column: string
    readonly geography_type: number
    readonly date_column: string
    readonly source: { ExistingId: number } | { New: NewSource }
    readonly existing_datasets: Record<string, ExistingDataset>
    readonly new_datasets: Record<string, NewDataset>
}

export type UploadDataset = NewDataset | ExistingDataset

export interface FormData {
    geographyType: number
    idColumn: string
    dateColumn: string
    source: NewSource | DataSource
    datasets: UploadDataset[]
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
        existing_datasets: Object.fromEntries(
            Object.entries(datasets)
                .filter(([, d]) => 'id' in d)
                .map(([column, d]) => [column, d as ExistingDataset])
        ),
        new_datasets: Object.fromEntries(
            Object.entries(datasets)
                .filter(([, d]) => 'name' in d)
                .map(([column, d]) => [column, d as NewDataset])
        ),
    }
}
