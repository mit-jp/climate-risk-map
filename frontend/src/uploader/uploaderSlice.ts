import { createSelector, createSlice } from '@reduxjs/toolkit'
import Papa from 'papaparse'
import { v4 as uuid } from 'uuid'
import { DataSource } from '../MapVisualization'
import { RootState } from '../store'
import { FormData, NewSource } from './UploadData'

export interface Column {
    readonly name: string
}

export interface Dataset {
    readonly id: string
    readonly name: string
    readonly units: string
    readonly description: string
    readonly columns: Column[]
}

export interface DatasetDiff {
    readonly id: string
    readonly name?: string
    readonly units?: string
    readonly description?: string
}

interface UploaderState {
    readonly csv?: Papa.ParseResult<any>
    readonly geographyType: number
    readonly idColumn: string
    readonly dateColumn: string
    readonly datasets: Dataset[]
    readonly source: NewSource | DataSource
}

const emptySource: NewSource = { name: '', description: '', link: '' }

const initialState: UploaderState = {
    datasets: [],
    geographyType: 1,
    idColumn: '',
    dateColumn: '',
    source: emptySource,
}

const findColumn = (
    columns: string[] | undefined,
    preferredNames: string[],
    preferredIndex: number
): string | undefined => {
    if (!columns) {
        return undefined
    }
    const preferredName = preferredNames.find((n) => columns.includes(n))
    if (preferredName) {
        return preferredName
    }
    if (columns[preferredIndex]) {
        return columns[preferredIndex]
    }
    return undefined
}
const generateDataColumns = (datasets: Dataset[]) => datasets.flatMap((d) => d.columns)

const findFreeColumns = (
    idColumn: string,
    dateColumn: string,
    columns: string[],
    dataColumns: Column[]
): string[] => {
    if (columns.length === 0) {
        return []
    }
    const usedColumns: (string | undefined)[] = [
        idColumn,
        dateColumn,
        ...dataColumns.map((c) => c.name),
    ]
    const freeColumns = columns.filter((c) => !usedColumns.includes(c))
    return freeColumns
}

const generateNextColumn = (state: UploaderState): Column | undefined => {
    const { idColumn, dateColumn, datasets, csv } = state
    const dataColumns = generateDataColumns(datasets)
    const freeColumns = findFreeColumns(idColumn, dateColumn, csv?.meta?.fields ?? [], dataColumns)
    if (freeColumns.length === 0) {
        return undefined
    }
    return {
        name: freeColumns[0],
    }
}

const generateNextDataset = (state: UploaderState): Dataset | undefined => {
    const column = generateNextColumn(state)
    if (!column) {
        return undefined
    }
    return {
        id: uuid(),
        name: column.name,
        units: '',
        description: '',
        columns: [column],
    }
}

const generateMetadata = (
    datasets: Dataset[],
    geographyType: number,
    idColumn: string,
    dateColumn: string,
    source: NewSource | DataSource,
    columns: string[] | undefined
): FormData | undefined => {
    if (columns === undefined) {
        return undefined
    }
    const dataColumns = generateDataColumns(datasets)
    const freeColumns = findFreeColumns(idColumn, dateColumn, columns, dataColumns)
    return {
        datasets,
        geographyType,
        idColumn,
        dateColumn,
        source,
        columns,
        freeColumns,
    }
}

export const uploaderSlice = createSlice({
    name: 'uploader',
    initialState,
    reducers: {
        setCsv: (state, { payload }: { payload: Papa.ParseResult<any> }) => {
            state.csv = payload
            state.idColumn =
                findColumn(
                    state.csv.meta.fields,
                    ['id', 'geo_id', 'county_id', 'state_id', 'country_id'],
                    0
                ) ?? ''
            state.dateColumn = findColumn(state.csv.meta.fields, ['date', 'year'], 1) ?? ''
            const dataset = generateNextDataset(state)
            if (dataset) {
                state.datasets = [dataset]
            }
        },
        createDataset: (state) => {
            const dataset = generateNextDataset(state)
            if (dataset) {
                state.datasets.push(dataset)
            }
        },
        setGeographyType: (state, { payload }: { payload: number }) => {
            state.geographyType = payload
        },
        setIdColumn: (state, { payload }: { payload: string }) => {
            state.idColumn = payload
        },
        setDateColumn: (state, { payload }: { payload: string }) => {
            state.dateColumn = payload
        },
        setSourceName: (state, { payload }: { payload: string }) => {
            state.source.name = payload
        },
        setSourceLink: (state, { payload }: { payload: string }) => {
            state.source.link = payload
        },
        setSourceDescription: (state, { payload }: { payload: string }) => {
            state.source.description = payload
        },
        setExistingSource: (state, { payload }: { payload: DataSource }) => {
            state.source = payload
        },
        onDatasetChange: (state, { payload }: { payload: DatasetDiff }) => {
            const dataset = state.datasets.find((d) => d.id === payload.id)
            if (dataset) {
                Object.assign(dataset, payload)
            }
        },
        addColumn: (state, { payload }: { payload: string }) => {
            const newColumn = generateNextColumn(state)
            if (!newColumn) {
                return
            }
            const dataset = state.datasets.find((d) => d.id === payload)

            if (dataset) {
                dataset.columns.push(newColumn)
            }
        },
        selectColumn: (
            state,
            {
                payload,
            }: {
                payload: {
                    datasetId: string
                    oldName: string
                    newName: string
                    canChangeName: boolean
                }
            }
        ) => {
            const { datasetId, oldName, newName, canChangeName } = payload
            const dataset = state.datasets.find((d) => d.id === datasetId)
            if (dataset) {
                const columnIndex = dataset.columns.findIndex((c) => c.name === oldName)
                if (columnIndex !== -1) {
                    dataset.columns[columnIndex].name = newName
                    if (canChangeName) {
                        dataset.name = newName
                    }
                }
            }
        },
        deleteDataset: (state, { payload }: { payload: string }) => {
            const datasetIndex = state.datasets.findIndex((d) => d.id === payload)
            if (datasetIndex !== -1) {
                state.datasets.splice(datasetIndex, 1)
            }
        },
        removeColumn: (state, { payload }: { payload: { datasetId: string; column: string } }) => {
            const { datasetId, column } = payload
            const dataset = state.datasets.find((d) => d.id === datasetId)
            if (dataset) {
                const columnIndex = dataset.columns.findIndex((c) => c.name === column)
                if (columnIndex !== -1) {
                    dataset.columns.splice(columnIndex, 1)
                }
            }
        },
        toggleExistingSource: (state, { payload }: { payload: DataSource | undefined }) => {
            if (payload) state.source = payload
            else state.source = emptySource
        },
    },
})
export const {
    setCsv,
    createDataset,
    setGeographyType,
    setIdColumn,
    setDateColumn,
    setSourceName,
    setSourceLink,
    setSourceDescription,
    setExistingSource,
    onDatasetChange,
    addColumn,
    selectColumn,
    deleteDataset,
    removeColumn,
    toggleExistingSource,
} = uploaderSlice.actions

export const selectCsv = (state: RootState) => state.uploader.csv

export const selectDataColumns = createSelector(
    (state: RootState) => state.uploader.datasets,
    generateDataColumns
)

export const selectMetadata = createSelector(
    (state: RootState) => state.uploader.datasets,
    (state: RootState) => state.uploader.geographyType,
    (state: RootState) => state.uploader.idColumn,
    (state: RootState) => state.uploader.dateColumn,
    (state: RootState) => state.uploader.source,
    (state: RootState) => state.uploader.csv?.meta?.fields,
    generateMetadata
)

export default uploaderSlice.reducer
